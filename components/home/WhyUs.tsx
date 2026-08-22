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

export default function WhyUs() {
  return (
    <section className="wrap py-12 lg:py-16">
      <SectionHeading
        eyebrow="Why Urban Repair Expert"
        title="The service experience appliances deserve"
        sub="Thousands of households trust us — here's what makes every booking premium."
      />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
        {WHY_US.map((f, i) => {
          const Icon = ICONS[f.icon];
          return (
            <Reveal key={f.title} delay={i * 0.04}>
              <div className="group h-full rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3.5 ring-1 ring-slate-100 transition hover:ring-brand-300 sm:p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card transition group-hover:bg-brand-600 group-hover:text-white sm:h-11 sm:w-11">
                  <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-2.5 text-[13px] font-extrabold leading-tight tracking-tight text-slate-900 sm:mt-3.5 sm:text-base">
                  {f.title}
                </h3>
                <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-slate-500 sm:mt-1.5 sm:text-sm sm:leading-relaxed">
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
