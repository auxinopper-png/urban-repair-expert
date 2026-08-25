import type { Metadata } from "next";
import AuthForm from "@/components/admin/AuthForm";
import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technician Login",
  robots: { index: false, follow: false },
};

export default function TechnicianLoginPage() {
  const demo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 to-brand-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block rounded-2xl bg-white p-3 shadow-glow">
            <Logo />
          </Link>
        </div>
        <div className="rounded-[28px] bg-white p-7 shadow-2xl sm:p-9">
          <h1 className="text-2xl font-extrabold tracking-tight">Technician Portal</h1>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            {demo
              ? "Demo mode — test with assigned sample jobs."
              : "View your assigned jobs & update status on the go."}
          </p>
          <AuthForm role="technician" redirectTo="/technician" demo={demo} />
        </div>
      </div>
    </section>
  );
}
