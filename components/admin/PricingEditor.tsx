"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import {
  deleteBrand,
  deleteCapacity,
  deleteModel,
  saveBrand,
  saveCapacity,
  saveModel,
  saveMultiplier,
  saveUplift,
} from "@/app/actions/admin";
import type { Capacity, PricingTree } from "@/lib/pricing";
import { cn, formatINR } from "@/lib/utils";

type EditorModel = {
  id: string;
  name: string;
  appliance: string;
  capacities: Capacity[];
};

type EditorBrand = {
  id: string;
  name: string;
  sort?: number;
  models: EditorModel[];
};

export type TreeWithSort = Omit<PricingTree, "brands"> & { brands: EditorBrand[] };

export default function PricingEditor({ tree }: { tree: TreeWithSort }) {
  const [uplift, setUplift] = useState(String(tree.upliftPct));
  const [openBrand, setOpenBrand] = useState<string | null>(tree.brands[0]?.id ?? null);
  const [newBrand, setNewBrand] = useState("");
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
    });
  }

  return (
    <div className="space-y-6" style={{ opacity: pending ? 0.7 : 1 }}>
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-brand-900 p-6 text-white sm:p-8">
        <h2 className="text-lg font-extrabold">Global Offer Uplift</h2>
        <p className="mt-1 max-w-lg text-sm text-slate-300">
          Customer offers = estimated market value × this percentage. Example: 20% uplift turns a
          ₹1,460 market estimate into a ₹1,750 offer.
        </p>
        <div className="mt-4 flex max-w-xs items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              max={60}
              className="field !bg-white/10 !text-white ring-1 ring-white/20"
              value={uplift}
              onChange={(e) => setUplift(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white/60">%</span>
          </div>
          <button
            onClick={() => run(() => saveUplift(Number(uplift)))}
            disabled={pending}
            className="btn-accent !py-3"
          >
            Save
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Age & Condition Multipliers</h2>
        <p className="mt-1 text-sm text-slate-500">
          Market value = capacity base × age multiplier × condition multiplier.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Age Brackets</p>
            {tree.ages.map((a) => (
              <MultiplierRow
                key={a.id}
                label={a.label}
                value={a.multiplier}
                onSave={(v) => run(() => saveMultiplier("sell_age_brackets", a.id, v))}
              />
            ))}
          </div>
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Conditions</p>
            {tree.conditions.map((c) => (
              <MultiplierRow
                key={c.id}
                label={c.label}
                value={c.multiplier}
                onSave={(v) => run(() => saveMultiplier("sell_conditions", c.id, v))}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Brands · Models · Capacities</h2>
        <p className="mt-1 text-sm text-slate-500">
          Base values are the market reference for each capacity in excellent, like-new condition.
        </p>

        <div className="mt-5 flex gap-2">
          <input
            className="field flex-1"
            placeholder="Add new brand…"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <button
            onClick={() => {
              if (!newBrand.trim()) return;
              run(async () => {
                await saveBrand({ name: newBrand });
                setNewBrand("");
              });
            }}
            className="btn-primary shrink-0 !px-5"
          >
            <Plus className="h-4 w-4" /> Brand
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {tree.brands.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-slate-100">
              <button
                onClick={() => setOpenBrand(openBrand === b.id ? null : b.id)}
                className="flex w-full items-center gap-3 bg-slate-50 px-5 py-4 text-left transition hover:bg-slate-100"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-slate-400 transition",
                    openBrand === b.id && "rotate-180"
                  )}
                />
                <span className="flex-1 truncate text-sm font-extrabold">{b.name}</span>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                  {b.models.length} models
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete brand "${b.name}" and all its models & prices?`))
                      run(() => deleteBrand(b.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </span>
              </button>

              {openBrand === b.id ? (
                <div className="space-y-5 p-5">
                  {b.models.map((m) => (
                    <div key={m.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold">
                          {m.name}{" "}
                          <span className="ml-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-700">
                            {m.appliance === "ac" ? "AC" : "Fridge"}
                          </span>
                        </p>
                        <button
                          onClick={() =>
                            confirm(`Delete model "${m.name}"?`) && run(() => deleteModel(m.id))
                          }
                          className="text-slate-300 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {m.capacities.map((c) => (
                          <CapacityRow
                            key={c.id}
                            label={c.label}
                            value={c.base_value}
                            onSave={(label, val) =>
                              run(() => saveCapacity({ id: c.id, model_id: m.id, label, base_value: val }))
                            }
                            onDelete={() => run(() => deleteCapacity(c.id))}
                          />
                        ))}
                        <AddCapacity onAdd={(label, val) => run(() => saveCapacity({ model_id: m.id, label, base_value: val }))} />
                      </div>
                    </div>
                  ))}

                  <AddModel brandId={b.id} onAdd={(name, appliance) => run(() => saveModel({ brand_id: b.id, name, appliance }))} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {pending ? (
        <p className="inline-flex items-center gap-2 text-xs font-bold text-brand-600">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing…
        </p>
      ) : null}
    </div>
  );
}

function MultiplierRow({
  label,
  value,
  onSave,
}: {
  label: string;
  value: number;
  onSave: (v: number) => void;
}) {
  const [val, setVal] = useState(String(value));
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <span className="text-xs text-slate-400">×</span>
      <input
        type="number"
        step="0.05"
        min={0.05}
        max={1.5}
        className="field !w-24 !px-3 !py-2 text-center"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button
        onClick={() => onSave(Number(val))}
        className="shrink-0 rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100"
      >
        Set
      </button>
    </div>
  );
}

function CapacityRow({
  label,
  value,
  onSave,
  onDelete,
}: {
  label: string;
  value: number;
  onSave: (label: string, v: number) => void;
  onDelete: () => void;
}) {
  const [l, setL] = useState(label);
  const [v, setV] = useState(String(value));
  return (
    <div className="flex items-center gap-2">
      <input
        className="field !w-28 !px-3 !py-2"
        value={l}
        onChange={(e) => setL(e.target.value)}
      />
      <div className="relative flex-1">
        <input
          type="number"
          className="field !pr-7 !py-2"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
          ₹
        </span>
      </div>
      <button
        onClick={() => onSave(l, Number(v))}
        className="shrink-0 rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100"
      >
        Save
      </button>
      <button onClick={onDelete} className="shrink-0 text-slate-300 hover:text-rose-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddCapacity({ onAdd }: { onAdd: (label: string, base: number) => void }) {
  const [label, setLabel] = useState("");
  const [base, setBase] = useState("");
  return (
    <div className="flex items-center gap-2 border-t border-dashed border-slate-200 pt-2.5">
      <input
        className="field !w-28 !px-3 !py-2"
        placeholder="e.g. 260 L"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <input
        type="number"
        className="field flex-1 !py-2"
        placeholder="Base value ₹"
        value={base}
        onChange={(e) => setBase(e.target.value)}
      />
      <button
        onClick={() => {
          if (!label.trim() || !Number(base)) return;
          onAdd(label.trim(), Number(base));
          setLabel("");
          setBase("");
        }}
        className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}

function AddModel({
  brandId,
  onAdd,
}: {
  brandId: string;
  onAdd: (name: string, appliance: "refrigerator" | "ac") => void;
}) {
  const [name, setName] = useState("");
  const [appliance, setAppliance] = useState<"refrigerator" | "ac">("refrigerator");
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-slate-200 pt-3">
      <select
        className="field !w-36 !px-3 !py-2"
        value={appliance}
        onChange={(e) => setAppliance(e.target.value as "refrigerator" | "ac")}
      >
        <option value="refrigerator">Refrigerator</option>
        <option value="ac">AC</option>
      </select>
      <input
        className="field min-w-[160px] flex-1 !py-2"
        placeholder="New model / series name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          if (!name.trim()) return;
          onAdd(name.trim(), appliance);
          setName("");
        }}
        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
      >
        <Plus className="mr-1 inline h-3.5 w-3.5" /> Model
      </button>
    </div>
  );
}

export function previewOffer(base: number, ageM: number, condM: number, uplift: number) {
  return formatINR(Math.round((base * ageM * condM * (1 + uplift)) / 10) * 10);
}
