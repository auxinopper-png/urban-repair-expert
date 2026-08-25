import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/admin";
import Logo from "@/components/Logo";
import { getSessionProfile } from "@/lib/auth";

export const metadata = {
  title: "Technician Portal",
  robots: { index: false, follow: false },
};

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "technician") redirect("/technician/login");

  const demo =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="rounded-xl bg-white px-2.5 py-1.5">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-right text-xs font-bold text-white">
              {profile.name}
              <span className="block text-[10px] font-normal text-slate-400">Technician</span>
            </p>
            <form action={signOut}>
              <button className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-rose-500 hover:text-white">
                Sign Out
              </button>
            </form>
          </div>
        </div>
        {demo ? (
          <div className="bg-amber-400 py-1.5 text-center text-[11px] font-extrabold text-slate-950">
            DEMO MODE — sample jobs · connect Supabase for live data
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-3xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
