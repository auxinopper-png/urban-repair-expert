"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  PartyPopper,
  Phone,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { createBooking } from "@/app/actions/bookings";
import LocationPicker, { type LocationValue } from "@/components/forms/LocationPicker";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { SERVICES, BRANDS_BY_APPLIANCE } from "@/lib/services-data";
import { SITE, TIME_SLOTS } from "@/lib/config";
import { cn, todayISO, prettyDate, telLink } from "@/lib/utils";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const STEPS = ["Appliance & Issue", "Schedule", "Contact & Address"];

const APPLIANCE_ICONS = [Wrench, Wrench, Wrench, Wrench];

export default function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; whatsapp_text?: string } | null>(null);

  const [appliance, setAppliance] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [problemNote, setProblemNote] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [location, setLocation] = useState<LocationValue>({ address: "", lat: null, lng: null });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const a = params.get("appliance");
    if (a && SERVICES.some((s) => s.id === a)) {
      setAppliance(a);
      setStep(0);
    }
  }, [params]);

  const svc = SERVICES.find((s) => s.id === appliance);

  function toggleProblem(p: string) {
    setProblems((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function pickPhoto(f: File | undefined | null) {
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  const [errors, setErrors] = useState<string[]>([]);
  function isErr(k: string) {
    return errors.includes(k);
  }
  function clearErr(k: string) {
    setErrors((e) => (e.includes(k) ? e.filter((x) => x !== k) : e));
  }
  const errCls = (k: string) =>
    isErr(k) ? "!border-rose-400 focus:!border-rose-400 focus:!ring-rose-500/10" : "";
  function ErrLine({ k, msg }: { k: string; msg: string }) {
    return isErr(k) ? (
      <p className="mt-1 text-[11px] font-semibold text-rose-600">{msg}</p>
    ) : null;
  }

  function validateStep(s: number): { key: string; msg: string }[] {
    if (s === 0) {
      const list: { key: string; msg: string }[] = [];
      if (!appliance) list.push({ key: "appliance", msg: "Please select an appliance first" });
      if (!brand) list.push({ key: "brand", msg: "Please select a brand" });
      return list;
    }
    if (s === 1) {
      const list: { key: string; msg: string }[] = [];
      if (name.trim().length < 2) list.push({ key: "name", msg: "Please enter your name" });
      if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10)))
        list.push({ key: "mobile", msg: "Please enter a valid 10-digit mobile number" });
      if (!date) list.push({ key: "date", msg: "Please select a visit date" });
      return list;
    }
    const list: { key: string; msg: string }[] = [];
    if (location.address.trim().length < 10)
      list.push({ key: "address", msg: "Please enter your complete doorstep address" });
    return list;
  }

  function tryContinue() {
    const errs = validateStep(step);
    if (errs.length) {
      setErrors(errs.map((e) => e.key));
      requestAnimationFrame(() => {
        document
          .getElementById(`fld-${errs[0].key}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return false;
    }
    setErrors([]);
    return true;
  }

  async function submit() {
    setError(null);
    if (!svc) return;
    setSubmitting(true);
    try {
      const res = await createBooking({
        customer_name: name.trim(),
        mobile,
        appliance: svc.id,
        appliance_label: svc.label,
        brand,
        model: model || undefined,
        problems: problems.length ? problems : ["General Service"],
        problem_note: problemNote || undefined,
        preferred_date: date,
        preferred_slot: slot,
        address: location.address.trim(),
        lat: location.lat,
        lng: location.lng,
        website,
        recaptcha_token: await getRecaptchaToken("booking"),
      });
      if (!res.ok) {
        setError(res.error || "Something went wrong. Please try again or call us.");
      } else {
        setResult({ code: res.code!, whatsapp_text: res.whatsapp_text });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <SuccessScreen code={result.code} whatsappText={result.whatsapp_text} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition",
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                      : "bg-slate-100 text-slate-400"
                )}
              >
                {i < step ? <CheckCircle2 className="h-4.5 w-4.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[13px] font-bold sm:block",
                  i === step ? "text-slate-900" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <span
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < step ? "bg-emerald-400" : "bg-slate-100"
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="card p-6 sm:p-8"
        >
          {step === 0 ? (
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">What needs fixing?</h2>
              <p className="mt-1 text-sm text-slate-500">
                Pick your appliance — takes just a few taps.
              </p>

              <div
                id="fld-appliance"
                className={cn(
                  "mt-5 grid grid-cols-2 gap-3 rounded-3xl",
                  isErr("appliance") && "bg-rose-50/60 p-1 -m-1 outline outline-2 outline-rose-300"
                )}
              >
                {SERVICES.map((s, i) => {
                  const Icon = APPLIANCE_ICONS[i];
                  const active = appliance === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setAppliance(s.id);
                        setProblems([]);
                        setBrand("");
                        clearErr("appliance");
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98]",
                        active
                          ? "border-brand-600 bg-brand-50"
                          : "border-slate-100 bg-white hover:border-brand-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span>
                        <span className="block text-[14.5px] font-bold leading-tight text-slate-900">
                          {s.short}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">{s.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <ErrLine k="appliance" msg="Please select an appliance first" />

              {appliance ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label-text">Brand *</label>
                      <select
                        value={brand}
                        onChange={(e) => {
                          setBrand(e.target.value);
                          clearErr("brand");
                        }}
                        className={cn("field", errCls("brand"))}
                      >
                        <option value="">Select brand</option>
                        {(BRANDS_BY_APPLIANCE[appliance as keyof typeof BRANDS_BY_APPLIANCE] ?? []).map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <ErrLine k="brand" msg="Please select a brand" />
                    </div>
                    <div>
                      <label className="label-text">
                        Model <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <input
                        className="field"
                        placeholder="e.g. GL-D241 / 185V Vectra"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">What's the problem?</label>
                    <div className="flex flex-wrap gap-2">
                      {svc!.problems.map((p) => {
                        const on = problems.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => toggleProblem(p)}
                            className={cn(
                              "chip",
                              on && "!border-brand-600 !bg-brand-600 !text-white"
                            )}
                          >
                            {on ? "✓ " : ""}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      rows={2}
                      className="field mt-3 resize-none"
                      placeholder="Describe anything else that helps (optional)"
                      value={problemNote}
                      onChange={(e) => setProblemNote(e.target.value)}
                    />
                  </div>
                </motion.div>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">When should we visit?</h2>
              <p className="mt-1 text-sm text-slate-500">
                Same-day slots are usually available when you book before 5 PM.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-text">Your Name *</label>
                  <input
                    id="fld-name"
                    className={cn("field", errCls("name"))}
                    placeholder="Full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearErr("name");
                    }}
                  />
                  <ErrLine k="name" msg="Please enter your name" />
                </div>
                <div>
                  <label className="label-text">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-slate-400">
                      +91
                    </span>
                    <input
                      id="fld-mobile"
                      className={cn("field !pl-13", errCls("mobile"))}
                      placeholder="98765 43210"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={12}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/[^\d ]/g, ""));
                        clearErr("mobile");
                      }}
                    />
                    {/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10)) ? (
                      <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                    ) : null}
                  </div>
                  <ErrLine k="mobile" msg="Enter a valid 10-digit mobile number" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-text">Preferred Date *</label>
                  <input
                    id="fld-date"
                    type="date"
                    min={todayISO()}
                    className={cn("field", errCls("date"))}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      clearErr("date");
                    }}
                  />
                  <ErrLine k="date" msg="Select a visit date" />
                </div>
                <div>
                  <label className="label-text">Preferred Time *</label>
                  <select value={slot} onChange={(e) => setSlot(e.target.value)} className="field">
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {["Same-Day Service", "Live Status Updates", "180-Day Warranty"].map((text) => (
                  <span
                    key={text}
                    className="rounded-full bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Where should we come?</h2>
              <p className="mt-1 text-sm text-slate-500">
                Share your doorstep address — pin GPS for faster navigation.
              </p>

              <div className="mt-5 space-y-5">
                <div id="fld-address">
                  <LocationPicker
                    value={location}
                    onChange={(v) => {
                      setLocation(v);
                      clearErr("address");
                    }}
                    error={isErr("address")}
                  />
                  <ErrLine k="address" msg="Please write your complete doorstep address (house no., street, area, pincode)" />
                </div>

                <div>
                  <label className="label-text">
                    Add a Photo <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200">
                        <Image src={photoPreview} alt="Issue" fill unoptimized className="object-cover" />
                      </div>
                    ) : (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-brand-400 hover:text-brand-600">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => pickPhoto(e.target.files?.[0])}
                        />
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8">
                          <path d="M4 7h3l2-3h6l2 3h3v13H4V7z" strokeLinejoin="round" />
                          <circle cx="12" cy="13" r="3.5" />
                        </svg>
                        <span className="text-[10px] font-bold">Take Photo</span>
                      </label>
                    )}
                    <p className="text-xs leading-relaxed text-slate-400">
                      A quick snap helps our technician arrive prepared. After booking, attach it
                      in the WhatsApp chat — nothing is uploaded or stored on our servers.
                    </p>
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

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Booking Summary
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>
                      <b>{svc?.label}</b> · {brand} {model}
                    </li>
                    {problems.length ? <li>{problems.join(", ")}</li> : null}
                    <li>
                      <CalendarDays className="mr-1 inline h-4 w-4 text-brand-500" />
                      {prettyDate(date)} · {slot}
                    </li>
                  </ul>
                </div>
              </div>

              {error ? (
                <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-outline !px-5">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : null}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => {
                  if (tryContinue()) setStep(step + 1);
                }}
                className="btn-primary flex-1 !py-4"
              >
                Continue <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  if (tryContinue()) submit();
                }}
                className="btn-primary flex-1 !py-4 text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Confirming…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Confirm Booking — It's Free
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SuccessScreen({
  code,
  whatsappText,
}: {
  code: string;
  whatsappText?: string;
}) {
  const waConfirm = `Hi ${SITE.name}! I just booked a repair online.\n\nBooking ID: ${code}\nPlease confirm my booking.`;
  const waUrl = whatsappText
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappText)}`
    : `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waConfirm)}`;
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
            Your full booking details are already typed in the message. Press{" "}
            <b className="text-slate-700">Send</b> and attach your appliance photo in the same
            chat — our team will confirm your slot instantly.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="btn-wa mt-4 w-full !py-3.5"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" /> Details didn&apos;t open? Tap here
          </a>
        </div>

        <div className="mt-6 rounded-2xl bg-brand-50 px-5 py-4 ring-1 ring-brand-100">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600">
            Your Tracking ID
          </p>
          <p className="mt-1 text-3xl font-black tracking-wider text-brand-900">{code}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-500">
            Save this — track your booking anytime on the Track page with just this ID.
          </p>
        </div>

        <a href={telLink()} className="btn-outline mt-6 w-full !py-3.5">
          <Phone className="h-4 w-4" /> Call Us Instead
        </a>
      </div>
    </motion.div>
  );
}
