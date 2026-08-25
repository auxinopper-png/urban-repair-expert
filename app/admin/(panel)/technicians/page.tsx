import { getServerSupabase } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import TechniciansClient from "@/components/admin/TechniciansClient";

export const dynamic = "force-dynamic";

export default async function AdminTechniciansPage() {
  interface Row {
    id: string;
    name: string | null;
    mobile: string | null;
    active: boolean;
    openJobs: number;
  }

  const sb = await getServerSupabase();
  let rows: Row[] = [];

  if (!sb) {
    const store = getDemoStore();
    const load = new Map<string, number>();
    for (const b of store.bookings)
      if (b.technician_id && !["completed", "cancelled"].includes(b.status))
        load.set(b.technician_id, (load.get(b.technician_id) || 0) + 1);
    for (const s of store.sells)
      if (s.technician_id && !["purchased", "cancelled", "picked"].includes(s.status))
        load.set(s.technician_id, (load.get(s.technician_id) || 0) + 1);
    rows = store.techs.map((t) => ({
      id: t.id,
      name: t.name,
      mobile: t.mobile,
      active: t.active,
      openJobs: load.get(t.id) || 0,
    }));
  } else {
    const { data } = await sb
      .from("profiles")
      .select("id,name,mobile,active,created_at")
      .eq("role", "technician")
      .order("name");

    const [assignedB, assignedS] = await Promise.all([
      sb.from("bookings").select("id,technician_id,status"),
      sb.from("sell_requests").select("id,technician_id,status"),
    ]);

    const load = new Map<string, number>();
    for (const b of (assignedB.data || []) as { technician_id: string | null; status: string }[]) {
      if (b.technician_id && !["completed", "cancelled"].includes(b.status))
        load.set(b.technician_id, (load.get(b.technician_id) || 0) + 1);
    }
    for (const s of (assignedS.data || []) as { technician_id: string | null; status: string }[]) {
      if (s.technician_id && !["purchased", "cancelled", "picked"].includes(s.status))
        load.set(s.technician_id, (load.get(s.technician_id) || 0) + 1);
    }

    rows = (data || []).map((t) => ({
      id: t.id,
      name: t.name,
      mobile: t.mobile,
      active: t.active,
      openJobs: load.get(t.id) || 0,
    }));
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Technicians</h1>
        <p className="mt-1 text-sm text-slate-500">
          Field team accounts — they sign in on the technician portal to manage jobs.
          {!sb ? " (Account creation is disabled in demo mode)" : ""}
        </p>
      </header>
      <TechniciansClient techs={rows} />
    </div>
  );
}
