import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Clock3,
  IndianRupee,
  ShieldCheck,
  Snowflake,
  Truck,
  Wallet,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/services-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="wrap relative pb-14 pt-12 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
              <Clock3 className="h-3.5 w-3.5" />
              Same-Day Doorstep Service · 180-Day Warranty
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-balance text-[34px] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]">
              Appliance trouble?{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Fixed today.
              </span>{" "}
              Old appliance?{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Sold at best price.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-base">
              Expert repair for AC, refrigerator, washing machine &amp; geyser — plus the
              best-value buyback for your old appliances. Booked in under 60 seconds.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* ── BOOK REPAIR ─────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="group relative h-full rounded-[28px] bg-gradient-to-br from-brand-600 via-brand-500 to-sky-400 p-[3px] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <Link
                href="/book"
                className="flex h-full flex-col rounded-[25px] bg-white p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                    <Wrench className="h-6.5 w-6.5" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Available Today
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
                  Book Repair Service
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Verified experts at your doorstep, often within 2–4 hours. Pay only after the job
                  is done.
                </p>

                <ul className="mt-5 space-y-2.5 text-[13.5px] font-semibold text-slate-600">
                  {SERVICES.map((s) => (
                    <li key={s.id} className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                      {s.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <span className="btn-primary w-full !py-4 text-base group-hover:!bg-brand-700">
                    Book Repair Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <p className="mt-3 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> 180-Day Warranty
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-brand-500" /> Transparent Price
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          </Reveal>

          {/* ── SELL NOW ────────────────────────────────── */}
          <Reveal delay={0.18}>
            <Link
              href="/sell"
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-amber-200/60 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 p-6 text-white shadow-glow transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 animate-float rounded-full bg-amber-400/20 blur-2xl"
              />
              <div className="relative flex items-center justify-between">
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30">
                  <Snowflake className="h-6.5 w-6.5" />
                </span>
                <span className="rounded-full bg-amber-400/15 px-3 py-1.5 text-[11px] font-extrabold text-amber-300 ring-1 ring-inset ring-amber-400/30">
                  Up to 20% Higher Offer
                </span>
              </div>

              <h2 className="relative mt-5 text-2xl font-extrabold tracking-tight">
                Sell Old AC &amp; Refrigerator
              </h2>
              <p className="relative mt-1 text-sm leading-relaxed text-slate-300">
                Get a live price estimate in under a minute — better than any exchange offer.
              </p>

              <ul className="relative mt-5 space-y-2.5 text-[13.5px] font-semibold text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Zap className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                  Live price estimation — instant quote
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                  Free doorstep pickup, on your schedule
                </li>
                <li className="flex items-center gap-2.5">
                  <Wallet className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                  Instant payment — UPI or cash on the spot
                </li>
              </ul>

              <div className="relative mt-auto pt-6">
                <span className="btn-accent w-full !py-4 text-base group-hover:!bg-amber-300">
                  Sell Now — Get Best Price
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <p className="mt-3 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5 text-amber-400/80" /> 60-Second Quote
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5 text-amber-400/80" /> AC &amp; Fridge
                  </span>
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
