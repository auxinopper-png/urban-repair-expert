"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Loader2,
  MessageCircle,
  PartyPopper,
  Phone,
  Snowflake,
  TrendingUp,
  WashingMachine,
  Wind,
} from "lucide-react";
import { createSellRequest } from "@/app/actions/sell";
import LocationPicker, { type LocationValue } from "@/components/forms/LocationPicker";
import PhotoSlots, { type PhotoSlot } from "@/components/forms/PhotoSlots";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { uploadToBucket } from "@/lib/upload";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; fallback_text?: string; offer: number; market: number } | null>(null);
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

  function canNext() {
    switch (step) {
      case 0:
        return Boolean(appliance);
      case 1:
        return Boolean(brandId);
      case 2:
        return Boolean(modelId);
      case 3:
        return Boolean(capacityId);
      case 4:
        return Boolean(ageId);
      case 5:
        return Boolean(conditionId);
      case 6:
        return true;
      case 7:
        return location.address.trim().length >= 10;
      case 8:
        return (
          name.trim().length >= 2 &&
          /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))
        );
      default:
        return false;
    }
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const photoUrls: { type: string; url: string }[] = [];
      for (const slot of PHOTO_SLOTS.filter((s) => !s.video)) {
        const p = photos[slot.key];
        if (p?.file) {
          const url = await uploadToBucket(p.file, "sell");
          if (url) photoUrls.push({ type: slot.label, url });
        }
      }
      let videoUrl: string | null = null;
      if (photos["video"]?.file) {
        videoUrl = await uploadToBucket(photos["video"].file, "sell");
      }

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
        estimated_offer: prices!.offer,
        photos: photoUrls,
        video_url: videoUrl,
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
          fallback_text: res.fallback_text,
          offer: prices!.offer,
          market: prices!.market,
        });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function next() {
    if (step < 8) {
      setStep(step + 1);
      return;
    }
    await submit();
  }

  if (result) {
    return <SellSuccess {...result} />;
  }

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
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

          <div className="mt-5 space-y-2.5">
            {step === 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "refrigerator", label: "Refrigerator", icon: Snowflake },
                  { id: "ac", label: "Air Conditioner", icon: Wind },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAppliance(a.id as "refrigerator" | "ac");
                      resetFrom(1);
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
            ) : null}

            {step >= 1 && step <= 4
              ? renderOptions(
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
                )
              : null}

            {step === 5 ? (
              <div className="space-y-3">
                {tree.conditions.map((c) => {
                  const on = conditionId === c.id;
                  const preview = selCapacity
                    ? computePrices(selCapacity.base_value, selAge, c, tree.upliftPct)
                    : null;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setConditionId(c.id)}
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
                      {preview ? (
                        <span className="shrink-0 text-right">
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Est.
                          </span>
                          <span className="text-sm font-extrabold text-emerald-600">
                            {formatINR(preview.offer)}
                          </span>
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 6 ? (
              <PhotoSlots
                slots={PHOTO_SLOTS}
                value={photos}
                onChange={(k, v) => setPhotos((p) => ({ ...p, [k]: v }))}
              />
            ) : null}

            {step === 7 ? (
              <>
                <p className="-mt-2 text-sm text-slate-500">
                  Where should we pick up? Pin GPS for accuracy or type your full address.
                </p>
                <LocationPicker value={location} onChange={setLocation} />
              </>
            ) : null}

            {step === 8 ? (
              <>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 ring-1 ring-emerald-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Your Estimated Offer
                  </p>
                  <div className="mt-1 flex items-end gap-3">
                    <p className="text-4xl font-extrabold tracking-tight text-emerald-700">
                      {prices ? formatINR(prices.offer) : "—"}
                    </p>
                    {prices ? (
                      <p className="pb-1 text-sm text-slate-400 line-through">
                        {formatINR(prices.market)}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Up to {Math.round(tree.upliftPct)}% higher than standard exchange · final offer after inspection
                  </p>
                </div>

                <SummaryRow label="Appliance" value={`${appliance === "ac" ? "AC" : "Refrigerator"}`} />
                <SummaryRow label="Model" value={`${selBrand?.name} ${selModel?.name}`} />
                <SummaryRow label="Capacity" value={selCapacity?.label} />
                <SummaryRow label="Age" value={selAge?.label} />
                <SummaryRow label="Condition" value={selCondition?.label} />
                <SummaryRow
                  label="Photos"
                  value={`${Object.values(photos).filter((p) => p.file).length} uploaded`}
                />
                <SummaryRow label="Pickup Address" value={location.address} />

                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <div>
                    <label className="label-text">Your Name *</label>
                    <input
                      className="field"
                      placeholder="Full name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text">Mobile Number *</label>
                    <input
                      className="field"
                      placeholder="98765 43210"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={12}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^\d ]/g, ""))}
                    />
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
            <button disabled={!canNext() || submitting} onClick={next} className="btn-accent flex-1 !py-4 text-base">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Booking Pickup…
                </>
              ) : step === 8 ? (
                <>
                  Book Free Pickup <ArrowRight className="h-5 w-5" />
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

      {prices ? (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-0 bottom-[76px] z-40 px-4 lg:bottom-6 lg:left-auto lg:right-6 lg:w-80 lg:px-0"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-slate-950/95 p-4 text-white shadow-glow ring-1 ring-white/10 backdrop-blur">
            <TrendingUp className="h-8 w-8 shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Your Live Offer
              </p>
              <p className="truncate text-xl font-extrabold tracking-tight">
                {formatINR(prices.offer)}{" "}
                <span className="text-xs font-medium text-slate-400 line-through">
                  mkt {formatINR(prices.market)}
                </span>
              </p>
            </div>
            {step < 8 ? (
              <button
                onClick={() => setStep(8)}
                className="shrink-0 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-amber-300"
              >
                Get Paid
              </button>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-slate-400">
        <Info className="mr-1 inline h-3 w-3" />
        Values are fair estimates based on live scrap &amp; resale market data. Final offer is
        confirmed after a quick physical inspection at pickup — no obligation to sell.
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
  fallback_text,
  offer,
}: {
  code: string;
  fallback_text?: string;
  offer: number;
  market: number;
}) {
  const waMsg = `Hi ${SITE.name}! I booked a free pickup for my old appliance.%0A%0APickup ID: ${code}%0AEstimated Offer: ₹${offer.toLocaleString("en-IN")}%0APlease confirm.`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg text-center"
    >
      <div className="card p-8 sm:p-10">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100"
        >
          <PartyPopper className="h-12 w-12 text-emerald-600" />
        </motion.span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Free Pickup Booked!</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          Estimated offer of{" "}
          <b className="text-emerald-700">{formatINR(offer)}</b> noted. Our pickup partner will call
          you shortly to schedule the visit.
        </p>
        <div className="mx-auto mt-6 w-fit rounded-2xl bg-brand-50 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Pickup ID</p>
          <p className="mt-1 text-2xl font-extrabold tracking-wide text-brand-800">{code}</p>
        </div>
        <div className="mt-7 space-y-3">
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener"
            className="btn-wa w-full !py-4"
          >
            <MessageCircle className="h-5 w-5" /> Get Confirmation on WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={telLink()} className="btn-outline !py-3.5">
              <Phone className="h-4 w-4" /> Call Us
            </a>
            <button onClick={() => window.location.assign("/track")} className="btn-primary !py-3.5">
              Track Request
            </button>
          </div>
        </div>
        {!fallback_text ? (
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Payment via UPI or cash on pickup. Carry a copy of any old bill if available — not mandatory.
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
