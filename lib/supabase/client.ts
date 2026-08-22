import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isDbConfigured() {
  return Boolean(url && key);
}

let browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (!isDbConfigured()) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(url!, key!);
  }
  return browserClient;
}
