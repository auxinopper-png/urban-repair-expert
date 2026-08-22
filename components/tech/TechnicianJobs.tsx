"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  FileUp,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Phone,
  Wrench,
} from "lucide-react";
import { markJobCompleted, saveJobPhotos, updateJobStatus } from "@/app/actions/tech";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type Booking,
  type SellRequest,
} from "@/lib/services-data";
import { cn, mapsLink, prettyDate, prettyDateTime, waLink } from "@/lib/utils";
import { uploadToBucket } from "@/lib/upload";

type Job =
  | ({ kind: "booking" } & Booking)
  | ({ kind: "sell" } & SellRequest);

const BOOKING_FLOW = ["assigned", "on_the_way", "in_progress", "completed"];
const SELL_FLOW = ["scheduled", "picked", "purchased"];

export default function TechnicianJobs({
  bookings,
  sells,
}: {
  bookings: Booking[];
  sells: SellRequest[];
}) {
  const jobs: Job[] = [
    ...bookings.map((b) => ({ kind: "booking" as const, ...b })),
    ...sells.map((s) => ({ kind: "sell" as const, ...s })),
  ];

  const active = jobs.filter(
    (j) => !["completed", "cancelled", "purchased"].includes(j.status)
  );
  const done = jobs.filter((j) =>
    ["completed", "purchased"].includes(j.status)
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">My Jobs</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {active.length} open · {done.length} completed
          </p>
        </div>
      </header>

      {active.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-card">
          <Wrench className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            No open jobs right now. New assignments appear here automatically.
          </p>
        </div>
      ) : (
        active.map((j) => <JobCard key={j.id} job={j} />)
      )}

      {done.length > 0 ? (
        <>
          <h2 className="pt-4 text-sm font-extrabold uppercase tracking-widest text-slate-400">
            Completed
          </h2>
          {done.map((j) => (
            <JobCard key={j.id} job={j} collapsed />
          ))}
        </>
      ) : null}
    </div>
  );
}

function JobCard({ job, collapsed }: { job: Job; collapsed?: boolean }) {
  const [open, setOpen] = useState(!collapsed);
  const [pending, startTransition] = useTransition();
  const isBooking = job.kind === "booking";

  const name = isBooking ? job.customer_name : job.customer_name;
  const mobile = job.mobile;
  const address = job.address;
  const code = isBooking ? job.booking_code : job.request_code;
  const flow = isBooking ? BOOKING_FLOW : SELL_FLOW;
  const idx = flow.indexOf(job.status);
  const nextStatus = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  const finished = ["completed", "purchased"].includes(job.status);

  function act(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
    });
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            isBooking ? "bg-brand-50 text-brand-600" : "bg-amber-50 text-amber-600"
          )}
        >
          {isBooking ? <Wrench className="h-6 w-6" /> : <PackageCheck className="h-6 w-6" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold">{name}</span>
          <span className="block truncate text-xs text-slate-400">
            {code} ·{" "}
            {isBooking
              ? `${cap(job.appliance)} · ${job.brand}`
              : `${job.appliance === "ac" ? "AC" : "Fridge"} · ${job.brand_name}`}
          </span>
        </span>
        <span
          className={cn("rounded-full px-3 py-1 text-xs font-bold", STATUS_COLORS[job.status])}
        >
          {STATUS_LABELS[job.status]}
        </span>
      </button>

      {open ? (
        <div className="border-t border-slate-100 p-5 pt-4">
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${mobile}`} className="btn-outline flex-1 !py-2.5 !text-sm">
              <Phone className="h-4 w-4 text-emerald-600" /> Call
            </a>
            <a
              href={waLink(`Hello ${name}, I'm your Urban Repair Expert technician for ${code}.`)}
              target="_blank"
              rel="noopener"
              className="btn-wa flex-1 !py-2.5"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={mapsLink(job.lat, job.lng, address)}
              target="_blank"
              rel="noopener"
              className="btn-outline flex-1 !py-2.5 !text-sm"
            >
              <Navigation className="h-4 w-4 text-brand-600" /> Navigate
            </a>
          </div>

          <dl className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm ring-1 ring-slate-100">
            {isBooking ? (
              <>
                <Row label="Appliance" value={`${cap(job.appliance)} · ${job.brand}${job.model ? ` ${job.model}` : ""}`} />
                <Row label="Problem" value={(job.problems || []).join(", ")} />
                <Row label="Visit" value={`${prettyDate(job.preferred_date)} · ${job.preferred_slot}`} />
              </>
            ) : (
              <>
                <Row label="Unit" value={`${job.brand_name} ${job.model_name} · ${job.capacity_label}`} />
                <Row
                  label="Condition"
                  value={`${job.condition_label} · est. ₹${Number(job.estimated_offer || 0).toLocaleString("en-IN")}`}
                />
                <Row label="Pickup" value={job.pickup_at ? prettyDateTime(job.pickup_at) : "To be scheduled"} />
              </>
            )}
            <Row label="Address" value={address} icon={<MapPin className="h-3.5 w-3.5" />} />
          </dl>

          {!finished ? (
            <>
              <PhotoUpload jobId={job.id} kind={job.kind} />
              <div className="mt-4 flex flex-wrap gap-2">
                {nextStatus ? (
                  <button
                    disabled={pending}
                    onClick={() => act(() => updateJobStatus(job.kind, job.id, nextStatus))}
                    className="btn-primary flex-1 !py-3 !text-sm"
                  >
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Mark "{STATUS_LABELS[nextStatus]}" <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : null}
                <button
                  disabled={pending}
                  onClick={() =>
                    act(() =>
                      markJobCompleted(job.kind, job.id, isBooking ? undefined : Number(job.estimated_offer || 0))
                    )
                  }
                  className="btn-accent flex-1 !py-3 !text-sm"
                >
                  {isBooking ? "Complete Job" : "Mark Purchased"}
                </button>
              </div>
            </>
          ) : (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
              ✓ Job finished — great work!
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function PhotoUpload({ jobId, kind }: { jobId: string; kind: "booking" | "sell" }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  async function upload(type: string, file: File | undefined | null) {
    if (!file) return;
    setBusy(type);
    try {
      const url = await uploadToBucket(file, "jobs");
      if (url) {
        setUrls((u) => ({ ...u, [type]: url }));
        const saved = { [type]: url };
        startTransition(async () => {
          await saveJobPhotos(kind, jobId, saved);
        });
      }
    } catch {}
    setBusy(null);
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-2.5">
      {[
        { key: "before", label: "Before Photo" },
        { key: "after", label: "After Photo" },
        { key: "invoice", label: "Invoice Scan" },
      ].map(({ key, label }) => {
        const url = urls[key];
        return (
          <label
            key={key}
            className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-brand-400 hover:text-brand-600"
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => upload(key, e.target.files?.[0])}
            />
            {busy === key ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : url ? (
              <Image src={url} alt={label} fill unoptimized sizes="120px" className="object-cover" />
            ) : key === "invoice" ? (
              <FileUp className="h-6 w-6" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
            {!url && busy !== key ? (
              <span className="px-1 text-center text-[9px] font-extrabold uppercase leading-tight tracking-wide">
                {label}
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value?: string | null; icon?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <dt className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        {icon} {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function cap(s: string) {
  return s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
