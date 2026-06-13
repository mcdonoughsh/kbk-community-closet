"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { trpc } from "@/lib/trpc";
import type { RequestStatus, Role, ItemCategory } from "@prisma/client";
import {
  getRequestStatusesSelectableInAdmin,
  REQUEST_STATUS_LABEL,
} from "@/lib/request-status";

// ─── Types ──────────────────────────────────────────────

type RequestWithRelations = {
  id: string;
  status: RequestStatus;
  assignee: string | null;
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
    quantity: number;
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
  | "contact"
  | "items"
  | "status"
  | "date";

type SortDirection = "asc" | "desc";

// ─── Helpers ────────────────────────────────────────────

const statusColors: Record<RequestStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-yellow-100 text-yellow-800",
  FULFILLED: "bg-green-100 text-green-800",
  CONTACTED: "bg-purple-100 text-purple-800",
  UNCLAIMED: "bg-orange-100 text-orange-800",
  REDISTRIBUTED: "bg-teal-100 text-teal-800",
};

/** Size labels in Items requested — primary blue, no chip chrome */
const SIZE_TEXT_CLASS = "font-medium text-[var(--kbk-primary,#036bb6)]";

/** Middle dot between size and gender (keys + display); U+00B7 */
const SIZE_GENDER_SEP = " · ";

/** Boy → brand orange, Girl / Girls → brand red (curated bags + clothing) */
function genderAccentClass(gender: string): string {
  const n = gender.trim().toLowerCase();
  if (n === "boy") return "text-[var(--kbk-cream)] font-medium";
  if (n === "girl" || n === "girls") return "text-[var(--kbk-girl)] font-medium";
  return "text-gray-700";
}

function getClothingGrouped(
  clothing: RequestWithRelations["items"]
): Record<string, { types: string[]; firstId: string }> {
  return clothing.reduce(
    (acc, item) => {
      const key = `${item.size || "?"}${SIZE_GENDER_SEP}${item.gender || "?"}`;
      if (!acc[key]) acc[key] = { types: [], firstId: item.id };
      acc[key].types.push(item.itemType.name);
      return acc;
    },
    {} as Record<string, { types: string[]; firstId: string }>
  );
}

function parseClothingGroupKey(key: string): { size: string; gender: string } {
  const i = key.indexOf(SIZE_GENDER_SEP);
  if (i === -1) return { size: key, gender: "?" };
  return {
    size: key.slice(0, i),
    gender: key.slice(i + SIZE_GENDER_SEP.length),
  };
}

