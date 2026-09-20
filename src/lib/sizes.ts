import type { ChipOption } from '@/types';

/** Ordered size ladder shared by curated bags and clothing requests */
export const KID_SIZES = [
  'Newborn',
  '0–3 months',
  '3–6 months',
  '6–9 months',
  '9–12 months',
  '12–18 months',
  '18–24 months',
  '2T',
  '3T',
  '4T-5T/XS',
  'S',
  'M',
  'L',
] as const;

export type KidSize = (typeof KID_SIZES)[number];

export const kidSizeOptions: ChipOption<KidSize>[] = KID_SIZES.map((size) => ({
  value: size,
  label: size,
}));

export function kidSizeIndex(size: KidSize): number {
  return KID_SIZES.indexOf(size);
}

/**
 * Format a from/to selection for storage and display.
 * Same size → "2T"; range → "2T–3T" (en dash).
 */
export function formatSizeRange(
  sizeFrom: KidSize | null,
  sizeTo: KidSize | null,
): string | null {
  if (sizeFrom == null) return null;
  const to = sizeTo ?? sizeFrom;
  if (sizeFrom === to) return sizeFrom;
  const fromIdx = kidSizeIndex(sizeFrom);
  const toIdx = kidSizeIndex(to);
  if (fromIdx < 0 || toIdx < 0) return sizeFrom;
  const [lo, hi] = fromIdx <= toIdx ? [sizeFrom, to] : [to, sizeFrom];
  return `${lo}–${hi}`;
}

/** When From changes, keep To at or after From. */
export function nextSizeRangeFromFrom(
  nextFrom: KidSize | null,
  currentTo: KidSize | null,
): { sizeFrom: KidSize | null; sizeTo: KidSize | null } {
  if (nextFrom == null) return { sizeFrom: null, sizeTo: null };
  if (currentTo == null) return { sizeFrom: nextFrom, sizeTo: nextFrom };
  const fromIdx = kidSizeIndex(nextFrom);
  const toIdx = kidSizeIndex(currentTo);
  if (toIdx < fromIdx) return { sizeFrom: nextFrom, sizeTo: nextFrom };
  return { sizeFrom: nextFrom, sizeTo: currentTo };
}

/** When To changes, keep From at or before To. */
export function nextSizeRangeFromTo(
  currentFrom: KidSize | null,
  nextTo: KidSize | null,
): { sizeFrom: KidSize | null; sizeTo: KidSize | null } {
  if (nextTo == null) {
    return { sizeFrom: currentFrom, sizeTo: currentFrom };
  }
  if (currentFrom == null) return { sizeFrom: nextTo, sizeTo: nextTo };
  const fromIdx = kidSizeIndex(currentFrom);
  const toIdx = kidSizeIndex(nextTo);
  if (toIdx < fromIdx) return { sizeFrom: nextTo, sizeTo: nextTo };
  return { sizeFrom: currentFrom, sizeTo: nextTo };
}
