export interface RateRow {
  service: string;
  split: number;
  window?: number;
  note?: string;
}

export interface RateGroup {
  title: string;
  rows: RateRow[];
}

export const AC_RATE_CARD: RateGroup[] = [
  {
    title: "Service & Cleaning",
    rows: [
      { service: "Dry Service (filter + basic check)", split: 599, window: 499 },
      { service: "Deep Cleaning — Foam + Jet Wash", split: 899, window: 699 },
      { service: "Anti-Rust Coil Treatment", split: 449, window: 399, note: "chemical cost included" },
    ],
  },
  {
    title: "Gas & Cooling",
    rows: [
      { service: "Gas Pressure Check", split: 199, window: 199, note: "free with any service" },
      { service: "Gas Top-Up", split: 1499, window: 1299 },
      { service: "Full Gas Refill — R32 / R410A", split: 2399, note: "includes leak test" },
      { service: "Full Gas Refill — R22", split: 2999, note: "includes vacuum" },
    ],
  },
  {
    title: "Installation / Shifting",
    rows: [
      { service: "New Split AC Installation", split: 1800, note: "base rate · labour included" },
      { service: "Window AC Installation", split: 1449, note: "labour included" },
      { service: "Uninstallation — Split", split: 1049, window: 899 },
      { service: "Installation + Uninstallation Combo (Shifting)", split: 2499, note: "same-day shifting" },
    ],
  },
  {
    title: "Repairs & Parts",
    rows: [
      { service: "Diagnosis / Inspection Visit", split: 349, note: "adjusted in final bill if repair done" },
      { service: "PCB / Control Board Repair", split: 1499, note: "from price · part extra at MRP" },
      { service: "Fan Motor Replacement", split: 1199, note: "from price · part extra" },
      { service: "Capacitor Replacement", split: 649, note: "part + labour included" },
      { service: "Water Leakage Fix", split: 749, note: "drain line flush included" },
    ],
  },
];

export const AC_EXTRA_PARTS = [
  { item: "Copper Piping (per metre)", price: 950, note: "material + labour" },
  { item: "Outdoor Wall Stand (GI)", price: 449, note: "with fixing" },
  { item: "Drain Pipe (per metre)", price: 349, note: "material only" },
  { item: "Stabilizer Fitting", price: 599, note: "labour only" },
  { item: "High-Rise Rope Access", price: 499, note: "labour · floors above 4th" },
];
