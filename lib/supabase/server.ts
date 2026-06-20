import { createClient } from "@supabase/supabase-js";
import type { Memory } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server credentials are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function listMemories() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as Memory[];
}
