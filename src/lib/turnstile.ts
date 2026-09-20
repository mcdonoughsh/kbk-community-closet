/**
 * Verify a Cloudflare Turnstile token with the siteverify API.
 * In development, if TURNSTILE_SECRET_KEY is unset, verification is skipped
 * so local work can proceed without captcha keys.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null
): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY unset — skipping verification in development"
      );
      return { success: true };
    }
    return { success: false, error: "Captcha is not configured" };
  }

  if (!token.trim()) {
    return { success: false, error: "Captcha token is required" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );

    if (!res.ok) {
      return { success: false, error: "Captcha verification failed" };
    }

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        success: false,
        error: data["error-codes"]?.join(", ") || "Captcha verification failed",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Captcha verification failed" };
  }
}

export function getTurnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null;
}
