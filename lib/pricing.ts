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
  const offer = Math.round(market * (1 + upliftPct / 100));
  return { market, offer };
}