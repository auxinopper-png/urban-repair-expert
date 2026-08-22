import { Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { TESTIMONIALS } from "@/lib/content";
import { SITE } from "@/lib/config";

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="Customer Love"
          title={`${SITE.ratingValue}★ rated by ${(+SITE.reviewCount).toLocaleString("en-IN")}+ happy customers`}
          sub="Real reviews from real homes across the city."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.07}>
              <figure className="relative h-full rounded-[24px] bg-white p-6 shadow-card ring-1 ring-slate-100">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-3 text-[14px] leading-relaxed text-slate-600">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-50 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-extrabold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">
                      {t.service} · {t.area}
                    </p>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
