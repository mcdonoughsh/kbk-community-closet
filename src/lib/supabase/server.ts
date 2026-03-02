import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client
 * Used in Server Components, Route Handlers, and tRPC context.
 * Reads/writes auth cookies via Next.js cookies() API.
 */
export async function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // Debug: log raw values (remove after fixing)
  if (process.env.NODE_ENV === "development") {
    console.log("[Supabase createClient] SUPABASE_URL:", supabaseUrl ? `"${supabaseUrl.slice(0, 40)}..."` : "undefined/empty");
    console.log("[Supabase createClient] SUPABASE_ANON_KEY:", supabaseAnonKey ? "present" : "undefined/empty");
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [
      !supabaseUrl && "SUPABASE_URL",
      !supabaseAnonKey && "SUPABASE_ANON_KEY",
    ].filter(Boolean);
    throw new Error(
      `Missing required env: ${missing.join(", ")}. Add them to .env — get values from Supabase Dashboard → Project Settings → API`
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies can't be set.
            // This is safe to ignore if middleware handles session refresh.
          }
        },
      },
    }
  );
}
