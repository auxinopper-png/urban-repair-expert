import Link from "next/link";
import {
  Wrench,
  Snowflake,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { getServerSupabase } from "@/lib/supabase/server";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/services-data";
import { getDemoStore } from "@/lib/demo-store";
import { prettyDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sb = await getServerSupabase();

  let totalBookings = 0;
  let totalSells = 0;
  let todayNew = 0;
  let recentBookings: Record<string, unknown>[] = [];
  let recentSells: Record<string, unknown>[] = [];

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = (iso?: string | null) => (iso || "").startsWith(todayStr);

  if (sb) {
    const [bookingsAll, bookingsToday, sellsAll, sellsToday, rb, rs] = await Promise.all([
      sb.from("bookings").select("id,status,created_at,customer_name,booking_code,brand,appliance,preferred_date"),
      sb.from("sell_requests").select("id", { count: "exact", head: true }).gte("created_at", `${todayStr}T00:00:00`),
      sb.from("sell_requests").select("id,status,estimated_offer,created_at"),
      sb.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", `${todayStr}T00:00:00`),
      sb.from("bookings").select("*").order("created_at", { ascending: false }).limit(6),
      sb.from("sell_requests").select("*").order("created_at", { ascending: false }).limit(4),
    ]);

    totalBookings = (bookingsAll.data || []).length;
    totalSells = (sellsAll.data || []).length;
    todayNew = (bookingsToday.count || 0) + (sellsToday.count || 0);
    recentBookings = rb.data || [];
    recentSells = rs.data || [];
  } else {
    const store = getDemoStore();
    totalBookings = store.bookings.length;
    totalSells = store.sells.length;
    todayNew =
      store.bookings.filter((b) => isToday(b.created_at)).length +
      store.sells.filter((s) => isToday(s.created_at)).length;
    recentBookings = [...store.bookings]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 6) as unknown as Record<string, unknown>[];
    recentSells = [...store.sells]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 4) as unknown as Record<string, unknown>[];
  }

  return <DashboardView
    totalBookings={totalBookings}
    totalSells={totalSells}
    todayNew={todayNew}
    recentBookings={recentBookings}
    recentSells={recentSells}
  />;
}

function DashboardView({
  totalBookings,
  totalSells,
  todayNew,
  recentBookings,
  recentSells,
}: {
  totalBookings: number;
  totalSells: number;
  todayNew: number;
  recentBookings: Record<string, unknown>[];
  recentSells: Record<string, unknown>[];
}) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live overview of repairs & buyback operations.
        </p>
      </header>

      <StatsRow
        totalBookings={totalBookings}
        totalSells={totalSells}
        todayNew={todayNew}
        recentBookings={recentBookings}
        recentSells={recentSells}
      />

      <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Recent Repair Bookings</h2>
          <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No bookings yet.</p>
          ) : (
            recentBookings.map((raw) => {
              const b = raw as unknown as {
                id: string;
                customer_name: string;
                booking_code: string;
                brand: string;
                appliance: string;
                preferred_date: string;
                status: string;
              };
              return (
                <div key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                    <Wrench className="h-5 w-5 text-brand-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{b.customer_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {b.booking_code} · {b.brand} {b.appliance === "ac" ? "AC" : b.appliance.replace("_", " ")} · {prettyDate(b.preferred_date)}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", STATUS_COLORS[b.status])}>
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Recent Sell Requests</h2>
          <Link href="/admin/sell" className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentSells.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No sell requests yet.</p>
          ) : (
            recentSells.map((raw) => {
              const s = raw as unknown as {
                id: string;
                customer_name: string;
                request_code: string;
                brand_name: string;
                model_name: string;
                capacity_label: string;
                estimated_offer: number;
                estimated_market: number;
                status: string;
              };
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-amber-50/60 p-4 ring-1 ring-amber-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-amber-200">
                    <Snowflake className="h-5 w-5 text-amber-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{s.customer_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {s.request_code} · {s.brand_name} {s.model_name} ({s.capacity_label})
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700">
                    ₹{Number(s.estimated_offer || 0).toLocaleString("en-IN")}
                  </span>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", STATUS_COLORS[s.status])}>
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function StatsRow(props: {
  totalBookings: number;
  totalSells: number;
  todayNew: number;
  recentBookings: Record<string, unknown>[];
  recentSells: Record<string, unknown>[];
}) {
  const all = [...props.recentBookings, ...props.recentSells];
  const countStatus = (list: Record<string, unknown>[], statuses: string[]) =>
    list.filter((r) => statuses.includes(String(r.status ?? ""))).length;

  const cards = [
    { label: "Total Bookings", value: props.totalBookings, icon: Wrench, tint: "bg-brand-600" },
    { label: "Sell Requests", value: props.totalSells, icon: Snowflake, tint: "bg-amber-500" },
    { label: "Pending Jobs", value: countStatus(all, ["pending", "requested", "assigned", "on_the_way", "in_progress", "scheduled"]), icon: Clock, tint: "bg-indigo-600" },
    { label: "Completed", value: countStatus(all, ["completed", "purchased"]), icon: CheckCircle2, tint: "bg-emerald-600" },
    { label: "Cancelled", value: countStatus(all, ["cancelled"]), icon: XCircle, tint: "bg-rose-500" },
    { label: "Today's New", value: props.todayNew, icon: TrendingUp, tint: "bg-slate-900" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-white", c.tint)}>
            <c.icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-2xl font-extrabold tracking-tight">{c.value}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
