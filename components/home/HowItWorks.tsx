import { ClipboardList, UserCheck, PackageCheck, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Book in 60 seconds",
    desc: "Pick appliance & time slot — done.",
  },
  {
    icon: UserCheck,
    title: "Expert arrives today",
    desc: "Verified technician at your doorstep.",
  },
  {
    icon: PackageCheck,
    title: "Relax with warranty",
    desc: "Approve quote, get fixed, pay after service.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-10 lg:py-14">
      <div className="wrap">
        <SectionHeading
          eyebrow="How It Works"
          title="Fixed in 3 simple steps"
          sub="No calls needed. The entire booking takes under two minutes."
        />
        <div className="relative grid grid-cols-3 gap-3 lg:gap-6">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-brand-200 lg:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="relative">
              <div className="flex flex-col items-center text-center">
                <span className="relative z-10 inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-slate-100 sm:h-18 sm:w-18">
                  <s.icon className="h-6 w-6 text-brand-600 sm:h-8 sm:w-8" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-extrabold text-white sm:h-7 sm:w-7 sm:text-sm">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-3 text-[13px] font-extrabold tracking-tight text-slate-900 sm:mt-4 sm:text-lg">
                  {s.title}
                </h3>
                <p className="mt-1 max-w-[220px] text-[11px] leading-snug text-slate-500 sm:mt-2 sm:max-w-xs sm:text-sm sm:leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-8 text-center sm:mt-10">
          <Link href="/book" className="btn-primary !px-8 !py-3.5 !text-sm sm:!text-base">
            Book Service Now <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
