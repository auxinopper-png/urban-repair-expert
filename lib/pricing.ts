export interface Capacity {
  id: string;
  label: string;
  base_value: number;
}

export interface SellModel {
  id: string;
  name: string;
  appliance: "refrigerator" | "ac";
  capacities: Capacity[];
}

export interface SellBrand {
  id: string;
  name: string;
  models: SellModel[];
}

export interface AgeBracket {
  id: number;
  label: string;
  multiplier: number;
}

export interface ConditionDef {
  id: number;
  label: string;
  multiplier: number;
  note: string;
}

export interface PricingTree {
  brands: SellBrand[];
  ages: AgeBracket[];
  conditions: ConditionDef[];
  upliftPct: number;
}

export function computePrices(
  baseValue: number,
  age: AgeBracket | null,
  condition: ConditionDef | null,
  upliftPct: number
): { market: number; offer: number } | null {
  if (!age || !condition) return null;
  const market = Math.round((baseValue * age.multiplier * condition.multiplier) / 10) * 10;
  const offer = Math.round((market * (1 + upliftPct / 100)) / 10) * 10;
  return { market, offer };
}

export function marketRange(
  appliance: "refrigerator" | "ac" | null,
  modelName: string | null,
  capacityLabel: string | null
): { min: number; max: number } | null {
  if (!appliance || !modelName) return null;
  const n = modelName.toLowerCase();
  const c = (capacityLabel || "").toLowerCase();

  if (appliance === "refrigerator") {
    if (n.includes("3-door") || n.includes("side") || n.includes("sbs")) return { min: 4500, max: 14000 };
    if (n.includes("double")) return { min: 2000, max: 6500 };
    if (n.includes("single")) return { min: 900, max: 2600 };
    return { min: 1000, max: 6000 };
  }
  if (n.includes("window")) return { min: 1200, max: 3800 };
  if (c.includes("2 ton")) return { min: 3500, max: 9000 };
  if (c.includes("1.5")) return { min: 2800, max: 7500 };
  if (c.includes("1 ton")) return { min: 2200, max: 6000 };
  return { min: 2000, max: 7000 };
}