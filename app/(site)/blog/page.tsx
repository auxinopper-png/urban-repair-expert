import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data/blog";
import Reveal from "@/components/Reveal";
import { prettyDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Appliance Care Tips & Guides",
  description:
    "Expert tips on AC care, refrigerator maintenance, washing machine troubleshooting and getting the best price when selling old appliances.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50/70 to-white py-12 lg:py-16">
      <div className="wrap">
        <div className="mb-10 text-center">
          <h1 className="text-balance text-[30px] font-extrabold tracking-tight sm:text-4xl">
            The Urban Repair <span className="text-brand-600">Journal</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-slate-500">
            Practical guides to keep your appliances efficient and your wallet happy.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {BLOG_POSTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${p.gradient}`}>
                  <span className="text-6xl transition-transform group-hover:scale-110">{p.emoji}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {prettyDate(p.date)} · {p.readMins} min read
                  </p>
                  <h2 className="mt-2 text-lg font-extrabold leading-snug tracking-tight group-hover:text-brand-700">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
                    Read article{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
