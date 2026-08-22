"use client";

import { useState, useTransition } from "react";
import { Power, UserPlus } from "lucide-react";
import { createTechnician, toggleTechnicianActive } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

interface Tech {
  id: string;
  name: string | null;
  mobile: string | null;
  active: boolean;
  openJobs: number;
}

export default function TechniciansClient({ techs }: { techs: Tech[] }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-extrabold">Team ({techs.length})</h2>
        {techs.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No technicians yet. Create the first one →
          </p>
        ) : (
          <div className="space-y-3">
            {techs.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-extrabold text-white">
                  {(t.name || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{t.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {t.mobile || "—"} · {t.openJobs} open job{t.openJobs === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    t.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                  )}
                >
                  {t.active ? "Active" : "Disabled"}
                </span>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleTechnicianActive(t.id, !t.active);
                    })
                  }
                  title={t.active ? "Disable account" : "Enable account"}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="h-fit rounded-3xl bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <UserPlus className="h-5 w-5 text-brand-600" /> Add Technician
        </h2>
        <form
          action={(fd) => startTransition(() => createTechnician(fd).then(setResult))}
          className="mt-4 space-y-3.5"
        >
          <input name="name" required placeholder="Full name" className="field" />
          <input name="mobile" placeholder="Mobile (optional)" className="field" inputMode="numeric" />
          <input name="email" type="email" required placeholder="Login email" className="field" />
          <input name="password" type="text" required minLength={6} placeholder="Password (6+ chars)" className="field" />
          <button disabled={pending} className="btn-primary w-full !py-3.5 !text-sm">
            Create Account
          </button>
          {msg ? (
            <p
              className={cn(
                "rounded-xl px-4 py-3 text-xs font-semibold",
                msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              )}
            >
              {msg.text}
            </p>
          ) : null}
          <p className="text-[11px] leading-relaxed text-slate-400">
            Requires SUPABASE_SERVICE_ROLE_KEY in .env.local for creating auth users.
          </p>
        </form>
      </section>
    </div>
  );

  function setResult(r: { ok: boolean; error?: string }) {
    setMsg(
      r.ok
        ? { ok: true, text: "Technician created! They can now sign in at /technician." }
        : { ok: false, text: r.error || "Failed to create technician." }
    );
  }
}
