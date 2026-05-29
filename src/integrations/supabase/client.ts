import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client
const getEnv = (key: string) => {
  const processValue = typeof process !== "undefined" ? process.env?.[key] : undefined;
  return processValue || import.meta.env[key];
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or .env.local",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client. Uses service role when available, otherwise falls back to
// the anon key so public reads still work in production.
export const getSupabaseServerClient = () => {
  const url = getEnv("VITE_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = getEnv("VITE_SUPABASE_ANON_KEY");
  const key = serviceRoleKey || anonKey;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase server configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env, .env.local, or Vercel environment variables.",
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
