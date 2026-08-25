import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/booking/BookingForm";
import { BadgeCheck, ShieldCheck, Clock3, IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Repair Service — AC, Fridge, Washing Machine & Geyser",
  description:
    "Book same-day doorstep appliance repair in under 60 seconds. Verified technicians, genuine spare parts, 180-day warranty. Pay after service.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50/70 to-white py-10 lg:py-16">
      <div className="wrap">
        <div className="mb-8 text-center">
          <h1 className="text-balance text-[28px] font-extrabold tracking-tight sm:text-4xl">
            Book your repair in <span className="text-brand-600">under 60 seconds</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-slate-500">
            No calls needed. Fill this quick form and relax — we handle the rest.
          </p>
        </div>

        <Suspense fallback={<div className="card mx-auto h-96 max-w-3xl animate-pulse" />}>
          <BookingForm />
        </Suspense>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Clock3, t: "Same-Day", d: "Service visits" },
            { icon: BadgeCheck, t: "Verified", d: "Expert technicians" },
            { icon: ShieldCheck, t: "180-Day", d: "Service warranty" },
            { icon: IndianRupee, t: "Transparent Price", d: "No hidden charges" },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm"
            >
              <b.icon className="mx-auto h-5 w-5 text-brand-600" />
              <p className="mt-1.5 text-sm font-extrabold text-slate-900">{b.t}</p>
              <p className="text-[11px] text-slate-400">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
