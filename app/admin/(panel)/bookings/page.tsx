import { getServerSupabase } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import BookingsClient from "@/components/admin/BookingsClient";
import type { Booking } from "@/lib/services-data";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const sb = await getServerSupabase();

  if (!sb) {
    const store = getDemoStore();
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Repair Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Assign technicians, update status and manage every job.
          </p>
        </header>
        <BookingsClient
          bookings={store.bookings}
          technicians={store.techs.filter((t) => t.active)}
        />
      </div>
    );
  }

  const [bookings, techs] = await Promise.all([
    sb.from("bookings").select("*").order("created_at", { ascending: false }).limit(300),
    sb.from("profiles").select("id,name,mobile,active").eq("role", "technician").eq("active", true).order("name"),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Repair Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Assign technicians, update status and manage every job.
        </p>
      </header>
      <BookingsClient
        bookings={(bookings.data || []) as unknown as Booking[]}
        technicians={(techs.data || []) as { id: string; name: string | null; mobile: string | null }[]}
      />
    </div>
  );
}
