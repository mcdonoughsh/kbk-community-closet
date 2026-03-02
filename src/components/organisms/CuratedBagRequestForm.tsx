"use client";

import { useState, useCallback, useEffect } from "react";

const SIZES = [
  "Newborn",
  "0–3 months",
  "3–6 months",
  "6–9 months",
  "9–12 months",
  "12–18 months",
  "18–24 months",
  "2T",
  "3T",
  "4T and up",
] as const;

type FormState = {
  size: string;
  numberOfBags: number;
  name: string;
  phone: string;
  email: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  size: "",
  numberOfBags: 1,
  name: "",
  phone: "",
  email: "",
};

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!state.size.trim()) errors.size = "Select a size.";
  if (state.numberOfBags < 1 || state.numberOfBags > 10) {
    errors.numberOfBags = "Enter 1–10 bags.";
  }
  if (!state.name.trim()) errors.name = "Enter your name.";
  if (!state.phone.trim()) errors.phone = "Enter a phone number so we can reach you.";
  return errors;
}

export function CuratedBagRequestForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstErrorId = ["size", "numberOfBags", "name", "phone"].find((k) => errors[k as keyof FormState]);
  useEffect(() => {
    if (!firstErrorId) return;
    const id = firstErrorId === "numberOfBags" ? "curated-bag-count" : `curated-bag-${firstErrorId}`;
    const el = document.getElementById(id);
    el?.focus({ preventScroll: false });
  }, [firstErrorId]);

  const setField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nextErrors = validate(formState);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) return;

      setIsSubmitting(true);
      // Front-end only: no API yet. Simulate delay then show success.
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormState(initialFormState);
        setErrors({});
      }, 600);
    },
    [formState]
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4" role="status" aria-live="polite">
        <div className="text-5xl" aria-hidden>🎉</div>
        <h2 className="text-2xl font-medium text-[var(--kbk-text)]">Request submitted</h2>
        <p className="text-[var(--kbk-text-muted)]">
          Thank you! We&apos;ve received your request and will be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--kbk-primary)] text-white font-medium hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          aria-label="Submit another request"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto"
      noValidate
      aria-label="Request a curated bag"
    >
      <fieldset className="space-y-6 border-0 p-0">
        <legend className="text-lg font-semibold text-[var(--kbk-text)] mb-4">
          Your request
        </legend>

        <div>
          <label htmlFor="curated-bag-size" className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5">
            Size
          </label>
          <select
            id="curated-bag-size"
            name="size"
            value={formState.size}
            onChange={(e) => setField("size", e.target.value)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.size)}
            aria-describedby={errors.size ? "curated-bag-size-error" : undefined}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 invalid:border-red-500"
            autoComplete="off"
          >
            <option value="">Select size…</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.size && (
            <p id="curated-bag-size-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.size}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="curated-bag-count" className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5">
            Number of bags
          </label>
          <input
            id="curated-bag-count"
            name="numberOfBags"
            type="number"
            min={1}
            max={10}
            inputMode="numeric"
            value={formState.numberOfBags}
            onChange={(e) => setField("numberOfBags", e.target.valueAsNumber || 0)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.numberOfBags)}
            aria-describedby={errors.numberOfBags ? "curated-bag-count-error" : undefined}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 invalid:border-red-500 [font-variant-numeric:tabular-nums]"
            autoComplete="off"
          />
          {errors.numberOfBags && (
            <p id="curated-bag-count-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.numberOfBags}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-0 p-0">
        <legend className="text-lg font-semibold text-[var(--kbk-text)] mb-4">
          Contact information
        </legend>
        <p className="text-sm text-[var(--kbk-text-muted)] mb-2">
          How can we reach you about your request?
        </p>

        <div>
          <label htmlFor="curated-bag-name" className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5">
            Name
          </label>
          <input
            id="curated-bag-name"
            name="name"
            type="text"
            value={formState.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "curated-bag-name-error" : undefined}
            placeholder="Your name…"
            autoComplete="name"
            spellCheck={false}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 invalid:border-red-500"
          />
          {errors.name && (
            <p id="curated-bag-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="curated-bag-phone" className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5">
            Phone
          </label>
          <input
            id="curated-bag-phone"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={(e) => setField("phone", e.target.value)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "curated-bag-phone-error" : undefined}
            placeholder="(555) 123-4567…"
            autoComplete="tel"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 invalid:border-red-500"
          />
          {errors.phone && (
            <p id="curated-bag-phone-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="curated-bag-email" className="block text-sm font-medium text-[var(--kbk-text)] mb-1.5">
            Email <span className="text-[var(--kbk-text-muted)] font-normal">(optional)</span>
          </label>
          <input
            id="curated-bag-email"
            name="email"
            type="email"
            value={formState.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            placeholder="your@email.com…"
            autoComplete="email"
            spellCheck={false}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--kbk-border)] bg-white text-[var(--kbk-text)] focus:border-[var(--kbk-border-focus)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          />
        </div>
      </fieldset>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--kbk-primary)] text-white font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
        >
          {isSubmitting ? "Submitting…" : "Request bags"}
        </button>
      </div>
    </form>
  );
}
