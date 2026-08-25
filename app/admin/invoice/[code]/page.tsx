import { notFound, redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { getDemoStore } from "@/lib/demo-store";
import PrintButton from "@/components/admin/PrintButton";
import { SITE } from "@/lib/config";
import { prettyDate, formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PART_RATES: Record<string, { label: string; from: number }> = {
  ac: { label: "AC Repair", from: 499 },
  refrigerator: { label: "Refrigerator Repair", from: 349 },
  washing_machine: { label: "Washing Machine Repair", from: 399 },
  geyser: { label: "Geyser Repair", from: 349 },
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const profile = await getSessionProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "technician"))
    redirect("/admin/login");

  const { code } = await params;
  const sb = await getServerSupabase();

  let booking: Record<string, unknown> | null = null;
  let techName = "—";

  if (sb) {
    const { data } = await sb.from("bookings").select("*").eq("booking_code", code).single();
    booking = data as unknown as Record<string, unknown>;
    if (booking?.technician_id) {
      const { data: t } = await sb
        .from("profiles")
        .select("name")
        .eq("id", String(booking.technician_id))
        .single();
      techName = t?.name || "—";
    }
  } else {
    const store = getDemoStore();
    booking = (store.bookings.find((b) => b.booking_code === code) as unknown as Record<string, unknown>) || null;
    if (booking?.technician_id)
      techName = store.techs.find((t) => t.id === booking!.technician_id)?.name || "—";
  }

  if (!booking) notFound();

  const appliance = String(booking.appliance ?? "ac");
  const svc = PART_RATES[appliance] || PART_RATES.ac;
  const noteText = String(booking.admin_note ?? "");
  const parts = Math.max(0, parseInt(noteText.replace(/\D/g, "")) || 0);
  const serviceCharge = svc.from;
  const subtotal = serviceCharge + parts;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white">
      <div className="mx-auto max-w-2xl">
        <div className="no-print mb-4 flex justify-between">
          <a href="/admin/bookings" className="text-sm font-bold text-brand-600 hover:text-brand-700">
            ← Back to bookings
          </a>
          <PrintButton />
        </div>

        <div className="rounded-[24px] bg-white p-8 shadow-lg print:shadow-none sm:p-10">
          <header className="flex items-start justify-between border-b border-dashed border-slate-200 pb-6">
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900">{SITE.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {SITE.address.line1}, {SITE.address.area}<br />
                {SITE.address.city}, {SITE.address.state} {SITE.address.pin}<br />
                {SITE.phoneDisplay} · {SITE.email}
              </p>
            </div>
            <div className="text-right">
              <p className="inline-block rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white">
                Invoice
              </p>
              <p className="mt-2 text-xs font-bold text-slate-700">{String(booking.booking_code)}</p>
              <p className="text-xs text-slate-400">{prettyDate(String(booking.created_at))}</p>
            </div>
          </header>

          <section className="grid gap-5 py-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Billed To</p>
              <p className="mt-1 text-sm font-bold">{String(booking.customer_name)}</p>
              <p className="text-xs text-slate-500">{String(booking.mobile)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{String(booking.address)}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Service</p>
              <p className="mt-1 text-sm font-bold capitalize">
                {svc.label} · {String(booking.brand)}{booking.model ? ` ${String(booking.model)}` : ""}
              </p>
              <p className="text-xs text-slate-500">
                Visit: {prettyDate(String(booking.preferred_date))} · {String(booking.preferred_slot)}
              </p>
              <p className="text-xs text-slate-500">Technician: {techName}</p>
            </div>
          </section>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold">{svc.label} — service & labour</td>
                <td className="py-3 text-right font-semibold">{formatINR(serviceCharge)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">
                  Spare parts / consumables
                  <span className="block text-xs font-normal text-slate-400">
                    Genuine OEM parts · old parts returned
                  </span>
                </td>
                <td className="py-3 text-right font-semibold">{formatINR(parts)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">GST @ 18%</td>
                <td className="py-3 text-right font-semibold">{formatINR(gst)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-3.5 text-base font-extrabold">Total Payable</td>
                <td className="py-3.5 text-right text-base font-extrabold">{formatINR(total)}</td>
              </tr>
            </tfoot>
          </table>

          <section className="mt-6 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-xs font-bold text-emerald-800">
              Warranty: 180 days on repaired fault · Genuine parts carry manufacturer warranty.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
              Payments accepted: UPI / Cards / Cash. This is a computer-generated invoice.
            </p>
          </section>

          <footer className="mt-8 flex items-end justify-between border-t border-dashed border-slate-200 pt-5">
            <p className="max-w-[60%] text-[10px] leading-relaxed text-slate-400">
              Thank you for choosing {SITE.name}. For support, call {SITE.phoneDisplay} or WhatsApp
              us anytime between {SITE.hours.toLowerCase()}.
            </p>
            <div className="text-center">
              <div className="h-10 w-40 border-b border-slate-300" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Authorized Signatory
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
