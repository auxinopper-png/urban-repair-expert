import type { Metadata } from "next";
import TrackForm from "@/components/track/TrackForm";

export const metadata: Metadata = {
  title: "Track Your Booking",
  description:
    "Track your repair booking or sell pickup request live — technician assigned, on the way, completed status and more.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50/70 to-white py-12 lg:py-20">
      <div className="wrap">
        <div className="mb-8 text-center">
          <h1 className="text-balance text-[28px] font-extrabold tracking-tight sm:text-4xl">
            Where's my <span className="text-brand-600">technician?</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-slate-500">
            Enter your Booking ID or Pickup ID for live status — no other details needed.
          </p>
        </div>
        <TrackForm />
      </div>
    </section>
  );
}
