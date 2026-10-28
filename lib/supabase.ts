import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-only Supabase client. Returns null when the env vars are not
// configured, so the app still works fully offline on localStorage alone.
// The anon key is publishable by design; row-level security (see
// supabase/schema.sql) is what keeps one user's progress private.
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  if (typeof window === "undefined") {
    client = null;
    return client;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    client = null;
    return client;
  }
  client = createClient(url, anonKey);
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
