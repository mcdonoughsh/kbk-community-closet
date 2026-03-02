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

// Trash icon component
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
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

interface ClothingRequestSectionProps {
  request: ClothingRequest;
  index: number;
  onSizeChange: (size: ClothingSize | null) => void;
  onGenderChange: (gender: Gender | null) => void;
  onClothingTypesChange: (types: ClothingType[]) => void;
  onRemove?: () => void;
  showRemove: boolean;
}

/**
 * ClothingRequestSection - Size, gender, clothes selection organism
 */
export function ClothingRequestSection({
  request,
  index,
  onSizeChange,
  onGenderChange,
  onClothingTypesChange,
  onRemove,
  showRemove,
}: ClothingRequestSectionProps) {
  const handleSizeChange = (selected: ClothingSize[]) => {
    onSizeChange(selected[0] || null);
  };

  const handleGenderChange = (selected: Gender[]) => {
    onGenderChange(selected[0] || null);
  };

  return (
    <kbk-form-section
      heading={index === 0 ? '3. Additional requested clothing' : `Request ${index + 1}`}
      description={index === 0 ? 'Need specific items? Add size, gender, and types for each request.' : 'Select size, gender, and types of clothing needed.'}
    >
      <div className="space-y-6">
        {/* Size selection */}
        <ChipGroup
          label="Size"
          options={sizeOptions}
          selected={request.size ? [request.size] : []}
          onChange={handleSizeChange}
          mode="single"
        />

        {/* Gender selection */}
        <ChipGroup
          label="Gender"
          options={genderOptions}
          selected={request.gender ? [request.gender] : []}
          onChange={handleGenderChange}
          mode="single"
        />

        {/* Clothing types */}
        <IconChipGroup
          label="Desired Clothes"
          options={clothingTypeOptions}
          selected={request.clothingTypes}
          onChange={onClothingTypesChange}
          mode="multiple"
        />

        {/* Delete button */}
        {showRemove && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
              aria-label="Delete clothing request"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </kbk-form-section>
  );
}
