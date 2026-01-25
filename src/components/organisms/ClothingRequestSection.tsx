'use client';

import { useEffect, useRef } from 'react';
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
  const removeButtonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const button = removeButtonRef.current;
    if (!button || !onRemove) return;

    const handleClick = () => onRemove();
    button.addEventListener('kbk-button-click', handleClick);
    return () => button.removeEventListener('kbk-button-click', handleClick);
  }, [onRemove]);

  const handleSizeChange = (selected: ClothingSize[]) => {
    onSizeChange(selected[0] || null);
  };

  const handleGenderChange = (selected: Gender[]) => {
    onGenderChange(selected[0] || null);
  };

  return (
    <kbk-form-section
      heading={`Clothing Request ${index + 1}`}
      description="Select size, gender, and types of clothing needed"
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

        {/* Remove button */}
        {showRemove && (
          <div className="pt-2">
            <kbk-button ref={removeButtonRef} variant="secondary">
              Remove Request
            </kbk-button>
          </div>
        )}
      </div>
    </kbk-form-section>
  );
}
