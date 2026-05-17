/**
 * Environment-driven feature toggles. Set values in `.env.local` or your host
 * (e.g. Vercel project env). Use `1`, `true`, or `yes` (case-insensitive) to enable.
 */

function envIsEnabled(value: string | undefined): boolean {
  if (value == null || value === "") return false;
  switch (value.trim().toLowerCase()) {
    case "1":
    case "true":
    case "yes":
      return true;
    default:
      return false;
  }
}

/** Spring homepage promo strip. Off by default. */
export function isSpringPromoBannerEnabled(): boolean {
  return envIsEnabled(process.env.SHOW_SPRING_PROMO_BANNER);
}

/** Fall homepage promo strip. Off by default. */
export function isFallPromoBannerEnabled(): boolean {
  return envIsEnabled(process.env.SHOW_FALL_PROMO_BANNER);
}
