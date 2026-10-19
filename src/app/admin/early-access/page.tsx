import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EarlyAccessPage } from "./EarlyAccessPage";

export const metadata: Metadata = {
  title: "KBK CC | Admin Early Access",
};

/**
 * Server component — checks for a valid Supabase session.
 * All data fetching happens client-side through the tRPC API.
 */
export default async function AdminEarlyAccessRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <EarlyAccessPage />;
}
