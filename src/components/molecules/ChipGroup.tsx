'use client';

import { useEffect, useId, useRef } from 'react';
import type { ChipOption, SelectionMode } from '@/types';

interface ChipGroupProps<T extends string> {
  options: ChipOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  mode?: SelectionMode;
  label?: string;
  /** Associates the visible label with the chip group for a11y */
  labelId?: string;
  /** When there is no visible label */
  ariaLabel?: string;
}

/**
 * ChipGroup - React wrapper managing multiple kbk-chip elements
 * Handles selection state and event coordination
 */
export function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
  mode = 'multiple',
  label,
  labelId: labelIdProp,
  ariaLabel,
}: ChipGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedLabelId = useId();
  const labelId = label ? (labelIdProp ?? generatedLabelId) : undefined;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ value: string; selected: boolean }>;
      const { value, selected: isSelected } = customEvent.detail;

      if (mode === 'single') {
        onChange(isSelected ? [value as T] : []);
      } else if (isSelected) {
        onChange([...selected, value as T]);
      } else {
        onChange(selected.filter((v) => v !== value));
      }
    };

    container.addEventListener('kbk-chip-toggle', handleToggle);
    return () => container.removeEventListener('kbk-chip-toggle', handleToggle);
  }, [selected, onChange, mode]);

  return (
    <div>
      {label ? (
        <span id={labelId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </span>
      ) : null}
      <div
        ref={containerRef}
        className="flex flex-wrap gap-2"
        role="group"
        aria-labelledby={labelId}
        aria-label={!labelId ? ariaLabel : undefined}
      >
        {options.map((option) => (
          <kbk-chip
            key={option.value}
            value={option.value}
            selected={selected.includes(option.value) || undefined}
          >
            {option.label}
          </kbk-chip>
        ))}
      </div>
    </div>
  );
}
