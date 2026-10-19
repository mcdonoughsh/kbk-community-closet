"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { trpc } from "@/lib/trpc";
import {
  TurnstileField,
  resolveTurnstileToken,
} from "@/components/molecules/TurnstileField";

type EarlyAccessDay = {
  dateKey: string;
  /** e.g. "Friday, November 13" */
  label: string;
  earlyAccess: string;
};

const EITHER_DAY = "";

const inputClassName =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2";

export function EarlyAccessSignupForm({
  eventSlug,
  days,
}: {
  eventSlug: string;
  days: EarlyAccessDay[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  /** A day's dateKey, EITHER_DAY, or null when nothing is picked yet. */
  const [dayChoice, setDayChoice] = useState<string | null>(null);
  const [donationConfirmed, setDonationConfirmed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const signUp = trpc.earlyAccess.signUp.useMutation({
    onSuccess: () => {
      sendGAEvent("event", "sign_up", { method: "early_access", event_slug: eventSlug });
    },
    onError: (err) => setFormError(err.message),
  });

  if (signUp.isSuccess) {
    const chosenDay = days.find((day) => day.dateKey === signUp.variables.preferredDayKey);
    return (
      <div className="rounded-xl bg-white/90 px-6 py-8 text-center ring-1 ring-[var(--kbk-primary)]/10" role="status">
        <p className="text-lg font-medium text-[var(--kbk-text)] sm:text-xl">
          {signUp.data.alreadySignedUp
            ? "You’re already on the list, and we’ve updated your info!"
            : "You’re on the list!"}
        </p>
        <p className="mt-2 text-base text-[var(--kbk-text-muted)] sm:text-lg">
          {chosenDay
            ? `See you ${chosenDay.label}, ${chosenDay.earlyAccess}.`
            : `Early access runs ${days.map((day) => `${day.label}, ${day.earlyAccess}`).join(" and ")}.`}{" "}
          Just give your name at the check-in table. We can’t wait to see you!
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!donationConfirmed) {
      setFormError("Please confirm your clothing donation");
      return;
    }

    const captcha = resolveTurnstileToken(turnstileToken);
    if ("error" in captcha) {
      setFormError(captcha.error);
      return;
    }

    signUp.mutate({
      eventSlug,
      name: name.trim(),
      email: email.trim(),
      preferredDayKey: dayChoice || null,
      donationConfirmed: true,
      turnstileToken: captcha.token,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-semibold text-[var(--kbk-text)]">
          Your info
        </legend>
        <div>
          <label htmlFor="early-access-name" className="mb-1.5 block text-sm font-medium text-[var(--kbk-text)]">
            Name
          </label>
          <input
            id="early-access-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="early-access-email" className="mb-1.5 block text-sm font-medium text-[var(--kbk-text)]">
            Email
          </label>
          <input
            id="early-access-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-lg font-semibold text-[var(--kbk-text)]">
          Which day works best?{" "}
          <span className="text-sm font-normal text-[var(--kbk-text-muted)]">(optional)</span>
        </legend>
        <ul className="m-0 list-none space-y-2 p-0">
          {[
            ...days.map((day) => ({
              value: day.dateKey,
              label: day.label,
              detail: day.earlyAccess,
            })),
            { value: EITHER_DAY, label: "Either day works", detail: null },
          ].map((option) => {
            const isSelected = dayChoice === option.value;
            return (
              <li key={option.value || "either"}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 ring-1 transition-colors ${
                    isSelected
                      ? "bg-[var(--kbk-primary)]/10 ring-[var(--kbk-primary)]"
                      : "bg-white/90 ring-[var(--kbk-primary)]/10 hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredDay"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setDayChoice(option.value)}
                    className="h-4 w-4 accent-[var(--kbk-primary)]"
                  />
                  <span className="text-base text-[var(--kbk-text)] sm:text-lg">
                    {option.label}
                    {option.detail ? (
                      <span className="block text-sm tabular-nums text-[var(--kbk-text-muted)]">
                        {option.detail}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white/90 px-4 py-3 ring-1 ring-[var(--kbk-primary)]/10">
        <input
          type="checkbox"
          name="donationConfirmed"
          required
          checked={donationConfirmed}
          onChange={(e) => setDonationConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--kbk-primary)]"
        />
        <span className="text-base text-[var(--kbk-text)]">
          I’ve donated (or will donate) gently used kids’ clothes
        </span>
      </label>

      <TurnstileField onTokenChange={setTurnstileToken} />

      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={signUp.isPending}
        className="w-full touch-manipulation rounded-xl bg-[var(--kbk-primary)] px-8 py-3.5 font-semibold text-white transition-colors hover:bg-[var(--kbk-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {signUp.isPending ? "Saving your spot…" : "Get early access"}
      </button>
    </form>
  );
}
