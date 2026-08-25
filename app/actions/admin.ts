"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { getDemoStore } from "@/lib/demo-store";
import { DEFAULT_TREE } from "@/lib/pricing-data";

async function requireAdmin() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function updateBookingStatus(id: string, status: string, note?: string) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const b = store.bookings.find((x) => x.id === id);
    if (b) {
      b.status = status as typeof b.status;
      if (note !== undefined) b.admin_note = note;
      revalidatePath("/admin/bookings");
      return { ok: true };
    }
    return { ok: false };
  }
  const { error } = await sb
    .from("bookings")
    .update({ status, ...(note !== undefined ? { admin_note: note } : {}) })
    .eq("id", id);
  if (!error) revalidatePath("/admin/bookings");
  return { ok: !error };
}

export async function assignBookingTechnician(bookingId: string, technicianId: string | null) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const b = store.bookings.find((x) => x.id === bookingId);
    if (b) {
      b.technician_id = technicianId;
      b.status = technicianId ? "assigned" : "pending";
      revalidatePath("/admin/bookings");
      return { ok: true };
    }
    return { ok: false };
  }
  const { error } = await sb
    .from("bookings")
    .update({
      technician_id: technicianId,
      status: technicianId ? "assigned" : "pending",
    })
    .eq("id", bookingId);
  if (!error) revalidatePath("/admin/bookings");
  return { ok: !error };
}

export async function updateSellStatus(id: string, status: string, note?: string) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const s = store.sells.find((x) => x.id === id);
    if (s) {
      s.status = status as typeof s.status;
      if (note !== undefined) s.admin_note = note;
      revalidatePath("/admin/sell");
      return { ok: true };
    }
    return { ok: false };
  }
  const { error } = await sb
    .from("sell_requests")
    .update({ status, ...(note !== undefined ? { admin_note: note } : {}) })
    .eq("id", id);
  if (!error) revalidatePath("/admin/sell");
  return { ok: !error };
}

export async function schedulePickup(
  id: string,
  pickupAt: string,
  technicianId: string | null
) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const s = store.sells.find((x) => x.id === id);
    if (s) {
      s.pickup_at = pickupAt || null;
      if (technicianId !== undefined && technicianId !== "") s.technician_id = technicianId;
      if (pickupAt && s.status === "requested") s.status = "scheduled";
      revalidatePath("/admin/sell");
      return { ok: true };
    }
    return { ok: false };
  }
  const updates: Record<string, unknown> = { pickup_at: pickupAt || null };
  if (technicianId !== undefined) updates.technician_id = technicianId;
  const { error } = await sb.from("sell_requests").update(updates).eq("id", id);
  if (!error) revalidatePath("/admin/sell");
  return { ok: !error };
}

export async function assignSellTechnician(id: string, technicianId: string | null) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const s = store.sells.find((x) => x.id === id);
    if (s) {
      s.technician_id = technicianId;
      revalidatePath("/admin/sell");
      return { ok: true };
    }
    return { ok: false };
  }
  const { error } = await sb
    .from("sell_requests")
    .update({ technician_id: technicianId })
    .eq("id", id);
  if (!error) revalidatePath("/admin/sell");
  return { ok: !error };
}

