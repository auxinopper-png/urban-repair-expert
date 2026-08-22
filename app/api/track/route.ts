import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BOOKING_FLOW = ["pending", "assigned", "on_the_way", "in_progress", "completed"];
const SELL_FLOW = ["requested", "scheduled", "picked", "purchased"];

interface TrackRow {
  kind: string;
  code: string;
  customer: string;
  detail: string;
  status: string;
  visit_date: string | null;
  slot: string | null;
  offer: number | null;
  created: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string };
    const q = (body.query || "").trim();
    if (!q) return NextResponse.json({ results: [] });

    const sb = await getServerSupabase();
    if (!sb) return NextResponse.json({ results: [], unconfigured: true });

    const { data, error } = await sb.rpc("track_search", { q });
    if (error) return NextResponse.json({ results: [] });

    const rows = (data || []) as TrackRow[];
    const results = rows.map((r) => ({
      type: r.kind === "repair" ? ("repair" as const) : ("sell" as const),
      code: r.code,
      title:
        r.kind === "repair"
          ? `${r.detail || "Appliance"} Repair`
          : `Sell ${r.detail || "Appliance"}`,
      detail: r.kind === "repair" ? r.customer : r.customer,
      date: r.kind === "repair" ? r.visit_date : (r.created || "").split("T")[0],
      slot: r.slot || "",
      status: r.status,
      flow: r.kind === "repair" ? BOOKING_FLOW : SELL_FLOW,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: "Lookup failed" }, { status: 500 });
  }
}