function StatusSelectCell({
  requestId,
  status,
  updateStatus,
}: {
  requestId: string;
  status: RequestStatus;
  updateStatus: ReturnType<typeof trpc.request.updateStatus.useMutation>;
}) {
  const [localStatus, setLocalStatus] = useState(status);

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const selectable = useMemo(() => getRequestStatusesSelectableInAdmin(), []);
  const options = useMemo(() => {
    if (selectable.includes(status)) {
      return selectable;
    }
    return [status, ...selectable];
  }, [selectable, status]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as RequestStatus;
    if (next === localStatus) return;
    setLocalStatus(next);
    updateStatus.mutate(
      { requestId, status: next },
      {
        onError: () => {
          setLocalStatus(status);
        },
      }
    );
  };

  const rowPending =
    updateStatus.isPending &&
    updateStatus.variables?.requestId === requestId;

  const colorClass =
    statusColors[localStatus] ?? "bg-gray-100 text-gray-800";

  return (
    <select
      value={localStatus}
      onChange={handleChange}
      disabled={rowPending}
      aria-label="Request status"
      className={`max-w-[11rem] rounded-full border-0 px-2 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary,#036bb6)] focus:ring-offset-1 disabled:opacity-50 ${colorClass}`}
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {REQUEST_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

/** Middle dot (~20px); parent row should use flex items-center for alignment */
function DotSeparator() {
  return (
    <span
      className="shrink-0 select-none text-[20px] leading-none text-gray-400"
      aria-hidden
    >
      ·
    </span>
  );
}

const ITEMS_SECTION_HEADING =
  "text-xs font-bold uppercase tracking-wide text-[var(--kbk-primary,#036bb6)]";

function ItemsSectionHeading({ children }: { children: ReactNode }) {
  return <p className={`${ITEMS_SECTION_HEADING} mb-1`}>{children}</p>;
}

function gearItemsWithNames(
  gear: RequestWithRelations["items"]
): RequestWithRelations["items"] {
  return gear.filter(
    (g) => (g.itemType.name ?? "").trim().length > 0
  );
}

/** Items column: same data as formatItems() */
function ItemsRequestedDisplay({
  items,
}: {
  items: RequestWithRelations["items"];
}) {
  const curated = items.filter((i) => i.itemType.category === "CURATED_BAG");
  const clothing = items.filter((i) => i.itemType.category === "CLOTHING");
  const gear = items.filter((i) => i.itemType.category === "GEAR");
  const gearDisplay = gearItemsWithNames(gear);

  const hasCurated = curated.length > 0;
  const hasClothing = clothing.length > 0;
  const hasGear = gearDisplay.length > 0;

  if (!hasCurated && !hasClothing && !hasGear) {
    return <span className="text-gray-300">—</span>;
  }

  const showCuratedQtyEach = curated.length > 1;
  const clothingGrouped = hasClothing ? getClothingGrouped(clothing) : {};

  return (
    <div className="flex flex-col gap-4">
      {hasCurated && (
        <div>
          <ItemsSectionHeading>Curated bags</ItemsSectionHeading>
          <div className="flex flex-col gap-0">
            {curated.map((c) => {
              const qty =
                c.quantity > 1 || showCuratedQtyEach ? ` ×${c.quantity}` : "";
              return (
                <p
                  key={c.id}
                  className="flex flex-wrap items-center gap-x-1.5 text-sm leading-snug text-gray-700"
                >
                  <span className={SIZE_TEXT_CLASS}>{c.size || "?"}</span>
                  {c.gender ? (
                    <>
                      <DotSeparator />
                      <span className={genderAccentClass(c.gender)}>
                        {c.gender}
                      </span>
                    </>
                  ) : null}
                  <span>{qty}</span>
                </p>
              );
            })}
          </div>
        </div>
      )}

      {hasClothing && (
        <div>
          <ItemsSectionHeading>Clothing</ItemsSectionHeading>
          <div className="flex flex-col gap-0">
            {Object.entries(clothingGrouped).map(([key, { types, firstId }]) => {
              const { size, gender } = parseClothingGroupKey(key);
              return (
                <p
                  key={firstId}
                  className="flex flex-wrap items-center gap-x-1.5 text-sm leading-snug text-gray-700"
                >
                  <span className={SIZE_TEXT_CLASS}>{size}</span>
                  <DotSeparator />
                  <span className={genderAccentClass(gender)}>{gender}</span>
                  <DotSeparator />
                  <span>{types.join(", ")}</span>
                </p>
              );
            })}
          </div>
        </div>
      )}

      {hasGear && (
        <div>
          <ItemsSectionHeading>Gear</ItemsSectionHeading>
          <p className="text-sm leading-snug text-gray-700">
            {gearDisplay.map((g) => g.itemType.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

/** Format items into a readable summary (matches ItemsRequestedDisplay sections) */
function formatItems(items: RequestWithRelations["items"]): string {
  const curated = items.filter((i) => i.itemType.category === "CURATED_BAG");
  const clothing = items.filter((i) => i.itemType.category === "CLOTHING");
  const gear = gearItemsWithNames(
    items.filter((i) => i.itemType.category === "GEAR")
  );
  const sections: string[] = [];

  if (curated.length > 0) {
    const showQtyOnEachLine = curated.length > 1;
    const lines: string[] = [];
    for (const c of curated) {
      const size = c.size || "?";
      const genderPart = c.gender ? `${SIZE_GENDER_SEP}${c.gender}` : "";
      const qty =
        c.quantity > 1 || showQtyOnEachLine ? ` ×${c.quantity}` : "";
      lines.push(`${size}${genderPart}${qty}`);
    }
    sections.push(`Curated bags\n${lines.join("\n")}`);
  }

  if (clothing.length > 0) {
    const grouped = getClothingGrouped(clothing);
    const lines: string[] = [];
    for (const [sizeGender, { types }] of Object.entries(grouped)) {
      lines.push(
        `${sizeGender}${SIZE_GENDER_SEP}${types.join(", ")}`
      );
    }
    sections.push(`Clothing\n${lines.join("\n")}`);
  }

  if (gear.length > 0) {
    sections.push(`Gear\n${gear.map((g) => g.itemType.name).join(", ")}`);
  }

  return sections.join("\n\n") || "—";
}

/** Get sortable value for a given field */
function getSortValue(req: RequestWithRelations, field: SortField): string {
  switch (field) {
    case "name":
      return req.contact.name.toLowerCase();
    case "contact": {
      const phone = req.contact.phone;
      const email = (req.contact.email || "").toLowerCase();
      return `${phone} ${email}`;
    }
    case "items":
      return formatItems(req.items).toLowerCase();
    case "status":
      return req.status;
    case "date":
      return String(req.createdAt);
  }
}

// ─── Sort indicator ─────────────────────────────────────

function AssigneeCell({
  requestId,
  assignee,
}: {
  requestId: string;
  assignee: string | null;
}) {
  const utils = trpc.useUtils();
  const serverValue = assignee ?? "";
  const [value, setValue] = useState(serverValue);
  const lastCommitted = useRef(serverValue.trim());

  useEffect(() => {
    const next = assignee ?? "";
    setValue(next);
    lastCommitted.current = next.trim();
  }, [assignee]);

  const updateAssignee = trpc.request.updateAssignee.useMutation({
    onSuccess: () => void utils.request.list.invalidate(),
  });

  const commit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed === lastCommitted.current) return;
    updateAssignee.mutate(
      { requestId, assignee: trimmed === "" ? null : trimmed },
      {
        onSuccess: () => {
          lastCommitted.current = trimmed;
        },
        onError: () => {
          setValue(serverValue);
          lastCommitted.current = serverValue.trim();
        },
      }
    );
  }, [requestId, serverValue, updateAssignee, value]);

  return (
    <input
      type="text"
      maxLength={100}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      disabled={updateAssignee.isPending}
      placeholder="—"
      aria-label="Assignee"
      className="w-full min-w-[8rem] max-w-[14rem] rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--kbk-primary,#036bb6)] focus:outline-none focus:ring-1 focus:ring-[var(--kbk-primary,#036bb6)] disabled:opacity-50"
    />
  );
}

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
    { label: "Contact", field: "contact" },
    { label: "Assignee", field: null, className: "min-w-[9rem]" },
    {
      label: "Items Requested",
      field: "items",
      className: "min-w-[22rem] w-[38%]",
    },
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
                <td className="px-4 py-3 align-middle font-medium text-gray-900 whitespace-nowrap">
                  {req.contact.name || "—"}
                </td>

                {/* Contact: phone + email */}
                <td className="px-4 py-3 align-middle text-gray-600">
                  <div className="flex flex-col gap-1 min-w-0 max-w-[16rem]">
                    <a
                      href={`tel:${req.contact.phone}`}
                      className="hover:underline whitespace-nowrap"
                    >
                      {req.contact.phone}
                    </a>
                    {req.contact.email ? (
                      <a
                        href={`mailto:${req.contact.email}`}
                        className="hover:underline break-all text-[13px] leading-snug"
                      >
                        {req.contact.email}
                      </a>
                    ) : (
                      <span className="text-gray-300 text-[13px]">—</span>
                    )}
                  </div>
                </td>

                {/* Assignee */}
                <td className="px-4 py-3 align-middle">
                  <AssigneeCell requestId={req.id} assignee={req.assignee} />
                </td>

                {/* Items */}
                <td className="px-4 py-3 align-middle text-gray-600 min-w-0">
                  <div title={formatItems(req.items)}>
                    <ItemsRequestedDisplay items={req.items} />
                  </div>
                  {req.additionalInfo && (
                    <p
                      className="text-xs text-gray-400 mt-1 line-clamp-2"
                      title={req.additionalInfo}
                    >
                      Note: {req.additionalInfo}
                    </p>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3 align-middle">
                  <StatusSelectCell
                    requestId={req.id}
                    status={req.status}
                    updateStatus={updateStatus}
                  />
                </td>

                {/* Date */}
                <td className="px-4 py-3 align-middle text-gray-500 whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex gap-2">
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
