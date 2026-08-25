import { ClipboardList, UserCheck, PackageCheck, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Book in 60 seconds",
    desc: "Pick your appliance, describe the issue and choose a time slot. That's it.",
  },
  {
    icon: UserCheck,
    title: "Expert arrives today",
    desc: "A verified technician reaches your doorstep fully equipped.",
  },
  {
    icon: PackageCheck,
    title: "Relax with warranty",
    desc: "Approve the quote, get it fixed, pay after service — warranty included.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-12 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="How It Works"
          title="Fixed in 3 simple steps"
          sub="No calls needed, no waiting on hold. The entire booking takes under two minutes."
        />
        <div className="relative grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-brand-200 lg:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-center text-center">
                <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-card ring-1 ring-slate-100 sm:h-20 sm:w-20 sm:rounded-3xl">
                  <s.icon className="h-6 w-6 text-brand-600 sm:h-9 sm:w-9" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white sm:-right-2 sm:-top-2 sm:h-7 sm:w-7 sm:text-sm">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-3.5 text-[13px] font-extrabold tracking-tight text-slate-900 sm:mt-5 sm:text-lg">
                  {s.title}
                </h3>
                <p className="mx-auto mt-1.5 hidden max-w-xs text-sm leading-relaxed text-slate-500 sm:block">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-8 text-center sm:mt-11">
          <Link href="/book" className="btn-primary !px-9 !py-3.5 !text-sm sm:!py-4 sm:!text-base">
            Book Service Now <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
