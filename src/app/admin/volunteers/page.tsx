import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VolunteersPage } from "./VolunteersPage";

export const metadata: Metadata = {
  title: "KBK CC | Admin Volunteers",
};

/**
 * Server component — checks for a valid Supabase session.
 * All data fetching happens client-side through the tRPC API.
 */
export default async function AdminVolunteersRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <VolunteersPage />;
}
