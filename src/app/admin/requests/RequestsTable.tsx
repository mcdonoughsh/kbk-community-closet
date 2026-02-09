"use client";

import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import type { RequestStatus, Role, ItemCategory } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────

type RequestWithRelations = {
  id: string;
  status: RequestStatus;
  additionalInfo: string | null;
  createdAt: string | Date;
  contact: {
    name: string;
    phone: string;
    email: string | null;
  };
  items: {
    id: string;
    size: string | null;
    gender: string | null;
    itemType: {
      name: string;
      category: ItemCategory;
    };
  }[];
  assignedTo: {
    contact: {
      name: string;
    } | null;
  } | null;
};

interface RequestsTableProps {
  requests: RequestWithRelations[];
  userRole: Role;
}

// ─── Sort types ─────────────────────────────────────────

type SortField =
  | "name"
  | "phone"
  | "email"
  | "sizes"
  | "items"
  | "status"
  | "date";

type SortDirection = "asc" | "desc";

// ─── Helpers ────────────────────────────────────────────

const statusColors: Record<RequestStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-yellow-100 text-yellow-800",
  FULFILLED: "bg-green-100 text-green-800",
};

/** Extract unique sizes from a request's items, sorted */
function getSizes(items: RequestWithRelations["items"]): string {
  const sizes = [
    ...new Set(
      items.filter((i) => i.size).map((i) => i.size as string)
    ),
  ];
  return sizes.join(", ") || "—";
}

/** Format items into a readable summary */
function formatItems(items: RequestWithRelations["items"]): string {
  const clothing = items.filter((i) => i.itemType.category === "CLOTHING");
  const gear = items.filter((i) => i.itemType.category === "GEAR");
  const parts: string[] = [];

  if (clothing.length > 0) {
    const grouped = clothing.reduce(
      (acc, item) => {
        const key = `${item.size || "?"} / ${item.gender || "?"}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item.itemType.name);
        return acc;
      },
      {} as Record<string, string[]>
    );

    for (const [sizeGender, types] of Object.entries(grouped)) {
      parts.push(`${sizeGender}: ${types.join(", ")}`);
    }
  }

  if (gear.length > 0) {
    parts.push(`Gear: ${gear.map((g) => g.itemType.name).join(", ")}`);
  }

  return parts.join(" · ") || "—";
}

/** Get sortable value for a given field */
function getSortValue(req: RequestWithRelations, field: SortField): string {
  switch (field) {
    case "name":
      return req.contact.name.toLowerCase();
    case "phone":
      return req.contact.phone;
    case "email":
      return (req.contact.email || "").toLowerCase();
    case "sizes":
      return getSizes(req.items).toLowerCase();
    case "items":
      return formatItems(req.items).toLowerCase();
    case "status":
      return req.status;
    case "date":
      return String(req.createdAt);
  }
}

// ─── Sort indicator ─────────────────────────────────────

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  return (
    <span className="inline-flex flex-col ml-1 -space-y-1">
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        className={
          active && direction === "asc" ? "text-gray-900" : "text-gray-300"
        }
      >
        <path d="M4 0L8 6H0L4 0Z" fill="currentColor" />
      </svg>
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        className={
          active && direction === "desc" ? "text-gray-900" : "text-gray-300"
        }
      >
        <path d="M4 6L0 0H8L4 6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

// ─── Component ──────────────────────────────────────────

export function RequestsTable({ requests, userRole }: RequestsTableProps) {
  const utils = trpc.useUtils();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // ─── tRPC mutations ─────────────────────────────────────

  const updateStatus = trpc.request.updateStatus.useMutation({
    onSuccess: () => utils.request.list.invalidate(),
  });

  const deleteRequest = trpc.admin.deleteRequest.useMutation({
    onSuccess: () => utils.request.list.invalidate(),
  });

  // ─── Sort logic ─────────────────────────────────────────

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const sorted = useMemo(() => {
    const copy = [...requests];
    copy.sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [requests, sortField, sortDirection]);

  // ─── Handlers ───────────────────────────────────────────

  const handleStatusChange = (
    requestId: string,
    newStatus: RequestStatus
  ) => {
    updateStatus.mutate({ requestId, status: newStatus });
  };

  const handleDelete = (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    deleteRequest.mutate({ requestId });
  };

  // ─── Column definition ──────────────────────────────────

  const columns: {
    label: string;
    field: SortField | null;
    className?: string;
  }[] = [
    { label: "Name", field: "name" },
    { label: "Phone", field: "phone" },
    { label: "Email", field: "email" },
    { label: "Sizes", field: "sizes" },
    { label: "Items Requested", field: "items", className: "min-w-[200px]" },
    { label: "Status", field: "status" },
    { label: "Date", field: "date" },
    { label: "Actions", field: null },
  ];

  // ─── Empty state ────────────────────────────────────────

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No requests yet.</div>
    );
  }

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-3 font-medium whitespace-nowrap ${col.field ? "cursor-pointer select-none hover:text-gray-900 transition-colors" : ""} ${col.className ?? ""}`}
                  onClick={
                    col.field ? () => handleSort(col.field!) : undefined
                  }
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    {col.field && (
                      <SortIcon
                        active={sortField === col.field}
                        direction={sortDirection}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                {/* Name */}
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {req.contact.name || "—"}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  <a
                    href={`tel:${req.contact.phone}`}
                    className="hover:underline"
                  >
                    {req.contact.phone}
                  </a>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {req.contact.email ? (
                    <a
                      href={`mailto:${req.contact.email}`}
                      className="hover:underline"
                    >
                      {req.contact.email}
                    </a>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                {/* Sizes */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {getSizes(req.items)}
                </td>

                {/* Items */}
                <td className="px-4 py-3 text-gray-600 max-w-xs">
                  <span title={formatItems(req.items)}>
                    {formatItems(req.items)}
                  </span>
                  {req.additionalInfo && (
                    <p
                      className="text-xs text-gray-400 mt-0.5 truncate max-w-[250px]"
                      title={req.additionalInfo}
                    >
                      Note: {req.additionalInfo}
                    </p>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[req.status]}`}
                  >
                    {req.status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {req.status !== "FULFILLED" && (
                      <button
                        onClick={() =>
                          handleStatusChange(req.id, "FULFILLED")
                        }
                        disabled={updateStatus.isPending}
                        className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        Fulfill
                      </button>
                    )}
                    {userRole === "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleDelete(req.id)}
                        disabled={deleteRequest.isPending}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {requests.length} request{requests.length !== 1 ? "s" : ""} total
      </div>
    </div>
  );
}
