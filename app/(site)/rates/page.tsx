import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { AC_RATE_CARD, AC_EXTRA_PARTS } from "@/lib/data/rate-card";
import { SITE } from "@/lib/config";
import { telLink, waLink, formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AC Service Rate Card — Transparent Prices",
  description:
    "Complete AC rate card: service, deep cleaning, gas refill, installation & uninstallation prices for split and window ACs. Labour included, no hidden charges.",
  alternates: { canonical: "/rates" },
};

export default function RatesPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50/70 to-white py-12 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "PriceSpecification",
          name: `${SITE.name} — AC Rate Card`,
          priceCurrency: "INR",
        }}
      />
      <div className="wrap">
        <SectionHeading
          eyebrow="Rate Card"
          title="AC Service — Complete Price List"
          sub="Transparent, fixed pricing. Labour included wherever mentioned. Final quote is always approved by you before work starts."
        />

        <div className="mx-auto mb-8 max-w-2xl rounded-2xl bg-amber-50 px-5 py-4 text-center text-[13px] font-semibold leading-relaxed text-amber-900 ring-1 ring-amber-200">
          Final price appliance ki condition aur model inspection ke baad confirm hota hai.
          Rates premium market benchmark se ~20% better value par set hain.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {AC_RATE_CARD.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.05}>
              <div className="h-full rounded-[24px] border border-slate-100 bg-white p-5 shadow-card sm:p-6">
                <h2 className="mb-3 text-base font-extrabold tracking-tight text-slate-900">
                  {g.title}
                </h2>
                <ul className="divide-y divide-slate-50">
                  {g.rows.map((r) => (
                    <li key={r.service} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold leading-snug text-slate-700">
                          {r.service}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Split{r.window ? " · Window" : ""}
                          {r.note ? ` — ${r.note}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-extrabold text-slate-900">{formatINR(r.split)}</p>
                        {r.window ? (
                          <p className="text-[11px] font-bold text-slate-400">{formatINR(r.window)}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5 rounded-[24px] bg-slate-950 p-6 text-white sm:p-7">
            <h2 className="mb-1 text-base font-extrabold">Parts & Extra Material</h2>
            <p className="mb-4 text-xs text-slate-400">
              Billed separately at genuine MRP + fitting labour where applicable.
            </p>
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {AC_EXTRA_PARTS.map((p) => (
                <li key={p.item} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2 text-sm">
                  <span className="min-w-0">
                    {p.item}
                    <span className="block text-[10px] text-slate-500">{p.note}</span>
                  </span>
                  <span className="shrink-0 font-extrabold text-amber-400">{formatINR(p.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-2xl space-y-2 text-center text-[12px] leading-relaxed text-slate-500">
          <p>
            Warranty: repaired fault par 180 din · replaced parts par manufacturer warranty.
            Payment sirf job complete hone ke baad — UPI / Card / Cash accepted.
          </p>
          <p>Fridge, Washing Machine aur Geyser rate cards jald hi isi page par add honge.</p>
        </div>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/book?appliance=ac" className="btn-primary !px-8 !py-4">
            Book AC Service Now <ArrowRight className="h-5 w-5" />
          </Link>
          <a href={telLink()} className="btn-outline !px-7 !py-4">
            <Phone className="h-4.5 w-4.5" /> Call for Quote
          </a>
          <a
            href={waLink("Hi! Mujhe AC rate card ke baare me jaanna hai.")}
            target="_blank"
            rel="noopener"
            className="btn-wa !py-4"
          >
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
