import Link from "next/link";
import { Wrench, Clock3, ShieldCheck, BadgeCheck, ArrowRight, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import { telLink } from "@/lib/utils";

export default function RepairBanner() {
  return (
    <section className="wrap py-16 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-12 text-white shadow-glow sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white ring-1 ring-inset ring-white/30">
                Doorstep Repair Service
              </span>
              <h2 className="mt-5 text-balance text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
                Appliance kharab?{" "}
                <span className="text-amber-300">Aaj hi fix karwao.</span>
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-blue-100">
                AC, refrigerator, washing machine &amp; geyser — verified technicians reach your
                doorstep within hours. Book in 60 seconds, pay only after the job is done.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/book" className="btn-accent !px-8 !py-4 text-base">
                  Book Repair Now <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href={telLink()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Phone className="h-4.5 w-4.5" /> Call Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { icon: Clock3, t: "Same-Day Visit", d: "book before 5 PM, expert today" },
                { icon: ShieldCheck, t: "180-Day Warranty", d: "written warranty on every fix" },
                { icon: BadgeCheck, t: "Genuine Parts", d: "OEM spares with manufacturer warranty" },
                {
                  icon: Wrench,
                  t: "All Brands",
                  d: "AC · Fridge · Washing Machine · Geyser",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="rounded-2xl bg-white/[0.12] p-5 ring-1 ring-inset ring-white/20 backdrop-blur transition hover:bg-white/20"
                >
                  <b.icon className="h-6 w-6 text-amber-300" />
                  <p className="mt-3 text-sm font-extrabold">{b.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-blue-100">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="relative mt-8 flex items-center gap-1.5 text-[11px] text-blue-200">
            Diagnosis charge adjusted in final bill · Exact quote approved by you before work starts.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
