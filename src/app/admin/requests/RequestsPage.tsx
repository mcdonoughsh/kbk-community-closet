"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { RequestsTable } from "./RequestsTable";
import { SignOutButton } from "./SignOutButton";

/**
 * Client component that owns all data fetching for the admin requests view.
 * Profile + requests are both loaded through the tRPC API.
 */
export function RequestsPage() {
  const meQuery = trpc.admin.me.useQuery();
  const requestsQuery = trpc.request.list.useQuery();

  const isLoading = meQuery.isLoading || requestsQuery.isLoading;
  const isError = meQuery.isError || requestsQuery.isError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--kbk-background)] flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--kbk-background)] flex items-center justify-center">
        <p className="text-red-600">
          Failed to load data. Please refresh or sign in again.
        </p>
      </div>
    );
  }

  const me = meQuery.data!;
  const requests = requestsQuery.data!;

  return (
    <div className="min-h-screen bg-[var(--kbk-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Requests</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as {me.displayName} (
              {me.role.replace("_", " ").toLowerCase()})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/volunteers"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Volunteers
            </Link>
            <SignOutButton />
          </div>
        </div>

        {/* Table */}
        <RequestsTable requests={requests} userRole={me.role} />
      </div>
    </div>
  );
}
