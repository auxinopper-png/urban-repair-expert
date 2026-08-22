"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

interface Toast {
  id: number;
  text: string;
}

export default function RealtimeToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(text: string) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;

    const channel = sb
      .channel("admin-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const row = payload.new as { booking_code?: string; customer_name?: string };
          push(`New repair booking: ${row.booking_code} · ${row.customer_name}`);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sell_requests" },
        (payload) => {
          const row = payload.new as { request_code?: string; customer_name?: string };
          push(`New sell pickup: ${row.request_code} · ${row.customer_name}`);
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl ring-1 ring-white/10"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Bell className="h-4 w-4" />
            </span>
            <p className="flex-1 pt-1 text-xs font-semibold leading-snug">{t.text}</p>
            <button
              onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
              aria-label="Dismiss"
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
