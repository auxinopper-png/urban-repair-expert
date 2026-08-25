export type ApplianceId = "ac" | "refrigerator" | "washing_machine" | "geyser";

export interface ServiceDef {
  id: ApplianceId;
  label: string;
  short: string;
  problems: string[];
}

export const SERVICES: ServiceDef[] = [
  {
    id: "ac",
    label: "Air Conditioner Repair",
    short: "AC",
    problems: ["Repair", "General Service", "Gas Refill", "Installation", "Uninstallation", "Deep Cleaning", "Not Cooling", "Water Leakage", "Noise / Vibration", "PCB / Electrical"],
  },
  {
    id: "refrigerator",
    label: "Refrigerator Repair",
    short: "Fridge",
    problems: ["Not Cooling", "Freezer Over-Freezing", "Water Leakage", "Excessive Noise", "Compressor Issue", "Door / Gasket Issue", "Thermostat Issue", "Deep Cleaning / Service"],
  },
  {
    id: "washing_machine",
    label: "Washing Machine Repair",
    short: "Washing Machine",
    problems: ["Not Spinning", "Drum Not Rotating", "Water Not Filling", "Water Leakage", "Loud Noise", "Vibrating / Moving", "Power Issue", "Deep Cleaning / Service"],
  },
  {
    id: "geyser",
    label: "Geyser Repair",
    short: "Geyser",
    problems: ["No Hot Water", "Water Leakage", "Slow Heating", "MCB Tripping", "Strange Noise", "Pilot / Ignition Issue", "Rust / Foul Smell", "Installation"],
  },
];

export const BRANDS_BY_APPLIANCE: Record<ApplianceId, string[]> = {
  ac: ["Voltas", "Daikin", "LG", "Blue Star", "Samsung", "Hitachi", "Panasonic", "Lloyd", "Carrier", "O'General", "Godrej", "Haier", "Midea", "TCL", "Onida", "Other"],
  refrigerator: ["LG", "Samsung", "Whirlpool", "Godrej", "Haier", "Bosch", "Hitachi", "Panasonic", "Electrolux", "Videocon", "Kelvinator", "Hisense", "Onida", "Other"],
  washing_machine: ["LG", "Samsung", "Whirlpool", "IFB", "Bosch", "Haier", "Godrej", "Panasonic", "Midea", "Siemens", "Onida", "Videocon", "Intex", "Other"],
  geyser: ["AO Smith", "Bajaj", "V-Guard", "Racold", "Havells", "Crompton", "Venus", "Usha", "Ferroli", "Kenstar", "Other"],
};

export const BOOKING_STATUSES = [
  "pending",
  "assigned",
  "on_the_way",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const SELL_STATUSES = [
  "requested",
  "scheduled",
  "picked",
  "purchased",
  "cancelled",
] as const;
export type SellStatus = (typeof SELL_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  on_the_way: "On the Way",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  requested: "Requested",
  scheduled: "Pickup Scheduled",
  picked: "Picked Up",
  purchased: "Purchased",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-800",
  on_the_way: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
  requested: "bg-amber-100 text-amber-800",
  scheduled: "bg-blue-100 text-blue-800",
  picked: "bg-indigo-100 text-indigo-800",
  purchased: "bg-emerald-100 text-emerald-800",
};

export interface Booking {
  id: string;
  booking_code: string;
  created_at: string;
  customer_name: string;
  mobile: string;
  appliance: string;
  brand: string;
  model: string | null;
  problems: string[] | null;
  problem_note: string | null;
  preferred_date: string;
  preferred_slot: string;
  address: string;
  lat: number | null;
  lng: number | null;
  photo_url: string | null;
  status: BookingStatus;
  technician_id: string | null;
  admin_note: string | null;
}

export interface SellPhoto {
  type: string;
  url: string;
}

export interface SellRequest {
  id: string;
  request_code: string;
  created_at: string;
  customer_name: string;
  mobile: string;
  appliance: string;
  brand_name: string;
  model_name: string;
  capacity_label: string;
  age_label: string;
  condition_label: string;
  estimated_market: number;
  estimated_offer: number;
  other_offer: number | null;
  photos: SellPhoto[] | null;
  video_url: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  status: SellStatus;
  pickup_at: string | null;
  technician_id: string | null;
  admin_note: string | null;
}

export interface Profile {
  id: string;
  role: "customer" | "technician" | "admin";
  name: string | null;
  mobile: string | null;
  active: boolean;
}
