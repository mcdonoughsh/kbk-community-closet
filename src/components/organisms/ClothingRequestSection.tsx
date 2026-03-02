'use client';

import { ChipGroup, IconChipGroup } from '@/components/molecules';
import type { ClothingRequest, ClothingSize, Gender, ClothingType, ChipOption } from '@/types';

// Size options
const sizeOptions: ChipOption<ClothingSize>[] = [
  { value: 'Newborn', label: 'Newborn' },
  { value: '3-6m', label: '3-6m' },
  { value: '6-9m', label: '6-9m' },
  { value: '9-12m', label: '9-12m' },
  { value: '12-18m', label: '12-18m' },
  { value: '2T', label: '2T' },
  { value: '3T', label: '3T' },
];

// Gender options
const genderOptions: ChipOption<Gender>[] = [
  { value: 'Girl', label: 'Girl' },
  { value: 'Boy', label: 'Boy' },
];

// Clothing type options
const clothingTypeOptions: ChipOption<ClothingType>[] = [
  { value: 'shirts', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'Dresses', label: 'Dresses' },
  { value: 'Coats', label: 'Coats' },
  { value: 'Warm', label: 'Warm' },
  { value: 'Sweaters', label: 'Sweaters' },
  { value: 'Shoes', label: 'Shoes' },
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

interface ClothingRequestSectionProps {
  clothingRequests: ClothingRequest[];
  onSizeChange: (id: string, size: ClothingSize | null) => void;
  onGenderChange: (id: string, gender: Gender | null) => void;
  onClothingTypesChange: (id: string, types: ClothingType[]) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

/**
 * ClothingRequestSection - One section with multiple clothing request rows (same pattern as Curated bags).
 */
export function ClothingRequestSection({
  clothingRequests,
  onSizeChange,
  onGenderChange,
  onClothingTypesChange,
  onRemove,
  onAdd,
}: ClothingRequestSectionProps) {
  return (
    <kbk-form-section
      heading="3. Additional requested clothing"
      description="Need specific items? Add size, gender, and types for each request."
    >
      <div className="space-y-6">
        {clothingRequests.map((request, index) => (
          <div
            key={request.id}
            className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#025a9a]/10 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[#171717]/80">
                Request {index + 1}
              </span>
              {clothingRequests.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(request.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
                  aria-label={`Remove clothing request ${index + 1}`}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
            <div className="space-y-6">
              <ChipGroup
                label="Size"
                options={sizeOptions}
                selected={request.size ? [request.size] : []}
                onChange={(selected) => onSizeChange(request.id, selected[0] ?? null)}
                mode="single"
              />
              <ChipGroup
                label="Gender"
                options={genderOptions}
                selected={request.gender ? [request.gender] : []}
                onChange={(selected) => onGenderChange(request.id, selected[0] ?? null)}
                mode="single"
              />
              <IconChipGroup
                label="Desired Clothes"
                options={clothingTypeOptions}
                selected={request.clothingTypes}
                onChange={(types) => onClothingTypesChange(request.id, types)}
                mode="multiple"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#025a9a]/30 px-4 py-3 text-[#025a9a] font-medium hover:bg-[#025a9a]/5 hover:border-[#025a9a]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
        >
          <span aria-hidden>+</span>
          Add another clothing request
        </button>
      </div>
    </kbk-form-section>
  );
}
