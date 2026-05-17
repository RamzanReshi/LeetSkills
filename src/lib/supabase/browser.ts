"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { getSupabaseConfig } from "./config";

type BrowserClient = SupabaseClient<Database, "leetskill">;

let browserClient: BrowserClient | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  const { url, anonKey } = getSupabaseConfig();

  browserClient = createBrowserClient<Database, "leetskill">(url, anonKey, {
    db: {
      schema: "leetskill",
    },
  });

  return browserClient;
}
