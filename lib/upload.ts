const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isDbConfigured() {
  return Boolean(url && key);
}

export async function getPublicUploadUrl(path: string) {
  if (!isDbConfigured()) return null;
  const { createBrowserClient } = await import("@supabase/ssr");
  const sb = createBrowserClient(url!, key!);
  const { data } = await sb.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadToBucket(
  file: File,
  folder: string
): Promise<string | null> {
  if (!isDbConfigured()) return null;
  const { createBrowserClient } = await import("@supabase/ssr");
  const sb = createBrowserClient(url!, key!);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from("uploads").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = await sb.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}
