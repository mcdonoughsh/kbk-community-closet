'use client';

import { ChipGroup, SizeRangePicker } from '@/components/molecules';
import type { CuratedBagEntry, Gender, ChipOption, KidSize } from '@/types';

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
      aria-hidden="true"
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
  onSizeRangeChange: (
    id: string,
    sizeFrom: KidSize | null,
    sizeTo: KidSize | null,
  ) => void;
  onGenderChange: (id: string, gender: Gender | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

/**
 * CuratedBagSection — One child request per row (size range + optional gender).
 */
export function CuratedBagSection({
  curatedBagRequests,
  onSizeRangeChange,
  onGenderChange,
  onAdd,
  onRemove,
}: CuratedBagSectionProps) {
  return (
    <kbk-form-section
      heading="2. Curated bags"
      description="Request a bag of seasonal basics for each child. Pick a size—add a range only if you need one."
    >
      <div className="space-y-6">
        {curatedBagRequests.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#025a9a]/10 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-sm font-medium text-[#171717]/80 truncate">
                Child {index + 1}
              </span>
              {curatedBagRequests.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 touch-manipulation"
                  aria-label={`Remove child request ${index + 1}`}
                >
                  <TrashIcon />
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              <SizeRangePicker
                id={`curated-size-${entry.id}`}
                sizeFrom={entry.sizeFrom}
                sizeTo={entry.sizeTo}
                onChange={(sizeFrom, sizeTo) =>
                  onSizeRangeChange(entry.id, sizeFrom, sizeTo)
                }
              />
              <ChipGroup
                label="Gender (optional)"
                options={genderOptions}
                selected={entry.gender ? [entry.gender] : []}
                onChange={(selected) =>
                  onGenderChange(entry.id, selected[0] ?? null)
                }
                mode="single"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#025a9a]/30 px-4 py-3 text-[#025a9a] font-medium hover:bg-[#025a9a]/5 hover:border-[#025a9a]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 touch-manipulation"
        >
          <span aria-hidden="true">+</span>
          Add Child Request
        </button>
      </div>
    </kbk-form-section>
  );
}
