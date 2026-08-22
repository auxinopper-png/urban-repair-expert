"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  CalendarClock,
  Loader2,
  MapPin,
  PackageCheck,
  Phone,
  Search,
} from "lucide-react";
import { assignSellTechnician, schedulePickup, updateSellStatus } from "@/app/actions/admin";
import { SELL_STATUSES, STATUS_LABELS, STATUS_COLORS, type SellRequest } from "@/lib/services-data";
import { cn, mapsLink, prettyDate, prettyDateTime, waLink } from "@/lib/utils";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Tech {
  id: string;
  name: string | null;
  mobile: string | null;
}

export default function SellClient({
  requests,
  technicians,
}: {
  requests: SellRequest[];
  technicians: Tech[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<SellRequest | null>(null);
  const [pickupAt, setPickupAt] = useState("");
  const [techId, setTechId] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.request_code, r.customer_name, r.mobile, r.brand_name, r.model_name]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [requests, query, statusFilter]);

  function openDrawer(r: SellRequest) {
    setSelected(r);
    setPickupAt(r.pickup_at ? new Date(r.pickup_at).toISOString().slice(0, 16) : "");
    setTechId(r.technician_id || "");
  }

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
          {["all", ...SELL_STATUSES].map((s) => (
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
        {filtered.length === 0 ? (
          <p className="py-14 text-center text-sm text-slate-400">No sell requests match.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => openDrawer(r)}
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
              >
                <div className="min-w-[180px] flex-1">
                  <p className="truncate text-sm font-bold">{r.customer_name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {r.request_code} · {r.mobile}
                  </p>
                </div>
                <div className="min-w-[160px] text-xs font-semibold capitalize text-slate-600">
                  {r.appliance === "ac" ? "AC" : "Refrigerator"} · {r.brand_name}
                  <span className="block font-normal text-slate-400">
                    {r.model_name} · {r.capacity_label} · {r.age_label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-700">
                    ₹{Number(r.estimated_offer || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    mkt ₹{Number(r.estimated_market || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {r.pickup_at ? `🚚 ${prettyDateTime(r.pickup_at)}` : prettyDate(r.created_at)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    STATUS_COLORS[r.status] ?? "bg-slate-100 text-slate-600"
                  )}
                >
                  {STATUS_LABELS[r.status] ?? r.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[90] flex justify-end bg-slate-950/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                  {selected.request_code}
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {selected.customer_name}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-100">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                    Our Offer
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight text-emerald-700">
                    ₹{Number(selected.estimated_offer || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="pb-1 text-right text-xs text-slate-500">
                  <p className="line-through">mkt ₹{Number(selected.estimated_market || 0).toLocaleString("en-IN")}</p>
                  <p className="font-bold text-emerald-600">
                    +{Math.round(((selected.estimated_offer - selected.estimated_market) / Math.max(1, selected.estimated_market)) * 100)}%
                    higher
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${selected.mobile}`} className="btn-outline flex-1 !py-2.5 !text-sm">
                <Phone className="h-4 w-4 text-emerald-600" /> Call
              </a>
              <a
                href={waLink(`Hello ${selected.customer_name}, regarding your ${selected.appliance === "ac" ? "AC" : "refrigerator"} pickup ${selected.request_code}.`)}
                target="_blank"
                rel="noopener"
                className="btn-wa flex-1 !py-2.5"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
              <a
                href={mapsLink(selected.lat, selected.lng, selected.address)}
                target="_blank"
                rel="noopener"
                className="btn-outline flex-1 !py-2.5 !text-sm"
              >
                <MapPin className="h-4 w-4 text-rose-500" /> Maps
              </a>
            </div>

            <dl className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <Row label="Mobile" value={selected.mobile} />
              <Row label="Appliance" value={`${selected.appliance === "ac" ? "AC" : "Refrigerator"} · ${selected.brand_name} ${selected.model_name}`} />
              <Row label="Capacity / Age / Condition" value={`${selected.capacity_label} · ${selected.age_label} · ${selected.condition_label}`} />
              <Row label="Address" value={selected.address} icon={<MapPin className="h-3.5 w-3.5" />} />
              {selected.admin_note ? <Row label="Note" value={selected.admin_note} /> : null}
              <Row label="Requested" value={prettyDateTime(selected.created_at)} />
            </dl>

            {(selected.photos || []).length > 0 ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(selected.photos || []).map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noopener" className="group relative aspect-square overflow-hidden rounded-xl border border-slate-100">
                    <Image src={p.url} alt={p.type} fill unoptimized className="object-cover transition group-hover:scale-105" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/55 py-0.5 text-center text-[9px] font-bold text-white">
                      {p.type}
                    </span>
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-6 space-y-3 rounded-2xl bg-brand-50/60 p-5 ring-1 ring-brand-100">
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-brand-900">
                <CalendarClock className="h-4 w-4" /> Schedule Pickup
              </p>
              <input
                type="datetime-local"
                className="field"
                value={pickupAt}
                disabled={pending}
                onChange={(e) => setPickupAt(e.target.value)}
              />
              <select className="field" value={techId} disabled={pending} onChange={(e) => setTechId(e.target.value)}>
                <option value="">Assign pickup partner…</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                disabled={pending}
                onClick={() =>
                  act(() =>
                    schedulePickup(selected.id, pickupAt ? new Date(pickupAt).toISOString() : "", techId)
                  )
                }
                className="btn-primary w-full !py-3 !text-sm"
              >
                Save Schedule
              </button>
            </div>

            <div className="mt-5">
              <label className="label-text">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {SELL_STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={pending || s === selected.status}
                    onClick={() => act(() => updateSellStatus(selected.id, s))}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition",
                      s === selected.status
                        ? "cursor-default bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white"
                    )}
                  >
                    {s === "purchased" ? <PackageCheck className="h-3.5 w-3.5" /> : null}
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {pending ? (
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
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
