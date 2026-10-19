"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { formatOrgDayLabel, formatOrgTimeRange } from "@/lib/timezone";
import { groupVolunteerSlots } from "@/lib/volunteerSlots";
import {
  TurnstileField,
  resolveTurnstileToken,
} from "@/components/molecules/TurnstileField";

export function VolunteerSignupForm() {
  const slotsQuery = trpc.volunteer.listOpenSlots.useQuery();
  const utils = trpc.useUtils();
  const signUp = trpc.volunteer.signUp.useMutation({
    onSuccess: async () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSlotId("");
      setTurnstileToken("");
      setFormError(null);
      await utils.volunteer.listOpenSlots.invalidate();
    },
    onError: (err) => {
      setFormError(err.message);
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [slotId, setSlotId] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (slotsQuery.isLoading) {
    return (
      <p className="text-[var(--kbk-text-muted)] text-lg">Loading open times…</p>
    );
  }

  if (slotsQuery.isError) {
    return (
      <p className="text-red-600 text-lg">
        We couldn&apos;t load volunteer times. Please try again later.
      </p>
    );
  }

  const slots = slotsQuery.data ?? [];

  if (slots.length === 0) {
    return (
      <div className="rounded-xl bg-white/90 px-6 py-8 ring-1 ring-[#025a9a]/10 text-center">
        <p className="text-lg sm:text-xl text-[var(--kbk-text)] font-medium">
          Things are full right now
        </p>
        <p className="mt-2 text-[var(--kbk-text-muted)] text-base sm:text-lg">
          There are no open volunteer times available. Please check back soon.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-white/90 px-6 py-8 ring-1 ring-[#025a9a]/10 text-center">
        <p className="text-lg sm:text-xl text-[var(--kbk-text)] font-medium">
          You&apos;re signed up — thank you!
        </p>
        <p className="mt-2 text-[var(--kbk-text-muted)] text-base sm:text-lg">
          We look forward to seeing you.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--kbk-primary)] text-white font-medium hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
        >
          Sign up for another time
        </button>
      </div>
    );
  }

  const slotGroups = groupVolunteerSlots(slots);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!slotId) {
      setFormError("Please pick a volunteer time");
      return;
    }

    const captcha = resolveTurnstileToken(turnstileToken);
    if ("error" in captcha) {
      setFormError(captcha.error);
      return;
    }

    signUp.mutate({
      slotId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      turnstileToken: captcha.token,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-lg font-semibold text-[var(--kbk-text)] mb-3">
          Pick a time
        </legend>
        <div className="space-y-6">
          {slotGroups.map((group) => (
            <section key={group.title}>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--kbk-primary)]">
                {group.title}
              </h3>
              <div className="mt-2 space-y-4">
                {group.days.map((day) => (
                  <div key={day.dateKey}>
                    <p className="text-sm font-medium text-[var(--kbk-text-muted)] mb-2">
                      {formatOrgDayLabel(day.slots[0].startsAt)}
                    </p>
                    <ul className="space-y-2" role="list">
                      {day.slots.map((slot) => (
                        <li key={slot.id}>
                          <label
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer ring-1 transition-colors ${
                              slotId === slot.id
                                ? "bg-[var(--kbk-primary)]/10 ring-[var(--kbk-primary)]"
                                : "bg-white/90 ring-[#025a9a]/10 hover:bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="slotId"
                              value={slot.id}
                              checked={slotId === slot.id}
                              onChange={() => setSlotId(slot.id)}
                              className="h-4 w-4 accent-[var(--kbk-primary)]"
                            />
                            <span className="text-[var(--kbk-text)] text-base sm:text-lg">
                              {formatOrgTimeRange(slot.startsAt, slot.endsAt)}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-[var(--kbk-text)] mb-1">
          Your info
        </legend>

        <div>
          <label
            htmlFor="volunteer-name"
            className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5"
          >
            Name
          </label>
          <input
            id="volunteer-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <label
            htmlFor="volunteer-email"
            className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5"
          >
            Email
          </label>
          <input
            id="volunteer-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <label
            htmlFor="volunteer-phone"
            className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5"
          >
            Phone
          </label>
          <input
            id="volunteer-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          />
        </div>
      </fieldset>

      <TurnstileField onTokenChange={setTurnstileToken} />

      {formError ? (
        <p className="text-red-600 text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={signUp.isPending}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--kbk-primary)] text-white font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
      >
        {signUp.isPending ? "Signing up…" : "Sign up to volunteer"}
      </button>
    </form>
  );
}