export async function saveBrand(input: { id?: string; name: string; sort?: number }) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    if (input.id) {
      const b = DEFAULT_TREE.brands.find((x) => x.id === input.id);
      if (b) b.name = input.name.trim();
    } else {
      DEFAULT_TREE.brands.push({
        id: `demo-brand-${Date.now()}`,
        name: input.name.trim(),
        models: [],
      });
    }
    revalidatePath("/admin/pricing");
    return { ok: true };
  }
  const payload = { name: input.name.trim(), sort: input.sort ?? 0 };
  const q = input.id
    ? sb.from("sell_brands").update(payload).eq("id", input.id)
    : sb.from("sell_brands").insert(payload);
  const { error } = await q;
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const idx = DEFAULT_TREE.brands.findIndex((x) => x.id === id);
    if (idx >= 0) DEFAULT_TREE.brands.splice(idx, 1);
    revalidatePath("/admin/pricing");
    return { ok: true };
  }
  const { error } = await sb.from("sell_brands").delete().eq("id", id);
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function saveModel(input: {
  id?: string;
  brand_id: string;
  name: string;
  appliance: "refrigerator" | "ac";
  sort?: number;
}) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const brand = DEFAULT_TREE.brands.find((x) => x.id === input.brand_id);
    if (brand) {
      if (input.id) {
        const m = brand.models.find((x) => x.id === input.id);
        if (m) m.name = input.name.trim();
      } else {
        brand.models.push({
          id: `demo-model-${Date.now()}`,
          name: input.name.trim(),
          appliance: input.appliance,
          capacities: [],
        });
      }
      revalidatePath("/admin/pricing");
      return { ok: true };
    }
    return { ok: false };
  }
  const payload = {
    brand_id: input.brand_id,
    name: input.name.trim(),
    appliance: input.appliance,
    sort: input.sort ?? 0,
  };
  const q = input.id
    ? sb.from("sell_models").update(payload).eq("id", input.id)
    : sb.from("sell_models").insert(payload);
  const { error } = await q;
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function deleteModel(id: string) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    for (const brand of DEFAULT_TREE.brands) {
      const idx = brand.models.findIndex((m) => m.id === id);
      if (idx >= 0) {
        brand.models.splice(idx, 1);
        break;
      }
    }
    revalidatePath("/admin/pricing");
    return { ok: true };
  }
  const { error } = await sb.from("sell_models").delete().eq("id", id);
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function saveCapacity(input: {
  id?: string;
  model_id: string;
  label: string;
  base_value: number;
  sort?: number;
}) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    for (const brand of DEFAULT_TREE.brands) {
      const model = brand.models.find((m) => m.id === input.model_id);
      if (model) {
        if (input.id) {
          const c = model.capacities.find((x) => x.id === input.id);
          if (c) {
            c.label = input.label.trim();
            c.base_value = Math.max(0, Math.round(input.base_value));
          }
        } else {
          model.capacities.push({
            id: `demo-cap-${Date.now()}`,
            label: input.label.trim(),
            base_value: Math.max(0, Math.round(input.base_value)),
          });
        }
        break;
      }
    }
    revalidatePath("/admin/pricing");
    return { ok: true };
  }
  const payload = {
    model_id: input.model_id,
    label: input.label.trim(),
    base_value: Math.max(0, Math.round(input.base_value)),
    sort: input.sort ?? 0,
  };
  const q = input.id
    ? sb.from("sell_capacities").update(payload).eq("id", input.id)
    : sb.from("sell_capacities").insert(payload);
  const { error } = await q;
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function deleteCapacity(id: string) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    for (const brand of DEFAULT_TREE.brands) {
      for (const model of brand.models) {
        const idx = model.capacities.findIndex((c) => c.id === id);
        if (idx >= 0) {
          model.capacities.splice(idx, 1);
          revalidatePath("/admin/pricing");
          return { ok: true };
        }
      }
    }
    return { ok: false };
  }
  const { error } = await sb.from("sell_capacities").delete().eq("id", id);
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function saveMultiplier(
  table: "sell_age_brackets" | "sell_conditions",
  id: number,
  multiplier: number
) {
  await requireAdmin();
  const value = Math.min(1.5, Math.max(0.05, multiplier));
  const sb = await getServerSupabase();
  if (!sb) {
    const list = table === "sell_age_brackets" ? DEFAULT_TREE.ages : DEFAULT_TREE.conditions;
    const item = list.find((x) => x.id === id);
    if (item) item.multiplier = value;
    revalidatePath("/admin/pricing");
    return { ok: true };
  }
  const { error } = await sb.from(table).update({ multiplier: value }).eq("id", id);
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function saveUplift(pct: number) {
  await requireAdmin();
  const value = Math.min(60, Math.max(0, pct));
  const sb = await getServerSupabase();
  if (!sb) {
    DEFAULT_TREE.upliftPct = value;
    revalidatePath("/admin/pricing");
    revalidatePath("/sell");
    return { ok: true };
  }
  const { error } = await sb
    .from("settings")
    .upsert({ key: "pricing", value: { uplift_pct: value } }, { onConflict: "key" });
  if (!error) revalidatePath("/admin/pricing");
  return { ok: !error };
}

export async function createTechnician(form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const mobile = String(form.get("mobile") || "").trim();

  if (!name || !email || password.length < 6)
    return { ok: false, error: "Name, email and a 6+ character password are required." };

  const svc = getServiceSupabase();
  if (!svc) {
    const store = getDemoStore();
    if (mobile && store.techs.some((t) => t.mobile === mobile))
      return { ok: false, error: "This mobile number is already registered." };
    store.techs.push({
      id: `demo-tech-${Date.now()}`,
      name,
      mobile: mobile || null,
      active: true,
    });
    revalidatePath("/admin/technicians");
    return {
      ok: true,
      error: `Demo: "${name}" added to the team list. Real login credentials can be created once Supabase is connected.`,
    };
  }

  const { data, error } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "technician", name },
  });
  if (error) return { ok: false, error: error.message };

  const sb = await getServerSupabase();
  if (sb && data.user) {
    await sb.from("profiles").upsert({
      id: data.user.id,
      role: "technician",
      name,
      mobile: mobile || null,
      active: true,
    });
  }
  revalidatePath("/admin/technicians");
  return { ok: true };
}

export async function toggleTechnicianActive(id: string, active: boolean) {
  await requireAdmin();
  const sb = await getServerSupabase();
  if (!sb) {
    const store = getDemoStore();
    const t = store.techs.find((x) => x.id === id);
    if (t) t.active = active;
    revalidatePath("/admin/technicians");
    return { ok: true };
  }
  const { error } = await sb.from("profiles").update({ active }).eq("id", id);
  if (!error) revalidatePath("/admin/technicians");
  return { ok: !error };
}

export async function signOut() {
  const c = await cookies();
  c.delete("ure_demo");
  const sb = await getServerSupabase();
  if (sb) await sb.auth.signOut();
  redirect("/");
}
