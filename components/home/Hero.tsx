import Link from "next/link";
import { ArrowRight, Snowflake, Wrench, BadgeCheck } from "lucide-react";
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
              Expert repair for AC, refrigerator, washing machine & geyser — plus the best-value
              buyback for your old appliances. Booked in under 60 seconds.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal delay={0.1}>
            <div className="group relative h-full overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow sm:p-8">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-[80px] bg-brand-50" aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                    <Wrench className="h-7 w-7" />
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Available Today
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
                  Book Repair Service
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Certified experts at your doorstep, often within 2–4 hours.
                </p>

                <ul className="mt-5 grid grid-cols-2 gap-2.5">
                  {SERVICES.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 text-[13px] font-semibold text-slate-700"
                    >
                      <BadgeCheck className="h-4 w-4 shrink-0 text-brand-600" />
                      {s.short}
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 space-y-1.5 text-[13px] text-slate-500">
                  <li className="flex items-center gap-2">Genuine spare parts with warranty</li>
                  <li className="flex items-center gap-2">Fair pricing · Pay after service</li>
                </ul>

                <Link href="/book" className="btn-primary mt-6 w-full !py-4 text-base group-hover:!bg-brand-700">
                  Book Service Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="group relative h-full overflow-hidden rounded-[28px] border border-amber-100 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 p-6 text-white shadow-glow transition hover:-translate-y-1 sm:p-8">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-float rounded-full bg-amber-400/20 blur-2xl"
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30">
                    <Snowflake className="h-7 w-7" />
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur">
                    Up to 20% Higher Offer*
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
                  Sell Old AC & Refrigerator
                </h2>
                <p className="mt-1.5 text-sm text-slate-300">
                  Premium buyback with live price estimation — like an exchange, only better.
                </p>

                <ul className="mt-5 grid grid-cols-2 gap-2.5">
                  {["Best Price", "Free Pickup", "Instant Payment", "Live Estimation"].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[13px] font-semibold text-slate-100 ring-1 ring-inset ring-white/10"
                    >
                      <BadgeCheck className="h-4 w-4 shrink-0 text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 space-y-1.5 text-[13px] text-slate-400">
                  <li className="flex items-center gap-2">Photo upload + GPS pickup scheduling</li>
                  <li className="flex items-center gap-2">UPI / cash payment on the spot</li>
                </ul>

                <Link href="/sell" className="btn-accent mt-6 w-full !py-4 text-base">
                  Sell Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-slate-500">
                  *Estimated comparison vs standard exchange values. Final offer after inspection.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
