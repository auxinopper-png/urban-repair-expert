import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench, Clock3, ShieldCheck, BadgeCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const REPAIR_ITEMS = [
  {
    id: "ac",
    label: "AC Repair",
    img: "/images/ac-repair.jpg",
  },
  {
    id: "refrigerator",
    label: "Fridge Repair",
    img: "/images/fridge-repair.jpg",
  },
  {
    id: "washing_machine",
    label: "Washing Machine",
    img: "/images/washing-machine-repair.jpg",
  },
  {
    id: "geyser",
    label: "Geyser Repair",
    img: "/images/geyser-repair.jpg",
  },
];

export default function RepairBanner() {
  return (
    <section className="wrap pb-16 lg:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-brand-950 to-brand-900 px-6 py-12 text-white shadow-glow sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-float rounded-full bg-brand-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-200 ring-1 ring-inset ring-white/20">
                Doorstep Repair Service
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-300 ring-1 ring-inset ring-brand-400/40">
                <Clock3 className="h-3.5 w-3.5" />
                Same-Day Visit
              </span>
            </div>

            <h2 className="mt-5 max-w-2xl text-balance text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Broken appliance?{" "}
              <span className="text-amber-400">Get it fixed today.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
              AC, refrigerator, washing machine &amp; geyser — verified technicians reach your
              doorstep within hours. Book in 60 seconds, pay only after the job is done.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {REPAIR_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={`/book?appliance=${item.id}`}
                  className="group overflow-hidden rounded-[22px] bg-white/[0.06] ring-1 ring-inset ring-white/15 transition hover:-translate-y-1 hover:bg-white/10 hover:ring-amber-400/40"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3.5 sm:p-4">
                    <p className="text-[13.5px] font-extrabold sm:text-sm">{item.label}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 transition group-hover:text-amber-300">
                      Book Now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Clock3, t: "Same-Day Visits", d: "book before 5 PM, expert today" },
                { icon: ShieldCheck, t: "180-Day Warranty", d: "written warranty on every fix" },
                { icon: BadgeCheck, t: "Genuine Parts", d: "OEM spares with manufacturer warranty" },
              ].map((b) => (
                <div
                  key={b.t}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 ring-1 ring-inset ring-white/10"
                >
                  <b.icon className="h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-[13px] font-extrabold">{b.t}</p>
                    <p className="text-[11px] text-slate-400">{b.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/book" className="btn-primary mt-7 w-full !py-4 text-base">
              Book Repair Now <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-7 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Diagnosis charge is adjusted in the final bill · Exact quote approved by you before
              work starts.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
