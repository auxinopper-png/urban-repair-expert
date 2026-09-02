"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { genCode, mapsLink, prettyDate } from "@/lib/utils";
import { verifyRecaptcha } from "@/lib/auth";

export interface BookingInput {
  customer_name: string;
  mobile: string;
  appliance: string;
  appliance_label: string;
  brand: string;
  model?: string;
  problems: string[];
  problem_note?: string;
  preferred_date: string;
  preferred_slot: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  website?: string;
  recaptcha_token?: string;
}

export interface BookingResult {
  ok: boolean;
  error?: string;
  code?: string;
  whatsapp_text?: string;
}

function buildBookingText(code: string, b: BookingInput) {
  return [
    `NEW REPAIR BOOKING — ${code}`,
    "",
    `Name: ${b.customer_name}`,
    `Mobile: ${b.mobile}`,
    `Appliance: ${b.appliance_label} — ${b.brand}${b.model ? ` ${b.model}` : ""}`,
    `Problem: ${b.problems.join(", ")}`,
    b.problem_note ? `Details: ${b.problem_note}` : "",
    `Preferred Visit: ${prettyDate(b.preferred_date)}, ${b.preferred_slot}`,
    `Address: ${b.address}`,
    b.lat != null && b.lng != null ? `GPS Location: ${mapsLink(b.lat, b.lng)}` : "",
    "Photos: attached in this chat",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  if (input.website) return { ok: true, code: "OK" };
  const valid = await verifyRecaptcha(input.recaptcha_token);
  if (!valid) return { ok: false, error: "Spam check failed. Please refresh and try again." };

  if (!/^[6-9]\d{9}$/.test(input.mobile.replace(/\D/g, "").slice(-10)))
    return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  if (!input.customer_name.trim() || !input.address.trim())
    return { ok: false, error: "Please fill your name and address." };

  const sb = await getServerSupabase();
  const code = genCode("URE");
  const text = buildBookingText(code, input);

  if (!sb) {
    const { getDemoStore } = await import("@/lib/demo-store");
    const store = getDemoStore();
    store.bookings.unshift({
      id: `demo-${Date.now()}`,
      booking_code: code,
      created_at: new Date().toISOString(),
      customer_name: input.customer_name.trim(),
      mobile: input.mobile,
      appliance: input.appliance as never,
      brand: input.brand,
      model: input.model || null,
      problems: input.problems,
      problem_note: input.problem_note || null,
      preferred_date: input.preferred_date,
      preferred_slot: input.preferred_slot,
      address: input.address.trim(),
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      photo_url: null,
      status: "pending",
      technician_id: null,
      admin_note: null,
    });
    return { ok: true, code, whatsapp_text: text };
  }

  const { error } = await sb.from("bookings").insert({
    booking_code: code,
    customer_name: input.customer_name.trim(),
    mobile: input.mobile,
    appliance: input.appliance,
    brand: input.brand,
    model: input.model || null,
    problems: input.problems,
    problem_note: input.problem_note || null,
    preferred_date: input.preferred_date,
    preferred_slot: input.preferred_slot,
    address: input.address.trim(),
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    photo_url: null,
    status: "pending",
  });

  if (error) {
    return { ok: true, code, whatsapp_text: text };
  }

  return { ok: true, code, whatsapp_text: text };
}
