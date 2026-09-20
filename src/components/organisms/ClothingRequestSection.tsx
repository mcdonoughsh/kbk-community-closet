'use client';

import { ChipGroup, FormField, IconChipGroup, SizeRangePicker } from '@/components/molecules';
import type { ClothingRequest, Gender, ClothingType, ChipOption, KidSize } from '@/types';

const genderOptions: ChipOption<Gender>[] = [
  { value: 'Girl', label: 'Girl' },
  { value: 'Boy', label: 'Boy' },
];

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
      aria-hidden="true"
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
  onSizeRangeChange: (
    id: string,
    sizeFrom: KidSize | null,
    sizeTo: KidSize | null,
  ) => void;
  onGenderChange: (id: string, gender: Gender | null) => void;
  onClothingTypesChange: (id: string, types: ClothingType[]) => void;
  onShoeSizeChange: (id: string, shoeSize: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

/**
 * ClothingRequestSection — Specific clothing requests with size range, gender, and types.
 */
export function ClothingRequestSection({
  clothingRequests,
  onSizeRangeChange,
  onGenderChange,
  onClothingTypesChange,
  onShoeSizeChange,
  onRemove,
  onAdd,
}: ClothingRequestSectionProps) {
  return (
    <kbk-form-section
      heading="3. Additional requested clothing"
      description="Need specific items? Pick a size (or add a range), gender, and types for each request."
    >
      <div className="space-y-6">
        {clothingRequests.map((request, index) => (
          <div
            key={request.id}
            className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#025a9a]/10 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-sm font-medium text-[#171717]/80 truncate">
                Request {index + 1}
              </span>
              {clothingRequests.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemove(request.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 touch-manipulation"
                  aria-label={`Remove clothing request ${index + 1}`}
                >
                  <TrashIcon />
                </button>
              ) : null}
            </div>
            <div className="space-y-6">
              <SizeRangePicker
                id={`clothing-size-${request.id}`}
                sizeFrom={request.sizeFrom}
                sizeTo={request.sizeTo}
                onChange={(sizeFrom, sizeTo) =>
                  onSizeRangeChange(request.id, sizeFrom, sizeTo)
                }
              />
              <ChipGroup
                label="Gender"
                options={genderOptions}
                selected={request.gender ? [request.gender] : []}
                onChange={(selected) =>
                  onGenderChange(request.id, selected[0] ?? null)
                }
                mode="single"
              />
              <IconChipGroup
                label="Desired Clothes"
                options={clothingTypeOptions}
                selected={request.clothingTypes}
                onChange={(types) => onClothingTypesChange(request.id, types)}
                mode="multiple"
              />
              {request.clothingTypes.includes('Shoes') ? (
                <FormField
                  label="Shoe size"
                  name={`shoe-size-${request.id}`}
                  type="text"
                  placeholder="e.g. 5C, 8 toddler, 1 youth…"
                  value={request.shoeSize}
                  onChange={(value) => onShoeSizeChange(request.id, value)}
                  helperText="Kids’ shoe sizes often differ from clothing size—enter the size that fits."
                />
              ) : null}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#025a9a]/30 px-4 py-3 text-[#025a9a] font-medium hover:bg-[#025a9a]/5 hover:border-[#025a9a]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 touch-manipulation"
        >
          <span aria-hidden="true">+</span>
          Add another clothing request
        </button>
      </div>
    </kbk-form-section>
  );
}
