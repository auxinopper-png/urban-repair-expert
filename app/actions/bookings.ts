"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { genCode } from "@/lib/utils";
import { notifyWebhook, verifyRecaptcha } from "@/lib/auth";

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
  photo_url?: string | null;
  website?: string;
  recaptcha_token?: string;
}

export interface BookingResult {
  ok: boolean;
  error?: string;
  code?: string;
  fallback_text?: string;
}

function summaryText(code: string, b: BookingInput) {
  return [
    `New Repair Booking ${code}`,
    `Name: ${b.customer_name}`,
    `Mobile: ${b.mobile}`,
    `Appliance: ${b.appliance_label} (${b.brand}${b.model ? " " + b.model : ""})`,
    `Problem: ${b.problems.join(", ")}${b.problem_note ? ` — ${b.problem_note}` : ""}`,
    `When: ${b.preferred_date}, ${b.preferred_slot}`,
    `Address: ${b.address}`,
    b.lat && b.lng ? `Location: https://www.google.com/maps?q=${b.lat},${b.lng}` : "",
    b.photo_url ? `Photo: ${b.photo_url}` : "",
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

  if (!sb) {
    return { ok: true, code, fallback_text: summaryText(code, input) };
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
    photo_url: input.photo_url || null,
    status: "pending",
  });

  if (error) {
    return { ok: true, code, fallback_text: summaryText(code, input) };
  }

  notifyWebhook({ type: "booking", code, ...input });
  return { ok: true, code };
}
