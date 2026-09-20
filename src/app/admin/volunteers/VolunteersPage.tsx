"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { SignOutButton } from "../requests/SignOutButton";
import {
  formatOrgSlotRange,
  parseOrgDateTimeLocal,
  toOrgDateTimeLocalValue,
} from "@/lib/timezone";

type SlotFormState = {
  startsAtLocal: string;
  endsAtLocal: string;
  capacity: string;
};

const emptySlotForm = (): SlotFormState => ({
  startsAtLocal: "",
  endsAtLocal: "",
  capacity: "10",
});

export function VolunteersPage() {
  const meQuery = trpc.admin.me.useQuery();
  const [includePast, setIncludePast] = useState(false);
  const slotsQuery = trpc.volunteer.listSlots.useQuery({ includePast });
  const utils = trpc.useUtils();

  const [createForm, setCreateForm] = useState<SlotFormState>(emptySlotForm);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SlotFormState>(emptySlotForm);
  const [editError, setEditError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manualForms, setManualForms] = useState<
    Record<string, { name: string; email: string; phone: string; error: string | null }>
  >({});

  const invalidate = async () => {
    await utils.volunteer.listSlots.invalidate();
    await utils.volunteer.listOpenSlots.invalidate();
  };

  const createSlot = trpc.volunteer.createSlot.useMutation({
    onSuccess: async () => {
      setCreateForm(emptySlotForm());
      setCreateError(null);
      await invalidate();
    },
    onError: (err) => setCreateError(err.message),
  });

  const updateSlot = trpc.volunteer.updateSlot.useMutation({
    onSuccess: async () => {
      setEditingId(null);
      setEditError(null);
      await invalidate();
    },
    onError: (err) => setEditError(err.message),
  });

  const softDeleteSlot = trpc.volunteer.softDeleteSlot.useMutation({
    onSuccess: invalidate,
  });

  const addSignup = trpc.volunteer.addSignup.useMutation({
    onSuccess: async (_data, variables) => {
      setManualForms((prev) => ({
        ...prev,
        [variables.slotId]: { name: "", email: "", phone: "", error: null },
      }));
      await invalidate();
    },
    onError: (err, variables) => {
      setManualForms((prev) => ({
        ...prev,
        [variables.slotId]: {
          ...(prev[variables.slotId] ?? {
            name: "",
            email: "",
            phone: "",
            error: null,
          }),
          error: err.message,
        },
      }));
    },
  });

  const removeSignup = trpc.volunteer.removeSignup.useMutation({
    onSuccess: invalidate,
  });

  const isLoading = meQuery.isLoading || slotsQuery.isLoading;
  const isError = meQuery.isError || slotsQuery.isError;

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
  const slots = slotsQuery.data!;

  const parseSlotTimes = (form: SlotFormState) => {
    if (!form.startsAtLocal || !form.endsAtLocal) {
      throw new Error("Start and end times are required");
    }
    const capacity = Number.parseInt(form.capacity, 10);
    if (!Number.isFinite(capacity) || capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    const startsAt = parseOrgDateTimeLocal(form.startsAtLocal);
    const endsAt = parseOrgDateTimeLocal(form.endsAtLocal);
    if (endsAt <= startsAt) {
      throw new Error("End time must be after start time");
    }
    return { startsAt, endsAt, capacity };
  };

  const getManualForm = (slotId: string) =>
    manualForms[slotId] ?? { name: "", email: "", phone: "", error: null };

  return (
    <div className="min-h-screen bg-[var(--kbk-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Volunteers</h1>
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
            <SignOutButton />
          </div>
        </div>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Add volunteer time
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Times are entered in Kennebunk local time (Eastern).
          </p>
          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              setCreateError(null);
              try {
                const parsed = parseSlotTimes(createForm);
                createSlot.mutate(parsed);
              } catch (err) {
                setCreateError(
                  err instanceof Error ? err.message : "Invalid form"
                );
              }
            }}
          >
            <div>
              <label
                htmlFor="create-starts"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Starts
              </label>
              <input
                id="create-starts"
                type="datetime-local"
                required
                value={createForm.startsAtLocal}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    startsAtLocal: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="create-ends"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ends
              </label>
              <input
                id="create-ends"
                type="datetime-local"
                required
                value={createForm.endsAtLocal}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    endsAtLocal: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="create-capacity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cap
              </label>
              <input
                id="create-capacity"
                type="number"
                min={1}
                max={500}
                required
                value={createForm.capacity}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, capacity: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={createSlot.isPending}
              className="px-4 py-2 rounded-lg bg-[var(--kbk-primary)] text-white text-sm font-medium hover:bg-[var(--kbk-primary-hover)] disabled:opacity-70"
            >
              {createSlot.isPending ? "Adding…" : "Add time"}
            </button>
          </form>
          {createError ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {createError}
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Scheduled times
          </h2>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includePast}
              onChange={(e) => setIncludePast(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show past
          </label>
        </div>

        {slots.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {includePast
              ? "No volunteer times yet."
              : "No upcoming volunteer times. Add one above, or show past."}
          </p>
        ) : (
          <ul className="space-y-4">
            {slots.map((slot) => {
              const isExpanded = expandedId === slot.id;
              const isEditing = editingId === slot.id;
              const manual = getManualForm(slot.id);
              const isPast = new Date(slot.endsAt) < new Date();

              return (
                <li
                  key={slot.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                >
                  <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatOrgSlotRange(slot.startsAt, slot.endsAt)}
                        {isPast ? (
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            (past)
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {slot.signupCount} / {slot.capacity} signed up
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : slot.id)
                        }
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {isExpanded ? "Hide roster" : "View roster"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingId(null);
                            setEditError(null);
                          } else {
                            setEditingId(slot.id);
                            setEditForm({
                              startsAtLocal: toOrgDateTimeLocalValue(
                                slot.startsAt
                              ),
                              endsAtLocal: toOrgDateTimeLocalValue(slot.endsAt),
                              capacity: String(slot.capacity),
                            });
                            setEditError(null);
                          }
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              "Remove this volunteer time? Signups will no longer appear on the public page."
                            )
                          ) {
                            softDeleteSlot.mutate({ id: slot.id });
                          }
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <form
                      className="border-t border-gray-100 px-4 sm:px-5 py-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end bg-gray-50"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setEditError(null);
                        try {
                          const parsed = parseSlotTimes(editForm);
                          updateSlot.mutate({ id: slot.id, ...parsed });
                        } catch (err) {
                          setEditError(
                            err instanceof Error ? err.message : "Invalid form"
                          );
                        }
                      }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Starts
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={editForm.startsAtLocal}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              startsAtLocal: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ends
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={editForm.endsAtLocal}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              endsAtLocal: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cap
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          required
                          value={editForm.capacity}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              capacity: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updateSlot.isPending}
                        className="px-4 py-2 rounded-lg bg-[var(--kbk-primary)] text-white text-sm font-medium hover:bg-[var(--kbk-primary-hover)] disabled:opacity-70"
                      >
                        {updateSlot.isPending ? "Saving…" : "Save"}
                      </button>
                      {editError ? (
                        <p
                          className="sm:col-span-2 lg:col-span-4 text-sm text-red-600"
                          role="alert"
                        >
                          {editError}
                        </p>
                      ) : null}
                    </form>
                  ) : null}

                  {isExpanded ? (
                    <div className="border-t border-gray-100 px-4 sm:px-5 py-4 space-y-4">
                      {slot.signups.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No one signed up yet.
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {slot.signups.map((signup) => (
                            <li
                              key={signup.id}
                              className="py-3 flex flex-wrap items-start justify-between gap-2"
                            >
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">
                                  {signup.contact.name}
                                  {signup.source === "ADMIN" ? (
                                    <span className="ml-2 text-xs font-normal text-gray-500">
                                      (added by admin)
                                    </span>
                                  ) : null}
                                </p>
                                <p className="text-gray-500 mt-0.5">
                                  {signup.contact.email || "No email"}
                                  {" · "}
                                  {signup.contact.phone || "No phone"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Remove this signup?")) {
                                    removeSignup.mutate({ id: signup.id });
                                  }
                                }}
                                className="text-sm text-red-700 hover:underline"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {slot.signupCount < slot.capacity ? (
                        <form
                          className="pt-2 border-t border-gray-100 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!manual.name.trim()) return;
                            addSignup.mutate({
                              slotId: slot.id,
                              name: manual.name.trim(),
                              email: manual.email.trim() || undefined,
                              phone: manual.phone.trim() || undefined,
                            });
                          }}
                        >
                          <p className="sm:col-span-2 lg:col-span-4 text-sm font-medium text-gray-700">
                            Manually add someone
                          </p>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              required
                              value={manual.name}
                              onChange={(e) =>
                                setManualForms((prev) => ({
                                  ...prev,
                                  [slot.id]: {
                                    ...getManualForm(slot.id),
                                    name: e.target.value,
                                    error: null,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Email (optional)
                            </label>
                            <input
                              type="email"
                              value={manual.email}
                              onChange={(e) =>
                                setManualForms((prev) => ({
                                  ...prev,
                                  [slot.id]: {
                                    ...getManualForm(slot.id),
                                    email: e.target.value,
                                    error: null,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Phone (optional)
                            </label>
                            <input
                              type="tel"
                              value={manual.phone}
                              onChange={(e) =>
                                setManualForms((prev) => ({
                                  ...prev,
                                  [slot.id]: {
                                    ...getManualForm(slot.id),
                                    phone: e.target.value,
                                    error: null,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={addSignup.isPending}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-70"
                          >
                            Add
                          </button>
                          {manual.error ? (
                            <p
                              className="sm:col-span-2 lg:col-span-4 text-sm text-red-600"
                              role="alert"
                            >
                              {manual.error}
                            </p>
                          ) : null}
                        </form>
                      ) : (
                        <p className="text-sm text-gray-500">
                          This slot is at capacity.
                        </p>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
