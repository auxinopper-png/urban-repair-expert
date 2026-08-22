import Link from "next/link";
import { TrendingUp, Truck, Wallet, Camera, MapPin, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function SellBanner() {
  return (
    <section className="wrap py-16 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-brand-950 to-brand-900 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-amber-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 ring-1 ring-inset ring-amber-400/30">
                <TrendingUp className="h-3.5 w-3.5" /> Premium Buyback Program
              </span>
              <h2 className="mt-5 text-balance text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
                Your old AC or fridge is worth{" "}
                <span className="text-amber-400">more than you think.</span>
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-300">
                Get a live price estimate in under a minute and compare instantly — our offers are
                typically up to 20% higher than standard exchange values. Free doorstep pickup,
                instant payment.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/sell" className="btn-accent !px-8 !py-4 text-base">
                  Get My Offer <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-4 text-[15px] font-bold text-white transition hover:bg-white/10"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { icon: TrendingUp, t: "Up to 20% Higher", d: "than typical exchange offers*" },
                { icon: Truck, t: "Free Pickup", d: "from your doorstep, on your schedule" },
                { icon: Wallet, t: "Instant Payment", d: "UPI or cash the moment we pick up" },
                {
                  icon: Camera,
                  t: "60-Second Quote",
                  d: "answer 6 questions, upload photos",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10 backdrop-blur transition hover:bg-white/10"
                >
                  <b.icon className="h-6 w-6 text-amber-400" />
                  <p className="mt-3 text-sm font-extrabold">{b.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="relative mt-8 flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3" /> *Estimated comparison vs standard exchange values; final offer depends on inspection at pickup.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
