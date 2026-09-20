'use client';

import { useEffect, useId, useState } from 'react';
import { ChipGroup } from '@/components/molecules/ChipGroup';
import {
  formatSizeRange,
  kidSizeIndex,
  kidSizeOptions,
  type KidSize,
  nextSizeRangeFromFrom,
  nextSizeRangeFromTo,
} from '@/lib/sizes';

interface SizeRangePickerProps {
  sizeFrom: KidSize | null;
  sizeTo: KidSize | null;
  onChange: (sizeFrom: KidSize | null, sizeTo: KidSize | null) => void;
  /** Optional id for aria relationships */
  id?: string;
}

/**
 * SizeRangePicker — single size by default; optional “Up to” range via progressive disclosure.
 */
export function SizeRangePicker({
  sizeFrom,
  sizeTo,
  onChange,
  id,
}: SizeRangePickerProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const summaryId = `${baseId}-summary`;

  const hasActiveRange =
    sizeFrom != null && sizeTo != null && sizeFrom !== sizeTo;

  const [rangeOpen, setRangeOpen] = useState(hasActiveRange);

  useEffect(() => {
    if (hasActiveRange) setRangeOpen(true);
  }, [hasActiveRange]);

  const sizeLabel = formatSizeRange(sizeFrom, sizeTo);
  const upToOptions =
    sizeFrom == null
      ? kidSizeOptions
      : kidSizeOptions.filter(
          (opt) => kidSizeIndex(opt.value) >= kidSizeIndex(sizeFrom),
        );

  function selectSize(nextFrom: KidSize | null) {
    if (nextFrom == null) {
      setRangeOpen(false);
      onChange(null, null);
      return;
    }
    if (rangeOpen) {
      const next = nextSizeRangeFromFrom(nextFrom, sizeTo);
      onChange(next.sizeFrom, next.sizeTo);
      return;
    }
    onChange(nextFrom, nextFrom);
  }

  function selectUpTo(nextTo: KidSize | null) {
    const next = nextSizeRangeFromTo(sizeFrom, nextTo);
    onChange(next.sizeFrom, next.sizeTo);
  }

  function openRange() {
    setRangeOpen(true);
    if (sizeFrom != null) onChange(sizeFrom, sizeTo ?? sizeFrom);
  }

  function removeRange() {
    setRangeOpen(false);
    if (sizeFrom != null) onChange(sizeFrom, sizeFrom);
  }

  return (
    <div className="space-y-3" role="group" aria-labelledby={`${baseId}-label`}>
      <ChipGroup
        label="Size"
        labelId={`${baseId}-label`}
        options={kidSizeOptions}
        selected={sizeFrom ? [sizeFrom] : []}
        onChange={(selected) => selectSize(selected[0] ?? null)}
        mode="single"
      />

      {sizeFrom != null && !rangeOpen ? (
        <button
          type="button"
          onClick={openRange}
          className="text-sm font-medium text-[#025a9a] hover:text-[#025a9a]/80 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 rounded-sm touch-manipulation"
        >
          Add Size Range
        </button>
      ) : null}

      {sizeFrom != null && rangeOpen ? (
        <div className="space-y-3 rounded-lg bg-white/70 p-3 ring-1 ring-[#025a9a]/10">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-sm font-medium text-gray-900">Up to</span>
            <button
              type="button"
              onClick={removeRange}
              className="shrink-0 text-sm font-medium text-[#171717]/70 hover:text-[#171717] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 rounded-sm touch-manipulation"
            >
              Remove Range
            </button>
          </div>
          <ChipGroup
            options={upToOptions}
            selected={sizeTo ? [sizeTo] : []}
            onChange={(selected) => selectUpTo(selected[0] ?? null)}
            mode="single"
            ariaLabel="Up to size"
          />
          {sizeLabel != null && sizeLabel !== sizeFrom ? (
            <p
              id={summaryId}
              className="text-sm text-[#171717]/70"
              aria-live="polite"
            >
              Range: <span translate="no">{sizeLabel}</span>
            </p>
          ) : (
            <p className="text-sm text-[#171717]/70">
              Pick a larger size to set a range (e.g. 2T–3T).
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
