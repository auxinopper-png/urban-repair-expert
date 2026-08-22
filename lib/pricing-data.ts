import { getServerSupabase } from "@/lib/supabase/server";
import type { PricingTree, SellBrand, AgeBracket, ConditionDef } from "@/lib/pricing";

export const DEFAULT_TREE: PricingTree = {
  upliftPct: 20,
  ages: [
    { id: 1, label: "0 – 3 Years", multiplier: 1 },
    { id: 2, label: "3 – 5 Years", multiplier: 0.85 },
    { id: 3, label: "5 – 8 Years", multiplier: 0.65 },
    { id: 4, label: "8+ Years", multiplier: 0.45 },
  ],
  conditions: [
    { id: 1, label: "Excellent", multiplier: 1, note: "Like new, no repairs needed" },
    { id: 2, label: "Good", multiplier: 0.85, note: "Minor wear, fully working" },
    { id: 3, label: "Average", multiplier: 0.7, note: "Visible wear, working" },
    { id: 4, label: "Not Working", multiplier: 0.35, note: "Some fault / needs repair" },
  ],
  brands: [
    {
      id: "lg",
      name: "LG",
      models: [
        {
          id: "lg-sd",
          name: "Single Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "lg-190", label: "190 L", base_value: 2100 },
            { id: "lg-220", label: "220 L", base_value: 2500 },
          ],
        },
        {
          id: "lg-dd",
          name: "Double Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "lg-260", label: "260 L", base_value: 3200 },
            { id: "lg-308", label: "308 L", base_value: 3800 },
            { id: "lg-340", label: "340 L", base_value: 4300 },
          ],
        },
        {
          id: "lg-ac",
          name: "Split AC (Inverter)",
          appliance: "ac",
          capacities: [
            { id: "lg-1t", label: "1 Ton", base_value: 4400 },
            { id: "lg-15t", label: "1.5 Ton", base_value: 5200 },
            { id: "lg-2t", label: "2 Ton", base_value: 6100 },
          ],
        },
        {
          id: "lg-wac",
          name: "Window AC",
          appliance: "ac",
          capacities: [{ id: "lg-w15", label: "1.5 Ton", base_value: 3600 }],
        },
      ],
    },
    {
      id: "samsung",
      name: "Samsung",
      models: [
        {
          id: "sam-sd",
          name: "Single Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "sam-198", label: "198 L", base_value: 2200 },
            { id: "sam-225", label: "225 L", base_value: 2600 },
          ],
        },
        {
          id: "sam-dd",
          name: "Double Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "sam-253", label: "253 L", base_value: 3300 },
            { id: "sam-324", label: "324 L", base_value: 4200 },
          ],
        },
        {
          id: "sam-ac",
          name: "Split AC (Inverter)",
          appliance: "ac",
          capacities: [
            { id: "sam-1t", label: "1 Ton", base_value: 4300 },
            { id: "sam-15t", label: "1.5 Ton", base_value: 5100 },
            { id: "sam-2t", label: "2 Ton", base_value: 6000 },
          ],
        },
      ],
    },
    {
      id: "whirlpool",
      name: "Whirlpool",
      models: [
        {
          id: "wp-sd",
          name: "Single Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "wp-190", label: "190 L", base_value: 2000 },
            { id: "wp-215", label: "215 L", base_value: 2400 },
          ],
        },
        {
          id: "wp-dd",
          name: "Double Door Series",
          appliance: "refrigerator",
          capacities: [{ id: "wp-265", label: "265 L", base_value: 3200 }],
        },
        {
          id: "wp-ac",
          name: "Split AC",
          appliance: "ac",
          capacities: [
            { id: "wp-1t", label: "1 Ton", base_value: 4100 },
            { id: "wp-15t", label: "1.5 Ton", base_value: 4900 },
          ],
        },
      ],
    },
    {
      id: "voltas",
      name: "Voltas",
      models: [
        {
          id: "vol-ac",
          name: "Split AC (Vectra/Maha)",
          appliance: "ac",
          capacities: [
            { id: "vol-1t", label: "1 Ton", base_value: 4500 },
            { id: "vol-15t", label: "1.5 Ton", base_value: 5300 },
            { id: "vol-2t", label: "2 Ton", base_value: 6200 },
          ],
        },
        {
          id: "vol-wac",
          name: "Window AC",
          appliance: "ac",
          capacities: [
            { id: "vol-w1", label: "1 Ton", base_value: 3000 },
            { id: "vol-w15", label: "1.5 Ton", base_value: 3500 },
          ],
        },
      ],
    },
    {
      id: "daikin",
      name: "Daikin",
      models: [
        {
          id: "dai-ac",
          name: "Split AC (FTKM/FTKP)",
          appliance: "ac",
          capacities: [
            { id: "dai-1t", label: "1 Ton", base_value: 4800 },
            { id: "dai-15t", label: "1.5 Ton", base_value: 5600 },
            { id: "dai-2t", label: "2 Ton", base_value: 6500 },
          ],
        },
      ],
    },
    {
      id: "bluestar",
      name: "Blue Star",
      models: [
        {
          id: "bs-ac",
          name: "Split AC",
          appliance: "ac",
          capacities: [
            { id: "bs-1t", label: "1 Ton", base_value: 4400 },
            { id: "bs-15t", label: "1.5 Ton", base_value: 5200 },
          ],
        },
        {
          id: "bs-dd",
          name: "Double Door Fridge",
          appliance: "refrigerator",
          capacities: [{ id: "bs-280", label: "280 L", base_value: 3400 }],
        },
      ],
    },
    {
      id: "godrej",
      name: "Godrej",
      models: [
        {
          id: "god-sd",
          name: "Single Door Series",
          appliance: "refrigerator",
          capacities: [
            { id: "god-185", label: "185 L", base_value: 2000 },
            { id: "god-240", label: "240 L", base_value: 2800 },
          ],
        },
        {
          id: "god-ac",
          name: "Split AC",
          appliance: "ac",
          capacities: [
            { id: "god-1t", label: "1 Ton", base_value: 4000 },
            { id: "god-15t", label: "1.5 Ton", base_value: 4800 },
          ],
        },
      ],
    },
    {
      id: "haier",
      name: "Haier",
      models: [
        {
          id: "hai-dd",
          name: "Double Door Series",
          appliance: "refrigerator",
          capacities: [{ id: "hai-258", label: "258 L", base_value: 3100 }],
        },
        {
          id: "hai-ac",
          name: "Split AC",
          appliance: "ac",
          capacities: [{ id: "hai-15t", label: "1.5 Ton", base_value: 4700 }],
        },
      ],
    },
    {
      id: "other",
      name: "Other Brand",
      models: [
        {
          id: "oth-sd",
          name: "Single Door Fridge",
          appliance: "refrigerator",
          capacities: [{ id: "oth-190", label: "190 L", base_value: 1700 }],
        },
        {
          id: "oth-dd",
          name: "Double Door Fridge",
          appliance: "refrigerator",
          capacities: [{ id: "oth-260", label: "260 L", base_value: 2600 }],
        },
        {
          id: "oth-ac",
          name: "Split AC",
          appliance: "ac",
          capacities: [
            { id: "oth-1t", label: "1 Ton", base_value: 3600 },
            { id: "oth-15t", label: "1.5 Ton", base_value: 4300 },
            { id: "oth-2t", label: "2 Ton", base_value: 5000 },
          ],
        },
      ],
    },
  ],
};

