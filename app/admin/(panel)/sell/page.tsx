import { getServerSupabase } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import SellClient from "@/components/admin/SellClient";
import type { SellRequest } from "@/lib/services-data";

export const dynamic = "force-dynamic";

export default async function AdminSellPage() {
  const sb = await getServerSupabase();

  if (!sb) {
    const store = getDemoStore();
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Sell Requests</h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule pickups, review photos and manage buyback operations.
          </p>
        </header>
        <SellClient requests={store.sells} technicians={store.techs.filter((t) => t.active)} />
      </div>
    );
  }

  const [requests, techs] = await Promise.all([
    sb.from("sell_requests").select("*").order("created_at", { ascending: false }).limit(300),
    sb.from("profiles").select("id,name,mobile,active").eq("role", "technician").eq("active", true).order("name"),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Sell Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Schedule pickups, review photos and manage buyback operations.
        </p>
      </header>
      <SellClient
        requests={(requests.data || []) as unknown as SellRequest[]}
        technicians={(techs.data || []) as { id: string; name: string | null; mobile: string | null }[]}
      />
    </div>
  );
}
