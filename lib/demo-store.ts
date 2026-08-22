import type { Booking, SellRequest } from "@/lib/services-data";
import { DEMO_BOOKINGS_SEED, DEMO_SELLS_SEED, DEMO_TECHS } from "./demo-data";

export interface DemoTech {
  id: string;
  name: string | null;
  mobile: string | null;
  active: boolean;
}

export interface DemoState {
  bookings: Booking[];
  sells: SellRequest[];
  techs: DemoTech[];
}

const g = globalThis as unknown as { __ureDemoState?: DemoState };

export function getDemoStore(): DemoState {
  if (!g.__ureDemoState) {
    g.__ureDemoState = {
      bookings: structuredClone(DEMO_BOOKINGS_SEED),
      sells: structuredClone(DEMO_SELLS_SEED),
      techs: structuredClone(DEMO_TECHS),
    };
  }
  return g.__ureDemoState;
}
