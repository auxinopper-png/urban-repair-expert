import Reveal from "@/components/Reveal";
import { Clock3 } from "lucide-react";

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

      <div className="wrap relative pb-6 pt-12 sm:pt-16 lg:pb-8 lg:pt-20">
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
      </div>
    </section>
  );
}
