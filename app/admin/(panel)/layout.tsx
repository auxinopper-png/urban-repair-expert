import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RealtimeToaster from "@/components/admin/RealtimeToaster";
import { getSessionProfile } from "@/lib/auth";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") redirect("/admin/login");

  const demo =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar name={profile.name || "Admin"} />
      <RealtimeToaster />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {demo ? (
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl bg-amber-400 px-4 py-2.5 text-center text-xs font-extrabold text-slate-950">
            🧪 DEMO MODE — sample data, changes reset on server restart.
            <span className="font-semibold text-amber-900">
              .env.local me Supabase keys daalte hi real panel activate ho jayega.
            </span>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
