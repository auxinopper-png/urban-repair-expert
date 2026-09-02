"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Wrench, Snowflake, CheckCircle2, Circle } from "lucide-react";
import { STATUS_LABELS } from "@/lib/services-data";
import { prettyDate, prettyDateTime, cn } from "@/lib/utils";

interface TrackResult {
  type: "repair" | "sell";
  code: string;
  title: string;
  detail: string;
  date: string;
  slot: string;
  status: string;
  flow: string[];
}

export default function TrackForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackResult[] | null>(null);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = (await res.json()) as { results: TrackResult[] };
      setResults(json.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={search} className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            className="field !pl-12"
            placeholder="e.g. URE-250902-XY7Z or SELL-250902-AB12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading || !query.trim()} className="btn-primary !px-6">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}
        </button>
      </form>

      {results === null ? null : results.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 rounded-2xl bg-slate-50 p-6 text-center text-sm font-medium text-slate-500"
        >
          No bookings found for “{query}”. Double-check the ID — or WhatsApp us and we'll find it
          instantly.
        </motion.p>
      ) : (
        <div className="mt-8 space-y-5">
          {results.map((r, i) => {
            const idx = r.flow.indexOf(r.status);
            const done = r.status === "completed" || r.status === "purchased";
            const cancelled = r.status === "cancelled";
            return (
              <motion.div
                key={r.code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      r.type === "repair"
                        ? "bg-brand-50 text-brand-600"
                        : "bg-amber-50 text-amber-600"
                    )}
                  >
                    {r.type === "repair" ? (
                      <Wrench className="h-6 w-6" />
                    ) : (
                      <Snowflake className="h-6 w-6" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      cancelled
                        ? "bg-rose-100 text-rose-700"
                        : done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight">{r.title}</h3>
                <p className="text-sm text-slate-500">{r.detail}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {r.code}
                  {r.date ? ` · ${prettyDate(r.date)}${r.slot ? ` · ${r.slot}` : ""}` : ""}
                </p>

                {!cancelled ? (
                  <ol className="mt-5 space-y-0">
                    {r.flow.map((s, fi) => {
                      const reached = fi <= idx;
                      const last = fi === r.flow.length - 1;
                      return (
                        <li key={s} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            {reached ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5 shrink-0 text-slate-200" />
                            )}
                            {!last ? (
                              <span
                                className={cn(
                                  "w-0.5 flex-1 py-0.5",
                                  fi < idx ? "bg-emerald-300" : "bg-slate-100"
                                )}
                              />
                            ) : null}
                          </div>
                          <div className="pb-4">
                            <p
                              className={cn(
                                "text-sm font-semibold leading-none pt-0.5",
                                reached ? "text-slate-900" : "text-slate-400"
                              )}
                            >
                              {STATUS_LABELS[s] ?? s}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : null}

                <p className="mt-1 text-[11px] text-slate-400">
                  Last updated {prettyDateTime(new Date())} · Questions? One-tap call from the
                  bottom bar.
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
