import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Phone } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data/blog";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/config";
import { prettyDate, telLink } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="bg-white py-10 lg:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name },
        }}
      />
      <div className="wrap max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        <div className={`flex h-44 items-center justify-center rounded-[28px] bg-gradient-to-br ${post.gradient}`}>
          <span className="text-7xl">{post.emoji}</span>
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          {prettyDate(post.date)} · {post.readMins} min read · {SITE.shortName} Editorial
        </p>
        <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-500">{post.intro}</p>

        <div className="mt-8 space-y-8">
          {post.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{s.h}</h2>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-slate-600">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-gradient-to-br from-slate-950 to-brand-900 p-7 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-300">Bottom Line</p>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-200">{post.conclusion}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary !py-3 !text-sm">
              Book a Repair <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Get Sell Offer
            </Link>
            <a
              href={telLink()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-extrabold tracking-tight">Keep reading</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/blog/${o.slug}`}
                className="group flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-brand-200"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
                  {o.emoji}
                </span>
                <span>
                  <span className="block text-sm font-extrabold leading-snug group-hover:text-brand-700">
                    {o.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">{prettyDate(o.date)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
