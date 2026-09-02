"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Loader2,
  PartyPopper,
  Phone,
  Snowflake,
  TrendingUp,
  Wind,
} from "lucide-react";
import { createSellRequest } from "@/app/actions/sell";
import LocationPicker, { type LocationValue } from "@/components/forms/LocationPicker";
import PhotoSlots, { type PhotoSlot } from "@/components/forms/PhotoSlots";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { computePrices, type PricingTree } from "@/lib/pricing";
import { SITE } from "@/lib/config";
import { cn, formatINR, telLink } from "@/lib/utils";

const STEP_LABELS = [
  "Appliance",
  "Brand",
  "Model",
  "Capacity",
  "Age",
  "Condition",
  "Photos",
  "Pickup Area",
  "Get Offer",
];

const PHOTO_SLOTS = [
  { key: "front", label: "Front", required: true },
  { key: "back", label: "Back" },
  { key: "inside", label: "Inside" },
  { key: "sticker", label: "Model Sticker" },
  { key: "video", label: "Short Video", video: true },
];

export default function SellWizard({ tree }: { tree: PricingTree }) {
  const [step, setStep] = useState(0);
  const [appliance, setAppliance] = useState<"refrigerator" | "ac" | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [capacityId, setCapacityId] = useState<string | null>(null);
  const [ageId, setAgeId] = useState<number | null>(null);
  const [conditionId, setConditionId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Record<string, PhotoSlot>>({});
  const [location, setLocation] = useState<LocationValue>({ address: "", lat: null, lng: null });
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otherOffer, setOtherOffer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; whatsapp_text?: string; offer: number; market: number } | null>(null);
  const [website, setWebsite] = useState("");

  const brands = useMemo(
    () => tree.brands.filter((b) => b.models.length > 0),
    [tree]
  );

  const applianceBrands = useMemo(() => {
    if (!appliance) return [];
    return brands.filter((b) => b.models.some((m) => m.appliance === appliance));
  }, [brands, appliance]);

  const selBrand = brands.find((b) => b.id === brandId) || null;
  const models = selBrand
    ? selBrand.models.filter((m) => !appliance || m.appliance === appliance)
    : [];
  const selModel = models.find((m) => m.id === modelId) || null;
  const capacities = selModel ? selModel.capacities : [];
  const selCapacity = capacities.find((c) => c.id === capacityId) || null;
  const selAge = tree.ages.find((a) => a.id === ageId) || null;
  const selCondition = tree.conditions.find((c) => c.id === conditionId) || null;

  const prices =
    selCapacity && selAge && selCondition
      ? computePrices(selCapacity.base_value, selAge, selCondition, tree.upliftPct)
      : null;

  const otherVal = Math.round(parseFloat(otherOffer.replace(/[^\d.]/g, "")) || 0);
  const effPrices =
    prices && otherVal > 0
      ? {
          market: prices.market,
          offer: Math.max(prices.offer, Math.round(otherVal * (1 + tree.upliftPct / 100))),
        }
      : prices;
  const beatBy = effPrices && otherVal > 0 ? effPrices.offer - otherVal : 0;

  const pricesRef = useRef(prices);
  pricesRef.current = prices;

  useEffect(() => {
    function onAcceptOffer() {
      if (pricesRef.current) {
        setStep(8);
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      } else {
        document
          .getElementById("sell-wizard")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    window.addEventListener("ure:accept-offer", onAcceptOffer);
    return () => window.removeEventListener("ure:accept-offer", onAcceptOffer);
  }, []);

  function resetFrom(index: number) {
    if (index <= 1) {
      setBrandId(null);
      setModelId(null);
      setCapacityId(null);
    }
    if (index <= 2) {
      setModelId(null);
      setCapacityId(null);
    }
    if (index <= 3) setCapacityId(null);
  }

  const [errKey, setErrKey] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const isErr = (k: string) => errKey === k;

  function validateStep(s: number): { key: string; msg: string } | null {
    switch (s) {
      case 0:
        return appliance ? null : { key: "appliance", msg: "Please select an appliance first" };
      case 1:
        return brandId ? null : { key: "brand", msg: "Please select a brand" };
      case 2:
        return modelId ? null : { key: "model", msg: "Please select a model / series" };
      case 3:
        return capacityId ? null : { key: "capacity", msg: "Please select a capacity" };
      case 4:
        return ageId ? null : { key: "age", msg: "Please select the appliance age" };
      case 5:
        return conditionId ? null : { key: "condition", msg: "Please select the condition" };
      case 6:
        return photos["front"]?.file
          ? null
          : {
              key: "photos",
              msg: "Please upload a Front photo of your appliance to get your final offer",
            };
      case 7:
        return location.address.trim().length >= 10
          ? null
          : { key: "address", msg: "Please enter your complete doorstep address" };
      case 8: {
        if (name.trim().length < 2) return { key: "sname", msg: "Please enter your name" };
        if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10)))
          return { key: "smobile", msg: "Please enter a valid 10-digit mobile number" };
        if (location.address.trim().length < 10)
          return { key: "address", msg: "Please enter your complete doorstep address" };
        return null;
      }
      default:
        return null;
    }
  }

  function tryNext() {
    const err = validateStep(step);
    if (err) {
      if (step === 8 && err.key === "address") setStep(7);
      setErrKey(err.key);
      setErrMsg(err.msg);
      requestAnimationFrame(() => {
        document
          .getElementById(`fld-${err.key}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setErrKey(null);
    setErrMsg("");
    if (step < 8) setStep(step + 1);
    else submit();
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await createSellRequest({
        customer_name: name.trim(),
        mobile,
        appliance: appliance!,
        appliance_label: appliance === "ac" ? "Air Conditioner" : "Refrigerator",
        brand_name: selBrand!.name,
        model_name: selModel!.name,
        capacity_label: selCapacity!.label,
        age_label: selAge!.label,
        condition_label: selCondition!.label,
        estimated_market: prices!.market,
        estimated_offer: effPrices!.offer,
        other_offer: otherVal > 0 ? otherVal : null,
        address: location.address.trim(),
        lat: location.lat,
        lng: location.lng,
        website,
        recaptcha_token: await getRecaptchaToken("sell"),
      });

      if (!res.ok) setError(res.error || "Something went wrong. Please try again.");
      else
        setResult({
          code: res.code!,
          whatsapp_text: res.whatsapp_text,
          offer: effPrices!.offer,
          market: prices!.market,
        });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <SellSuccess {...result} />;
  }

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div id="sell-wizard" className="mx-auto max-w-2xl">
      <div className="sticky top-[64px] z-30 -mx-4 mb-6 bg-white/90 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span>{STEP_LABELS[step]}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="card p-6 sm:p-8"
        >
          <h2 className="text-xl font-extrabold tracking-tight">{STEP_LABELS[step]}</h2>
          {errMsg && isErr(errKey ?? "") ? (
            <p className="mt-2 text-[11px] font-semibold text-rose-600">{errMsg}</p>
          ) : null}

          <div className="mt-5 space-y-2.5">
            {step === 0 ? (
              <>
                <div
                  id="fld-appliance"
                  className={cn(
                    "grid grid-cols-2 gap-3 rounded-3xl",
                    isErr("appliance") && "bg-rose-50/60 p-1 -m-1 outline outline-2 outline-rose-300"
                  )}
                >
                  {[
                    { id: "refrigerator", label: "Refrigerator", icon: Snowflake },
                    { id: "ac", label: "Air Conditioner", icon: Wind },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setAppliance(a.id as "refrigerator" | "ac");
                        resetFrom(1);
                        setErrKey(null);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition active:scale-[0.98]",
                        appliance === a.id
                          ? "border-brand-600 bg-brand-50 shadow-glow"
                          : "border-slate-100 hover:border-brand-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-2xl",
                          appliance === a.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        <a.icon className="h-9 w-9" />
                      </span>
                      <span className="text-base font-bold text-slate-900">{a.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {step >= 1 && step <= 4
              ? (() => {
                  const k = step === 1 ? "brand" : step === 2 ? "model" : step === 3 ? "capacity" : "age";
                  return (
                    <div
                      id={`fld-${k}`}
                      className={cn("rounded-2xl", isErr(k) && "outline outline-2 outline-rose-300")}
                    >
                      {renderOptions(
                        step === 1
                          ? applianceBrands.map((b) => ({ value: b.id, label: b.name }))
                          : step === 2
                            ? models.map((m) => ({ value: m.id, label: m.name }))
                            : step === 3
                              ? capacities.map((c) => ({
                                  value: c.id,
                                  label: c.label,
                                }))
                              : tree.ages.map((a) => ({ value: String(a.id), label: a.label })),
                        step === 1 ? (brandId ?? "") : step === 2 ? (modelId ?? "") : step === 3 ? (capacityId ?? "") : ageId ? String(ageId) : "",
                        (v: string) => {
                          setErrKey(null);
                          if (step === 1) {
                            setBrandId(v);
                            setModelId(null);
                            setCapacityId(null);
                          } else if (step === 2) {
                            setModelId(v);
                            setCapacityId(null);
                          } else if (step === 3) setCapacityId(v);
                          else setAgeId(Number(v));
                        }
                      )}
                    </div>
                  );
                })()
              : null}

            {step === 5 ? (
              <div
                id="fld-condition"
                className={cn(
                  "space-y-3 rounded-2xl",
                  isErr("condition") && "outline outline-2 outline-rose-300"
                )}
              >
                {tree.conditions.map((c) => {
                  const on = conditionId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setConditionId(c.id);
                        setErrKey(null);
                      }}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.99]",
                        on ? "border-brand-600 bg-brand-50" : "border-slate-100 hover:border-brand-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                          on ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {on ? "✓" : c.label.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-slate-900">{c.label}</span>
                        <span className="block truncate text-xs text-slate-400">{c.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 6 ? (
              <div
                id="fld-photos"
                className={cn("rounded-2xl", isErr("photos") && "outline outline-2 outline-rose-300")}
              >
                <p className="-mt-2 mb-3 text-sm text-slate-500">
                  Front photo is required — clear photos help us confirm your final offer without
                  re-negotiation at pickup.
                </p>
                <PhotoSlots
                  slots={PHOTO_SLOTS}
                  value={photos}
                  onChange={(k, v) => {
                    setPhotos((p) => ({ ...p, [k]: v }));
                    if (k === "front") setErrKey(null);
                  }}
                />
              </div>
            ) : null}

            {step === 7 ? (
              <div id="fld-address">
                <p className="-mt-2 text-sm text-slate-500">
                  Where should we pick up? Pin GPS for accuracy or type your full address.
                </p>
                <div className="mt-4">
                  <LocationPicker
                    value={location}
                    onChange={(v) => {
                      setLocation(v);
                      setErrKey(null);
                    }}
                    error={isErr("address")}
                  />
                  {isErr("address") ? (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      Please enter your complete doorstep address (house no., street, area, pincode)
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 8 ? (
              <>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 ring-1 ring-emerald-100">
                  <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Your Final Offer
                  </p>
                  <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-500">
                        Standard Exchange Value
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-slate-500">
                        {prices ? formatINR(prices.market) : "—"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <ArrowRight className="h-5 w-5 text-emerald-500" />
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                        +{Math.round(tree.upliftPct)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase leading-tight tracking-wide text-emerald-700">
                        Urban Repair Expert
                      </p>
                      <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-700">
                        {effPrices ? formatINR(effPrices.offer) : "—"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-emerald-700">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                    {Math.round(tree.upliftPct)}% higher than standard exchange · final confirmation
                    after inspection at pickup
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <label className="label-text !mb-1">
                    Got an offer from another buyer / exchange?{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                    <input
                      className="field !pl-9"
                      placeholder="e.g. 2500"
                      inputMode="numeric"
                      value={otherOffer}
                      onChange={(e) => setOtherOffer(e.target.value.replace(/[^\d]/g, ""))}
                    />
                  </div>
                  {beatBy > 0 ? (
                    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-slate-50 p-3 text-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Other Exchange Offer</p>
                        <p className="text-lg font-extrabold text-slate-500 line-through">{formatINR(otherVal)}</p>
                      </div>
                      <ArrowRight className="mx-auto h-4 w-4 text-slate-300" />
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-brand-600">Urban Repair Expert</p>
                        <p className="text-lg font-extrabold text-brand-700">{formatINR(effPrices!.offer)}</p>
                      </div>
                      <p className="col-span-3 rounded-lg bg-emerald-100 py-1.5 text-xs font-extrabold text-emerald-800">
                        You get {formatINR(beatBy)} more with us
                      </p>
                    </div>
                  ) : otherVal > 0 ? (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                      Our offer is already the best — {formatINR(prices!.offer)}!
                    </p>
                  ) : null}
                </div>

                <SummaryRow label="Appliance" value={`${appliance === "ac" ? "AC" : "Refrigerator"}`} />
                <SummaryRow label="Model" value={`${selBrand?.name} ${selModel?.name}`} />
                <SummaryRow label="Capacity" value={selCapacity?.label} />
                <SummaryRow label="Age" value={selAge?.label} />
                <SummaryRow label="Condition" value={selCondition?.label} />
                {otherVal > 0 ? <SummaryRow label="Other Exchange Offer" value={formatINR(otherVal)} /> : null}
                <SummaryRow
                  label="Photos"
                  value={`${Object.values(photos).filter((p) => p.file).length} selected — attach in WhatsApp`}
                />
                <SummaryRow label="Pickup Address" value={location.address} />

                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <div>
                    <label className="label-text">Your Name *</label>
                    <input
                      id="fld-sname"
                      className={cn("field", isErr("sname") && "!border-rose-400 focus:!border-rose-400 focus:!ring-rose-500/10")}
                      placeholder="Full name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (isErr("sname")) setErrKey(null);
                      }}
                    />
                    {isErr("sname") ? (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">Please enter your name</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label-text">Mobile Number *</label>
                    <input
                      id="fld-smobile"
                      className={cn("field", isErr("smobile") && "!border-rose-400 focus:!border-rose-400 focus:!ring-rose-500/10")}
                      placeholder="98765 43210"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={12}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/[^\d ]/g, ""));
                        if (isErr("smobile")) setErrKey(null);
                      }}
                    />
                    {isErr("smobile") ? (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">
                        Please enter a valid 10-digit mobile number
                      </p>
                    ) : null}
                  </div>
                </div>

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  aria-hidden
                />
              </>
            ) : null}
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex gap-3">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-outline !px-5">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : null}
            <button disabled={submitting} onClick={tryNext} className="btn-accent flex-1 !py-4 text-base">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Booking Pickup…
                </>
              ) : step === 8 ? (
                <>
                  Accept Offer &amp; Schedule Pickup <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-slate-400">
        <Info className="mr-1 inline h-3 w-3" />
        The Standard Exchange Value is an estimate based on typical online exchange rates. The
        final offer is confirmed after a quick inspection of your appliance at pickup — there is
        no obligation to sell.
      </p>
    </div>
  );
}

function renderOptions(
  options: { value: string; label: string }[],
  selected: string,
  onSelect: (v: string) => void
) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {options.map((o) => {
        const on = selected === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onSelect(o.value)}
            className={cn(
              "rounded-2xl border-2 px-3 py-3.5 text-left text-[14px] font-bold transition active:scale-[0.98]",
              on
                ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                : "border-slate-100 bg-white text-slate-700 hover:border-brand-300"
            )}
          >
            {on ? "✓ " : ""}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-100 pb-2.5">
      <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function SellSuccess({
  code,
  whatsapp_text,
  offer,
}: {
  code: string;
  whatsapp_text?: string;
  offer: number;
  market: number;
}) {
  const waMsg = `Hi ${SITE.name}! I booked a free pickup for my old appliance.\n\nPickup ID: ${code}\nEstimated Offer: ₹${offer.toLocaleString("en-IN")}\nPlease confirm.`;
  const waUrl = whatsapp_text
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsapp_text)}`
    : `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMsg)}`;
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setOpened(true);
      window.location.assign(waUrl);
    }, 800);
    return () => clearTimeout(t);
  }, [waUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg text-center"
    >
      <div className="card p-6 sm:p-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 ring-1 ring-emerald-100">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 16 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30"
          >
            <WhatsAppIcon className="h-8 w-8" />
          </motion.span>
          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
            {opened ? "WhatsApp opened — just press Send!" : "Opening WhatsApp with your details…"}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Your offer of <b className="text-emerald-700">{formatINR(offer)}</b> is locked in. The
            full pickup details are already typed — press <b className="text-slate-700">Send</b>{" "}
            and attach your appliance photos in the same chat. Our pickup partner will call you to
            schedule the visit.
          </p>
          <a href={waUrl} target="_blank" rel="noopener" className="btn-wa mt-4 w-full !py-3.5">
            <WhatsAppIcon className="h-5 w-5 shrink-0" /> Details didn&apos;t open? Tap here
          </a>
        </div>

        <div className="mt-6 rounded-2xl bg-brand-50 px-5 py-4 ring-1 ring-brand-100">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600">
            Your Tracking ID
          </p>
          <p className="mt-1 text-3xl font-black tracking-wider text-brand-900">{code}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-500">
            Save this — track your pickup anytime on the Track page with just this ID.
          </p>
        </div>

        <a href={telLink()} className="btn-outline mt-6 w-full !py-3.5">
          <Phone className="h-4 w-4" /> Call Us Instead
        </a>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Payment via UPI or cash on pickup. Carry a copy of any old bill if available — not
          mandatory.
        </p>
      </div>
    </motion.div>
  );
}
