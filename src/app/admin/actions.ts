"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthResult = { error: string } | null;

/**
 * Server action: sign in with email/password.
 * All Supabase communication stays server-side — no anon key is sent to the browser.
 */
export async function signIn(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin/requests");
}

/**
 * Server action: sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