interface RawRow {
  id: string;
  name?: string;
  label?: string;
  brand_id?: string;
  model_id?: string;
  appliance?: string;
  base_value?: number;
  multiplier?: number | string;
}

export async function getPricingTree(): Promise<PricingTree> {
  try {
    const sb = await getServerSupabase();
    if (!sb) return DEFAULT_TREE;

    const [brandsRes, modelsRes, capsRes, agesRes, condsRes, settingsRes] =
      await Promise.all([
        sb.from("sell_brands").select("*").order("sort"),
        sb.from("sell_models").select("*").order("sort"),
        sb.from("sell_capacities").select("*").order("sort"),
        sb.from("sell_age_brackets").select("*").order("id"),
        sb.from("sell_conditions").select("*").order("sort"),
        sb.from("settings").select("value").eq("key", "pricing").single(),
      ]);

    if (brandsRes.error || !brandsRes.data?.length) return DEFAULT_TREE;

    const brandsMap = new Map<string, SellBrand>();
    for (const b of brandsRes.data as RawRow[]) {
      brandsMap.set(b.id, { id: b.id, name: b.name!, models: [] });
    }
    const modelsMap = new Map<string, { id: string; name: string; appliance: "refrigerator" | "ac"; capacities: PricingTree["brands"][0]["models"][0]["capacities"] }>();
    for (const m of (modelsRes.data || []) as RawRow[]) {
      const brand = brandsMap.get(m.brand_id!);
      if (!brand) continue;
      const model = {
        id: m.id,
        name: m.name!,
        appliance: (m.appliance === "ac" ? "ac" : "refrigerator") as "ac" | "refrigerator",
        capacities: [] as { id: string; label: string; base_value: number }[],
      };
      modelsMap.set(m.id, model);
      brand.models.push(model);
    }
    for (const c of (capsRes.data || []) as RawRow[]) {
      const model = modelsMap.get(c.model_id!);
      if (!model) continue;
      model.capacities.push({
        id: c.id,
        label: c.label!,
        base_value: Number(c.base_value ?? 0),
      });
    }

    const ages: AgeBracket[] = ((agesRes.data || []) as RawRow[]).map((a) => ({
      id: Number(a.id),
      label: a.label!,
      multiplier: Number(a.multiplier ?? 1),
    }));

    const conditions: ConditionDef[] = ((condsRes.data || []) as RawRow[]).map((c) => ({
      id: Number(c.id),
      label: c.label ?? c.name!,
      note: "",
      multiplier: Number(c.multiplier ?? 1),
    }));

    let upliftPct = DEFAULT_TREE.upliftPct;
    const sv = settingsRes.data as { value?: { uplift_pct?: number } } | null;
    if (sv?.value && typeof sv.value.uplift_pct === "number") upliftPct = sv.value.uplift_pct;

    if (!ages.length || !conditions.length) return DEFAULT_TREE;

    return { brands: [...brandsMap.values()], ages, conditions, upliftPct };
  } catch {
    return DEFAULT_TREE;
  }
}
