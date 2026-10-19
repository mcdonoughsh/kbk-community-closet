"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Placeholder token for local dev without Turnstile keys; the server skips verification there too. */
export const TURNSTILE_DEV_BYPASS_TOKEN = "dev-bypass";

export function TurnstileField({
  onTokenChange,
}: {
  onTokenChange: (token: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  if (!turnstileSiteKey) {
    return process.env.NODE_ENV === "development" ? (
      <p className="text-sm text-[var(--kbk-text-muted)]">
        Turnstile keys not set — captcha skipped in development.
      </p>
    ) : null;
  }

  return (
    <div className="space-y-2">
      <Turnstile
        siteKey={turnstileSiteKey}
        onSuccess={(token) => {
          onTokenChange(token);
          setError(null);
        }}
        onExpire={() => onTokenChange("")}
        onError={(code) => {
          onTokenChange("");
          setError(
            typeof code === "string" && code.length > 0
              ? `Captcha failed to load (${code}). If you are on localhost, add localhost to the Turnstile widget hostnames in the Cloudflare dashboard.`
              : "Captcha failed to load. Check that this hostname is allowed on your Turnstile widget."
          );
        }}
        options={{ theme: "light" }}
      />
      {error ? (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Token to submit, or an error message when the captcha isn't ready.
 * In development without keys, returns the bypass token.
 */
export function resolveTurnstileToken(
  token: string
): { token: string } | { error: string } {
  if (!turnstileSiteKey) {
    return process.env.NODE_ENV === "development"
      ? { token: TURNSTILE_DEV_BYPASS_TOKEN }
      : { error: "Captcha is not configured. Please try again later." };
  }
  if (!token) {
    return { error: "Please complete the captcha" };
  }
  return { token };
}
