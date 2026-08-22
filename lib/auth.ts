import { cookies } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";
import type { Profile } from "@/lib/services-data";

export async function getSessionProfile(): Promise<Profile | null> {
  const sb = await getServerSupabase();

  if (!sb) {
    const store = await cookies();
    const demo = store.get("ure_demo")?.value;
    if (demo === "admin")
      return { id: "demo-admin", role: "admin", name: "Demo Admin", mobile: null, active: true };
    if (demo === "technician")
      return { id: "tech-demo-1", role: "technician", name: "Ramesh Kumar", mobile: "9810012345", active: true };
    return null;
  }

  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await sb
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (!profile || !(profile as Profile).active) return null;
  return profile as Profile;
}

export function notifyWebhook(payload: Record<string, unknown>) {
  const hookUrl = process.env.ADMIN_WEBHOOK_URL;
  if (!hookUrl) return;
  fetch(hookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = (await res.json()) as { success?: boolean; score?: number };
    return Boolean(json.success) && (json.score === undefined || json.score >= 0.3);
  } catch {
    return false;
  }
}
