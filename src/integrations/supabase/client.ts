import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client
const getEnv = (key: string) =>
  typeof process !== "undefined" ? process.env[key] : import.meta.env[key];

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or .env.local",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for protected operations)
export const getSupabaseServerClient = () => {
  const url = getEnv("VITE_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server configuration. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env or .env.local",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
