import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { BLOG_POSTS } from "@/lib/data/blog";
import { prettyDate } from "@/lib/utils";

export default function BlogPreview() {
  const posts = BLOG_POSTS.slice(0, 3);
  return (
    <section className="wrap py-16 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow="From The Blog"
          title="Care tips & money-saving guides"
        />
        <Link
          href="/blog"
          className="mb-10 hidden items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 lg:mb-14 lg:inline-flex"
        >
          View all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.07}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${p.gradient}`}>
                <span className="text-5xl">{p.emoji}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {prettyDate(p.date)} · {p.readMins} min read
                </p>
                <h3 className="mt-2 text-[17px] font-extrabold leading-snug tracking-tight text-slate-900 group-hover:text-brand-700">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {p.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
