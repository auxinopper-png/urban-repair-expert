import { Star, ExternalLink, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/config";

export default function GoogleReviews() {
  return (
    <section className="wrap py-16 lg:py-24">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
            Google Reviews
          </span>
          <h2 className="text-balance text-[26px] font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Loved across the city,{" "}
            <span className="text-brand-600">rated on Google</span>
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-500">
            We earn our rating one doorstep visit at a time. See what customers say about our
            repairs and buyback service — then experience it yourself.
          </p>
          <a
            href={SITE.googleReviewsUrl}
            target="_blank"
            rel="noopener"
            className="btn-outline mt-6 !px-7"
          >
            Read All Reviews <ExternalLink className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center">
                <svg viewBox="0 0 24 24" className="mx-auto h-9 w-9" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.56-5.16 3.56-8.81z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a11.99 11.99 0 0 0 0 10.74l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z" />
                </svg>
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
                  {SITE.ratingValue}
                </p>
                <div className="mt-1 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {(+SITE.reviewCount).toLocaleString("en-IN")}+ reviews
                </p>
              </div>
              <div className="flex-1 space-y-2.5">
                {[
                  ["Punctuality", 98],
                  ["Quality of work", 97],
                  ["Pricing transparency", 95],
                ].map(([label, pct]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>{label}</span>
                      <span className="text-emerald-600">{pct}% positive</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Verified customer feedback collected after completed service visits.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
