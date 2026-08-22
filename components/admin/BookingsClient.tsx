"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  UserCheck,
} from "lucide-react";
import { assignBookingTechnician, updateBookingStatus } from "@/app/actions/admin";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type Booking,
} from "@/lib/services-data";
import { cn, mapsLink, prettyDate, waLink } from "@/lib/utils";

interface Tech {
  id: string;
  name: string | null;
  mobile: string | null;
}

export default function BookingsClient({
  bookings,
  technicians,
}: {
  bookings: Booking[];
  technicians: Tech[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return [b.booking_code, b.customer_name, b.mobile, b.brand, b.appliance]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [bookings, query, statusFilter]);

  function act(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      setSelected(null);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            className="field !pl-11"
            placeholder="Search name, mobile, code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {["all", ...BOOKING_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition",
                statusFilter === s
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800"
              )}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-card ring-1 ring-slate-100">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.9fr_auto] gap-4 border-b border-slate-100 px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 lg:grid">
          <span>Customer</span>
          <span>Appliance</span>
          <span>When</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <p className="py-14 text-center text-sm text-slate-400">No bookings match.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className="grid w-full grid-cols-1 items-center gap-2 px-5 py-4 text-left transition hover:bg-slate-50 lg:grid-cols-[1.2fr_1fr_1fr_0.9fr_auto] lg:gap-4 lg:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{b.customer_name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {b.booking_code} · {b.mobile}
                  </p>
                </div>
                <p className="text-sm font-semibold capitalize text-slate-600">
                  {b.appliance.replace("_", " ")} · {b.brand}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {prettyDate(b.preferred_date)} · {b.preferred_slot}
                </p>
                <span
                  className={cn(
                    "w-fit rounded-full px-3 py-1 text-xs font-bold",
                    STATUS_COLORS[b.status] ?? "bg-slate-100 text-slate-600"
                  )}
                >
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
                <span className="hidden text-xs font-bold text-brand-600 lg:block">Manage →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected ? (
        <BookingDrawer
          booking={selected}
          technicians={technicians}
          busy={pending}
          onClose={() => setSelected(null)}
          onStatus={(s) =>
            act(() => updateBookingStatus(selected.id, s))
          }
          onAssign={(techId) => act(() => assignBookingTechnician(selected.id, techId))}
        />
      ) : null}

      {pending && selected ? (
        <div className="fixed inset-x-0 top-0 z-[110] flex justify-center py-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
          </span>
        </div>
      ) : null}
    </>
  );
}

function BookingDrawer({
  booking: b,
  technicians,
  busy,
  onClose,
  onStatus,
  onAssign,
}: {
  booking: Booking;
  technicians: Tech[];
  busy: boolean;
  onClose: () => void;
  onStatus: (s: string) => void;
  onAssign: (t: string) => void;
}) {
  const fullAddress = `${b.address}${b.lat != null ? ` (${b.lat}, ${b.lng})` : ""}`;
  const waText = `Hello ${b.customer_name}, this is Urban Repair Expert regarding your ${b.appliance.replace("_", " ")} repair booking ${b.booking_code}.`;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-slate-950/50 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              {b.booking_code}
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">{b.customer_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${b.mobile}`} className="btn-outline flex-1 !py-2.5 !text-sm">
            <Phone className="h-4 w-4 text-emerald-600" /> Call
          </a>
          <a
            href={waLink(waText)}
            target="_blank"
            rel="noopener"
            className="btn-wa flex-1 !py-2.5"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={mapsLink(b.lat, b.lng, b.address)}
            target="_blank"
            rel="noopener"
            className="btn-outline flex-1 !py-2.5 !text-sm"
          >
            <MapPin className="h-4 w-4 text-rose-500" /> Maps
          </a>
        </div>

        <dl className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
          <Row label="Mobile" value={b.mobile} />
          <Row label="Appliance" value={`${cap(b.appliance)} · ${b.brand}${b.model ? ` ${b.model}` : ""}`} />
          <Row label="Problems" value={(b.problems || []).join(", ") || "—"} />
          {b.problem_note ? <Row label="Notes" value={b.problem_note} /> : null}
          <Row label="Preferred" value={`${prettyDate(b.preferred_date)} · ${b.preferred_slot}`} />
          <Row label="Address" value={fullAddress} icon={<MapPin className="h-3.5 w-3.5" />} />
          <Row label="Created" value={prettyDate(b.created_at)} />
        </dl>

        {b.photo_url ? (
          <div className="relative mt-4 h-44 overflow-hidden rounded-2xl border border-slate-100">
            <Image src={b.photo_url} alt="Customer upload" fill unoptimized className="object-cover" />
          </div>
        ) : null}

        <div className="mt-6">
          <label className="label-text">Assign Technician</label>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 shrink-0 text-slate-400" />
            <select
              className="field"
              value={b.technician_id || ""}
              disabled={busy}
              onChange={(e) => onAssign(e.target.value)}
            >
              <option value="">— Unassigned —</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.mobile ? ` (${t.mobile})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="label-text">Update Status</label>
          <div className="flex flex-wrap gap-2">
            {BOOKING_STATUSES.map((s) => (
              <button
                key={s}
                disabled={busy || s === b.status}
                onClick={() => onStatus(s)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-bold transition",
                  s === b.status
                    ? "cursor-default bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white"
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="label-text">Invoice</label>
          <a
            href={`/admin/invoice/${b.booking_code}`}
            target="_blank"
            className="btn-outline w-full !py-3 !text-sm"
          >
            <FileText className="h-4 w-4 text-brand-600" /> Generate / Print Invoice
          </a>
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          Status changes reflect instantly on the customer's tracking page.
        </p>
        <ExternalLink className="hidden" />
      </div>
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
      <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function cap(s: string) {
  return s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
