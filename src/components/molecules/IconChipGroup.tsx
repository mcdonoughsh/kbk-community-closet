'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ChipOption, SelectionMode } from '@/types';

interface IconChipGroupProps<T extends string> {
  options: ChipOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  mode?: SelectionMode;
  label?: string;
}

// Map values to their SVG icon paths
const iconPaths: Record<string, string> = {
  // Clothing
  shirts: '/icons/shirt.svg',
  pants: '/icons/pants.svg',
  Dresses: '/icons/dress.svg',
  Coats: '/icons/coat.svg',
  Warm: '/icons/warm.svg',
  Sweaters: '/icons/sweater.svg',
  Shoes: '/icons/shoes.svg',
  // Gear
  Crib: '/icons/crib.svg',
  Carrier: '/icons/carrier.svg',
  'Pack-n-play': '/icons/pack-n-play.svg',
  Boppy: '/icons/boppy.svg',
};

/**
 * IconChipGroup - Chips with SVG icons for clothing/gear types
 */
export function IconChipGroup<T extends string>({
  options,
  selected,
  onChange,
  mode = 'multiple',
  label,
}: IconChipGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ value: string; selected: boolean }>;
      const { value, selected: isSelected } = customEvent.detail;

      if (mode === 'single') {
        onChange(isSelected ? [value as T] : []);
      } else {
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

  const getIconPath = (value: string): string | null => {
    return iconPaths[value] || null;
  };

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-gray-900 mb-2">{label}</span>
      )}
      <div ref={containerRef} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const iconPath = getIconPath(option.value);
          const isSelected = selected.includes(option.value);
          
          return (
            <kbk-chip
              key={option.value}
              value={option.value}
              selected={isSelected || undefined}
            >
              <span className="flex items-center gap-1">
                {iconPath && (
                  <Image
                    src={iconPath}
                    alt=""
                    width={18}
                    height={18}
                    className={isSelected ? 'brightness-0 invert' : ''}
                  />
                )}
                <span>{option.label}</span>
              </span>
            </kbk-chip>
          );
        })}
      </div>
    </div>
  );
}
