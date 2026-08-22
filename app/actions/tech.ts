"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { getDemoStore } from "@/lib/demo-store";
import type { SellRequest } from "@/lib/services-data";

async function requireTech() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "technician") throw new Error("Unauthorized");
  return profile;
}

export async function updateJobStatus(
  kind: "booking" | "sell",
  id: string,
  status: string
) {
  const profile = await requireTech();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const job =
      kind === "booking"
        ? store.bookings.find((x) => x.id === id && x.technician_id === profile.id)
        : store.sells.find((x) => x.id === id && x.technician_id === profile.id);
    if (job) {
      (job as { status: string }).status = status;
      revalidatePath("/technician");
      return { ok: true };
    }
    return { ok: false };
  }
  const table = kind === "booking" ? "bookings" : "sell_requests";
  const { error } = await sb
    .from(table)
    .update({ status })
    .eq("id", id)
    .eq("technician_id", profile.id);
  if (!error) revalidatePath("/technician");
  return { ok: !error };
}

export async function saveJobPhotos(
  kind: "booking" | "sell",
  id: string,
  photos: Record<string, string>
) {
  const profile = await requireTech();
  const sb = await getServerSupabase();
  if (!sb) {
    revalidatePath("/technician");
    return { ok: true };
  }
  const table = kind === "booking" ? "bookings" : "sell_requests";
  const { data } = await sb
    .from(table)
    .select("admin_note")
    .eq("id", id)
    .eq("technician_id", profile.id)
    .single();
  let merged: Record<string, string> = {};
  try {
    merged = JSON.parse(data?.admin_note || "{}");
  } catch {}
  merged = { ...merged, ...photos };
  const { error } = await sb
    .from(table)
    .update({ admin_note: JSON.stringify(merged) })
    .eq("id", id)
    .eq("technician_id", profile.id);
  if (!error) revalidatePath("/technician");
  return { ok: !error };
}

export async function markJobCompleted(
  kind: "booking" | "sell",
  id: string,
  finalAmount?: number
) {
  const profile = await requireTech();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const job =
      kind === "booking"
        ? store.bookings.find((x) => x.id === id && x.technician_id === profile.id)
        : store.sells.find((x) => x.id === id && x.technician_id === profile.id);
    if (job) {
      job.status = kind === "booking" ? "completed" : "purchased";
      if (finalAmount && kind === "sell")
        (job as SellRequest).estimated_offer = finalAmount;
      revalidatePath("/technician");
      return { ok: true };
    }
    return { ok: false };
  }
  const table = kind === "booking" ? "bookings" : "sell_requests";
  const updates: Record<string, unknown> = {
    status: kind === "booking" ? "completed" : "purchased",
  };
  if (finalAmount && kind === "sell") updates.estimated_offer = finalAmount;
  const { error } = await sb
    .from(table)
    .update(updates)
    .eq("id", id)
    .eq("technician_id", profile.id);
  if (!error) revalidatePath("/technician");
  return { ok: !error };
}
