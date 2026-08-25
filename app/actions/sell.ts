"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { genCode, formatINR, mapsLink } from "@/lib/utils";
import { notifyWebhook, verifyRecaptcha } from "@/lib/auth";
import type { SellPhoto } from "@/lib/services-data";

export interface SellInput {
  customer_name: string;
  mobile: string;
  appliance: string;
  appliance_label: string;
  brand_name: string;
  model_name: string;
  capacity_label: string;
  age_label: string;
  condition_label: string;
  estimated_market: number;
  estimated_offer: number;
  other_offer?: number | null;
  photos: SellPhoto[];
  video_url?: string | null;
  address: string;
  lat?: number | null;
  lng?: number | null;
  website?: string;
  recaptcha_token?: string;
}

export interface SellResult {
  ok: boolean;
  error?: string;
  code?: string;
  fallback_text?: string;
}

function summaryText(code: string, s: SellInput) {
  return [
    `New Sell Pickup Request ${code}`,
    `Name: ${s.customer_name}`,
    `Mobile: ${s.mobile}`,
    `Appliance: ${s.appliance_label} — ${s.brand_name} ${s.model_name} (${s.capacity_label})`,
    `Age: ${s.age_label} · Condition: ${s.condition_label}`,
    `Est. Value: ${formatINR(s.estimated_market)} → Our Offer: ${formatINR(s.estimated_offer)}`,
    `Address: ${s.address}`,
    s.lat && s.lng ? `Location: ${mapsLink(s.lat, s.lng)}` : "",
    s.photos.length ? `Photos: ${s.photos.map((p) => p.url).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createSellRequest(input: SellInput): Promise<SellResult> {
  if (input.website) return { ok: true, code: "OK" };
  const valid = await verifyRecaptcha(input.recaptcha_token);
  if (!valid) return { ok: false, error: "Spam check failed. Please refresh and try again." };

  if (!/^[6-9]\d{9}$/.test(input.mobile.replace(/\D/g, "").slice(-10)))
    return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  if (!input.customer_name.trim() || !input.address.trim())
    return { ok: false, error: "Please fill your name and address." };

  const sb = await getServerSupabase();
  const code = genCode("SELL");

  if (!sb) {
    const { getDemoStore } = await import("@/lib/demo-store");
    const store = getDemoStore();
    store.sells.unshift({
      id: `demo-${Date.now()}`,
      request_code: code,
      created_at: new Date().toISOString(),
      customer_name: input.customer_name.trim(),
      mobile: input.mobile,
      appliance: input.appliance as never,
      brand_name: input.brand_name,
      model_name: input.model_name,
      capacity_label: input.capacity_label,
      age_label: input.age_label,
      condition_label: input.condition_label,
      estimated_market: input.estimated_market,
      estimated_offer: input.estimated_offer,
      other_offer: input.other_offer ?? null,
      photos: input.photos,
      video_url: input.video_url || null,
      address: input.address.trim(),
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      status: "requested",
      pickup_at: null,
      technician_id: null,
      admin_note: null,
    });
    notifyWebhook({ type: "sell_request", code, ...input });
    return { ok: true, code, fallback_text: summaryText(code, input) };
  }

  const { error } = await sb.from("sell_requests").insert({
    request_code: code,
    customer_name: input.customer_name.trim(),
    mobile: input.mobile,
    appliance: input.appliance,
    brand_name: input.brand_name,
    model_name: input.model_name,
    capacity_label: input.capacity_label,
    age_label: input.age_label,
    condition_label: input.condition_label,
    estimated_market: input.estimated_market,
    estimated_offer: input.estimated_offer,
    other_offer: input.other_offer ?? null,
    photos: input.photos,
    video_url: input.video_url || null,
    address: input.address.trim(),
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    status: "requested",
  });

  if (error) {
    return { ok: true, code, fallback_text: summaryText(code, input) };
  }

  notifyWebhook({ type: "sell_request", code, ...input });
  return { ok: true, code };
}
