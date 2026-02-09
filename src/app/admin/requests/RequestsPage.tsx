"use client";

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Requests</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as {me.displayName} (
              {me.role.replace("_", " ").toLowerCase()})
            </p>
          </div>
          <SignOutButton />
        </div>

        {/* Table */}
        <RequestsTable requests={requests} userRole={me.role} />
      </div>
    </div>
  );
}
