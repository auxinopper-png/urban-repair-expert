import { getSessionProfile } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import TechnicianJobs from "@/components/tech/TechnicianJobs";
import type { Booking, SellRequest } from "@/lib/services-data";

export const dynamic = "force-dynamic";

export default async function TechnicianHomePage() {
  const profile = await getSessionProfile();
  if (!profile) return null;

  const sb = await getServerSupabase();

  if (!sb) {
    const store = getDemoStore();
    return (
      <TechnicianJobs
        bookings={store.bookings.filter((b) => b.technician_id === profile.id)}
        sells={store.sells.filter((s) => s.technician_id === profile.id)}
      />
    );
  }

  const [bookings, sells] = await Promise.all([
    sb
      .from("bookings")
      .select("*")
      .eq("technician_id", profile.id)
      .order("preferred_date", { ascending: true }),
    sb
      .from("sell_requests")
      .select("*")
      .eq("technician_id", profile.id)
      .order("pickup_at", { ascending: true, nullsFirst: false }),
  ]);

  return (
    <TechnicianJobs
      bookings={(bookings.data || []) as unknown as Booking[]}
      sells={(sells.data || []) as unknown as SellRequest[]}
    />
  );
}
