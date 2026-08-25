import { ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/config";

interface GoogleData {
  rating: number;
  count: number;
  live: boolean;
}

async function getGoogleRating(): Promise<GoogleData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID;
  const fallback: GoogleData = {
    rating: Number(SITE.ratingValue),
    count: Number(SITE.reviewCount),
    live: false,
  };
  if (!key || !placeId) return fallback;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount&key=${key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return fallback;
    const json = (await res.json()) as { rating?: number; userRatingCount?: number };
    if (typeof json.rating !== "number") return fallback;
    return {
      rating: json.rating,
      count: json.userRatingCount ?? fallback.count,
      live: true,
    };
  } catch {
    return fallback;
  }
}

export default async function GoogleReviews() {
  const g = await getGoogleRating();

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
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Google Rating
                </p>
                <p className="mt-1 text-6xl font-extrabold tracking-tight text-slate-900">
                  {g.rating.toFixed(1)}
                  <span className="text-2xl font-bold text-slate-300">/5</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {g.count.toLocaleString("en-IN")}+ verified customer reviews
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center ring-1 ring-slate-100">
                <svg viewBox="0 0 24 24" className="mx-auto h-7 w-7" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.56-5.16 3.56-8.81z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a11.99 11.99 0 0 0 0 10.74l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z" />
                </svg>
                {g.live ? (
                  <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                    Live from Google
                  </p>
                ) : (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Google Business Profile
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800">
              Verified customer feedback collected after completed service visits.
              {!g.live ? " Connect Google Places API keys to auto-sync this section." : ""}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
