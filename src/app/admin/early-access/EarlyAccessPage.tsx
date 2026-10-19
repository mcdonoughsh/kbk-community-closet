"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { toCsv } from "@/lib/csv";
import { formatOrgShortDay } from "@/lib/eventSchedule";
import { formatOrgDateTime } from "@/lib/timezone";
import { EARLY_ACCESS_EVENTS } from "@/data/earlyAccess";
import { SignOutButton } from "../requests/SignOutButton";

function preferredDayLabel(dateKey: string | null): string {
  return dateKey ? formatOrgShortDay(dateKey) : "Either day";
}

function downloadCsv(filename: string, csv: string) {
  // BOM so Excel reads the file as UTF-8 (accents, curly apostrophes).
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function EarlyAccessPage() {
  const [eventSlug, setEventSlug] = useState(EARLY_ACCESS_EVENTS[0]?.slug ?? "");
  const [search, setSearch] = useState("");
  const meQuery = trpc.admin.me.useQuery();
  const signupsQuery = trpc.earlyAccess.listSignups.useQuery(
    { eventSlug },
    { enabled: Boolean(eventSlug) }
  );
  const utils = trpc.useUtils();
  const removeSignup = trpc.earlyAccess.removeSignup.useMutation({
    onSuccess: () => utils.earlyAccess.listSignups.invalidate({ eventSlug }),
  });

  if (meQuery.isLoading || signupsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[var(--kbk-background)] flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (meQuery.isError || signupsQuery.isError) {
    return (
      <div className="min-h-screen bg-[var(--kbk-background)] flex items-center justify-center">
        <p className="text-red-600">
          Failed to load data. Please refresh or sign in again.
        </p>
      </div>
    );
  }

  const me = meQuery.data!;
  const signups = signupsQuery.data ?? [];
  const event = EARLY_ACCESS_EVENTS.find((e) => e.slug === eventSlug);
  const isSuperAdmin = me.role === "SUPER_ADMIN";

  const query = search.trim().toLowerCase();
  const visibleSignups = query
    ? signups.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          (s.email ?? "").toLowerCase().includes(query)
      )
    : signups;

  const dayCounts = [
    ...(event?.hours ?? []).map((day) => ({
      label: formatOrgShortDay(day.dateKey),
      count: signups.filter((s) => s.preferredDayKey === day.dateKey).length,
    })),
    {
      label: "Either day",
      count: signups.filter((s) => s.preferredDayKey === null).length,
    },
  ];

  const handleDownload = () => {
    const csv = toCsv([
      ["Name", "Email", "Preferred day", "Signed up"],
      ...signups.map((s) => [
        s.name,
        s.email ?? "",
        preferredDayLabel(s.preferredDayKey),
        formatOrgDateTime(s.createdAt),
      ]),
    ]);
    downloadCsv(`early-access-${eventSlug}.csv`, csv);
  };

  return (
    <div className="min-h-screen bg-[var(--kbk-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Early access</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as {me.displayName} (
              {me.role.replace("_", " ").toLowerCase()})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/requests"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Requests
            </Link>
            <Link
              href="/admin/volunteers"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Volunteers
            </Link>
            <SignOutButton />
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="early-access-event" className="block text-sm font-medium text-gray-700 mb-1">
                Event
              </label>
              <select
                id="early-access-event"
                value={eventSlug}
                onChange={(e) => {
                  setEventSlug(e.target.value);
                  setSearch("");
                }}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                {EARLY_ACCESS_EVENTS.map((e) => (
                  <option key={e.slug} value={e.slug}>
                    {e.title} ({e.slug})
                  </option>
                ))}
              </select>
            </div>
            <div className="grow min-w-[12rem]">
              <label htmlFor="early-access-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search name or email
              </label>
              <input
                id="early-access-search"
                type="search"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={signups.length === 0}
              className="px-4 py-2 text-sm rounded-lg bg-[var(--kbk-primary)] text-white font-medium hover:bg-[var(--kbk-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download CSV
            </button>
          </div>
          {event ? (
            <p className="mt-4 text-sm text-gray-500">
              Public form: <code className="text-gray-700">/early-access/{event.slug}</code>
            </p>
          ) : null}
          <p className="mt-2 text-sm text-gray-700 tabular-nums">
            {signups.length} signed up
            {dayCounts.map(({ label, count }) => ` · ${label}: ${count}`).join("")}
          </p>
        </section>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Preferred day</th>
                <th scope="col" className="px-4 py-3 font-medium">Signed up</th>
                {isSuperAdmin ? (
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleSignups.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="px-4 py-6 text-center text-gray-500">
                    {signups.length === 0 ? "No signups yet." : "No matches."}
                  </td>
                </tr>
              ) : (
                visibleSignups.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-700">{s.email}</td>
                    <td className="px-4 py-3 text-gray-700">{preferredDayLabel(s.preferredDayKey)}</td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">{formatOrgDateTime(s.createdAt)}</td>
                    {isSuperAdmin ? (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={removeSignup.isPending}
                          onClick={() => {
                            if (window.confirm(`Remove ${s.name} from the early access list?`)) {
                              removeSignup.mutate({ id: s.id });
                            }
                          }}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
