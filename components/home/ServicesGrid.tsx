import Link from "next/link";
import { ArrowRight, Snowflake, WashingMachine, Flame, Wind } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { STARTING_PRICES } from "@/lib/config";
import { formatINR } from "@/lib/utils";

const CARDS = [
  {
    id: "ac",
    icon: Wind,
    title: "AC Repair & Service",
    desc: "Not cooling? Loud noise? Gas refill, deep cleaning, installation & PCB repair by AC experts.",
    tint: "bg-sky-50 text-sky-600",
  },
  {
    id: "refrigerator",
    icon: Snowflake,
    title: "Refrigerator Repair",
    desc: "Cooling issues, compressor faults, leakage & thermostat problems fixed at your home.",
    tint: "bg-blue-50 text-blue-600",
  },
  {
    id: "washing_machine",
    icon: WashingMachine,
    title: "Washing Machine Repair",
    desc: "Spin problems, drum noise, drainage & electrical faults for all top-load & front-load models.",
    tint: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "geyser",
    icon: Flame,
    title: "Geyser Repair",
    desc: "No hot water, leakage or tripping — safe, certified repairs with genuine elements.",
    tint: "bg-orange-50 text-orange-600",
  },
];

export default function ServicesGrid() {
  return (
    <section className="wrap py-16 lg:py-24">
      <SectionHeading
        eyebrow="Our Services"
        title="Every appliance. One trusted expert."
        sub="Transparent pricing, verified technicians and warranty-backed repairs across all major brands."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {CARDS.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.07}>
            <Link
              href={`/book?appliance=${c.id}`}
              className="group flex h-full flex-col rounded-[24px] border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow"
            >
              <span className={`inline-flex h-13 w-13 items-center justify-center rounded-2xl ${c.tint}`}>
                <c.icon className="h-6.5 w-6.5" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-500">{c.desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-dashed border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  from{" "}
                  <span className="text-base font-extrabold text-slate-900">
                    {formatINR(STARTING_PRICES[c.id] ?? 349)}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 transition-transform group-hover:translate-x-0.5">
                  Book <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
