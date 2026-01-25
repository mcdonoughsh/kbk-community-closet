'use client';

import { useEffect, useRef } from 'react';
import type { ChipOption, SelectionMode } from '@/types';

interface ChipGroupProps<T extends string> {
  options: ChipOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  mode?: SelectionMode;
  label?: string;
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
}: ChipGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ value: string; selected: boolean }>;
      const { value, selected: isSelected } = customEvent.detail;

      if (mode === 'single') {
        // Single selection: only one can be selected
        onChange(isSelected ? [value as T] : []);
      } else {
        // Multiple selection: toggle the value
        if (isSelected) {
          onChange([...selected, value as T]);
        } else {
          onChange(selected.filter((v) => v !== value));
        }
      }
    };

    container.addEventListener('kbk-chip-toggle', handleToggle);
    return () => container.removeEventListener('kbk-chip-toggle', handleToggle);
  }, [selected, onChange, mode]);

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-gray-900 mb-2">{label}</span>
      )}
      <div ref={containerRef} className="flex flex-wrap gap-2">
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
