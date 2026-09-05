import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Truck, Wallet, Camera, BadgeCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const SELL_ITEMS = [
  {
    label: "Old AC",
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Frigidaire_Window_Air_Conditioner_-_exterior.jpg/1280px-Frigidaire_Window_Air_Conditioner_-_exterior.jpg",
  },
  {
    label: "Old Refrigerator",
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Beautiful_magnets_on_a_vintage_fridge_%28Unsplash%29.jpg/1280px-Beautiful_magnets_on_a_vintage_fridge_%28Unsplash%29.jpg",
  },
];

export default function SellBanner() {
  return (
    <section className="wrap pt-14 pb-16 lg:pt-20 lg:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-brand-950 to-brand-900 px-6 py-12 text-white shadow-glow sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-amber-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-200 ring-1 ring-inset ring-white/20">
                Premium Buyback
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-300 ring-1 ring-inset ring-amber-400/40">
                <TrendingUp className="h-3.5 w-3.5" />
                Up to 20% Higher than Market Rate
              </span>
            </div>

            <h2 className="mt-5 max-w-2xl text-balance text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Sell Old AC &amp; Refrigerator at the{" "}
              <span className="text-amber-400">best price in the city.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Live price estimation in under a minute, free doorstep pickup and instant payment —
              consistently higher than standard exchange offers.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SELL_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href="/sell"
                  className="group overflow-hidden rounded-[24px] bg-white/[0.06] ring-1 ring-inset ring-white/15 transition hover:-translate-y-1 hover:bg-white/10 hover:ring-amber-400/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                    <p className="text-base font-extrabold sm:text-lg">{item.label}</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 transition group-hover:bg-amber-300">
                      Sell Now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: TrendingUp, t: "Best Price" },
                { icon: Truck, t: "Free Pickup" },
                { icon: Wallet, t: "Instant Payment" },
                { icon: Camera, t: "60-Second Quote" },
              ].map((f) => (
                <div
                  key={f.t}
                  className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3.5 py-3 ring-1 ring-inset ring-white/10"
                >
                  <f.icon className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                  <p className="text-[13px] font-bold">{f.t}</p>
                </div>
              ))}
            </div>

            <Link href="/sell" className="btn-accent mt-7 w-full !py-4 text-base">
              Sell Now — Get Best Price <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-7 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              *Estimated comparison vs standard exchange values. Final offer depends on appliance
              condition, model and inspection at pickup.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
