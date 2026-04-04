'use client';

import { useEffect, useRef } from 'react';
import { ChipGroup } from '@/components/molecules/ChipGroup';
import type { CuratedBagEntry, CuratedBagSize, ChipOption, Gender } from '@/types';

const curatedBagSizeOptions: ChipOption<CuratedBagSize>[] = [
  { value: 'Newborn', label: 'Newborn' },
  { value: '0–3 months', label: '0–3 months' },
  { value: '3–6 months', label: '3–6 months' },
  { value: '6–9 months', label: '6–9 months' },
  { value: '9–12 months', label: '9–12 months' },
  { value: '12–18 months', label: '12–18 months' },
  { value: '18–24 months', label: '18–24 months' },
  { value: '2T', label: '2T' },
  { value: '3T', label: '3T' },
  { value: '4T and up', label: '4T and up' },
];

const genderOptions: ChipOption<Gender>[] = [
  { value: 'Girl', label: 'Girl' },
  { value: 'Boy', label: 'Boy' },
];

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

interface CuratedBagSectionProps {
  curatedBagRequests: CuratedBagEntry[];
  onSizeChange: (id: string, size: CuratedBagSize | null) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onGenderChange: (id: string, gender: Gender | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const QUANTITY_INPUT_PREFIX = 'curatedBagQuantity-';

/**
 * CuratedBagSection - Multiple curated bag entries (size + quantity per entry)
 */
export function CuratedBagSection({
  curatedBagRequests,
  onSizeChange,
  onQuantityChange,
  onGenderChange,
  onAdd,
  onRemove,
}: CuratedBagSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleInputChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      const { name, value } = customEvent.detail;
      if (name.startsWith(QUANTITY_INPUT_PREFIX)) {
        const id = name.slice(QUANTITY_INPUT_PREFIX.length);
        const n = parseInt(value, 10);
        onQuantityChange(id, Number.isNaN(n) ? 0 : Math.max(0, Math.min(10, n)));
      }
    };

    section.addEventListener('kbk-input-change', handleInputChange);
    return () => section.removeEventListener('kbk-input-change', handleInputChange);
  }, [onQuantityChange]);

  return (
    <kbk-form-section
      ref={sectionRef}
      heading="2. Curated bags"
      description="Request bags of seasonal basics by size. Add one line per size—e.g. one 2T bag and two Newborn bags."
    >
      <div className="space-y-6">
        {curatedBagRequests.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#025a9a]/10 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[#171717]/80">
                Bag {index + 1}
              </span>
              {curatedBagRequests.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
                  aria-label={`Remove curated bag ${index + 1}`}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <ChipGroup
                label="Size"
                options={curatedBagSizeOptions}
                selected={entry.size ? [entry.size] : []}
                onChange={(selected) => onSizeChange(entry.id, selected[0] ?? null)}
                mode="single"
              />
              <ChipGroup
                label="Gender (optional)"
                options={genderOptions}
                selected={entry.gender ? [entry.gender] : []}
                onChange={(selected) => onGenderChange(entry.id, selected[0] ?? null)}
                mode="single"
              />
              <div className="min-w-[8rem] max-w-[10rem]">
                <kbk-input
                  label="Number of bags"
                  name={`${QUANTITY_INPUT_PREFIX}${entry.id}`}
                  type="number"
                  placeholder="1"
                  value={String(entry.quantity)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#025a9a]/30 px-4 py-3 text-[#025a9a] font-medium hover:bg-[#025a9a]/5 hover:border-[#025a9a]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
        >
          <span aria-hidden>+</span>
          Add another curated bag
        </button>
      </div>
    </kbk-form-section>
  );
}
