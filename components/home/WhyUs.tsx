import { Zap, Home, ShieldCheck, BadgeCheck, Tag, UserCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { WHY_US } from "@/lib/content";

const ICONS: Record<string, typeof Zap> = {
  zap: Zap,
  home: Home,
  shield: ShieldCheck,
  badge: BadgeCheck,
  tag: Tag,
  user: UserCheck,
};

const TINTS = [
  "bg-brand-50 text-brand-600",
  "bg-emerald-50 text-emerald-600",
  "bg-sky-50 text-sky-600",
  "bg-amber-50 text-amber-600",
  "bg-violet-50 text-violet-600",
  "bg-rose-50 text-rose-600",
];

export default function WhyUs() {
  return (
    <section className="wrap py-14 lg:py-20">
      <SectionHeading
        eyebrow="Why Urban Repair Expert"
        title="The service experience appliances deserve"
        sub="Thousands of households trust us — here's what makes every booking premium."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {WHY_US.map((f, i) => {
          const Icon = ICONS[f.icon];
          return (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="group h-full rounded-[22px] border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-glow sm:p-6">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 sm:h-12 sm:w-12 ${TINTS[i % TINTS.length]}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-3 text-[13.5px] font-extrabold leading-snug tracking-tight text-slate-900 sm:text-base">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500 sm:text-sm">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
