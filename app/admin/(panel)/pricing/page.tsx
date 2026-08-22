import { getServerSupabase } from "@/lib/supabase/server";
import PricingEditor, { type TreeWithSort } from "@/components/admin/PricingEditor";
import { DEFAULT_TREE } from "@/lib/pricing-data";

export const dynamic = "force-dynamic";

function defaultTreeAsEditable(): TreeWithSort {
  return {
    ...DEFAULT_TREE,
    brands: DEFAULT_TREE.brands.map((b) => ({
      ...b,
      models: b.models.map((m) => ({ ...m, appliance: m.appliance as string })),
    })),
  };
}

export default async function AdminPricingPage() {
  const sb = await getServerSupabase();

  if (!sb) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Price Engine</h1>
          <p className="mt-1 text-sm text-slate-500">
            Demo mode — sample pricing dikh raha hai. Changes save nahi honge.
          </p>
        </header>
        <PricingEditor tree={defaultTreeAsEditable()} />
      </div>
    );
  }

  const [brandsRes, modelsRes, capsRes, agesRes, condsRes, settingsRes] = await Promise.all([
    sb.from("sell_brands").select("*").order("sort").order("name"),
    sb.from("sell_models").select("*").order("sort"),
    sb.from("sell_capacities").select("*").order("sort"),
    sb.from("sell_age_brackets").select("*").order("id"),
    sb.from("sell_conditions").select("*").order("sort"),
    sb.from("settings").select("value").eq("key", "pricing").single(),
  ]);

  if (brandsRes.error || !brandsRes.data?.length) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <h1 className="text-xl font-extrabold">Price Engine</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
          Pricing tables are empty. Run <code className="rounded bg-slate-100 px-1.5 py-0.5">supabase/schema.sql</code>{" "}
          in the Supabase SQL editor to load starter brands &amp; prices.
        </p>
      </div>
    );
  }

  const tree = {
    ...DEFAULT_TREE,
    brands: (brandsRes.data || []).map((b) => ({
      id: b.id,
      name: b.name,
      sort: b.sort ?? 0,
      models: (modelsRes.data || [])
        .filter((m) => m.brand_id === b.id)
        .map((m) => ({
          id: m.id,
          name: m.name,
          appliance: m.appliance as string,
          capacities: (capsRes.data || [])
            .filter((c) => c.model_id === m.id)
            .map((c) => ({ id: c.id, label: c.label, base_value: Number(c.base_value) })),
        })),
    })),
    ages: (agesRes.data || []).map((a) => ({
      id: a.id,
      label: a.label,
      multiplier: Number(a.multiplier),
    })),
    conditions: (condsRes.data || []).map((c) => ({
      id: c.id,
      label: c.label,
      note: c.note || "",
      multiplier: Number(c.multiplier),
    })),
    upliftPct:
      (settingsRes.data?.value as { uplift_pct?: number } | null)?.uplift_pct ??
      DEFAULT_TREE.upliftPct,
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Price Engine</h1>
        <p className="mt-1 text-sm text-slate-500">
          Control buyback pricing — customer offers update instantly across the website.
        </p>
      </header>
      <PricingEditor tree={tree} />
    </div>
  );
}
