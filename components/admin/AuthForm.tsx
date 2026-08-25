"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, FlaskConical } from "lucide-react";
import { getBrowserSupabase, isDbConfigured } from "@/lib/supabase/client";
import { demoLogin } from "@/app/actions/demo";

export default function AuthForm({
  role,
  redirectTo,
  demo,
}: {
  role: "admin" | "technician";
  redirectTo: string;
  demo?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = demo === undefined ? isDbConfigured() : !demo;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!configured) {
      setLoading(true);
      const expected = `${role}@demo.in`;
      if (email.trim().toLowerCase() === expected && password === "demo123") {
        await demoLogin(role);
        router.replace(redirectTo);
        router.refresh();
        return;
      }
      setError(`Use these demo credentials — Email: ${expected} · Password: demo123`);
      setLoading(false);
      return;
    }

    setLoading(true);
    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Database not configured. Add Supabase keys to .env.local and restart.");
      setLoading(false);
      return;
    }
    const { data, error: err } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    const { data: profile } = await sb
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (!profile || profile.role !== role) {
      await sb.auth.signOut();
      setError(`This account doesn't have ${role} access.`);
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {!configured ? (
        <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-800">
            <FlaskConical className="h-3.5 w-3.5" /> Demo Mode Active
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            Test credentials:
            <button
              type="button"
              onClick={() => {
                setEmail(`${role}@demo.in`);
                setPassword("demo123");
              }}
              className="mt-2 flex w-full items-center justify-between gap-2 rounded-xl bg-white px-3.5 py-2.5 text-left text-[13px] font-bold text-slate-800 ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
              <span>
                {role}@demo.in
                <span className="block font-normal text-slate-400">password: demo123</span>
              </span>
              <span className="text-xs font-extrabold text-brand-600">Fill →</span>
            </button>
          </p>
        </div>
      ) : null}

      <div>
        <label className="label-text">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            autoComplete="email"
            className="field !pl-11"
            placeholder={configured ? "you@urbanrepairexpert.in" : `${role}@demo.in`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label-text">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            autoComplete="current-password"
            className="field !pl-11"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>
      ) : null}
      <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : configured ? (
          `Sign in to ${role} panel`
        ) : (
          `Enter ${role} panel (Demo)`
        )}
      </button>
      {!configured ? (
        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          Real email/password login activates automatically once Supabase keys are added — demo mode is removed then.
        </p>
      ) : null}
    </form>
  );
}
