'use client';

import { useEffect, useRef } from 'react';
import { IconChipGroup } from '@/components/molecules';
import type { GearRequest, GearType, ChipOption } from '@/types';

// Gear type options
const gearTypeOptions: ChipOption<GearType>[] = [
  { value: 'Crib', label: 'Crib' },
  { value: 'Carrier', label: 'Carrier' },
  { value: 'Pack-n-play', label: 'Pack-n-play' },
  { value: 'Boppy', label: 'Boppy' },
];

interface GearRequestSectionProps {
  gearRequest: GearRequest;
  onGearTypesChange: (types: GearType[]) => void;
  onAdditionalInfoChange: (info: string) => void;
}

/**
 * GearRequestSection - Gear selection + additional info organism
 */
export function GearRequestSection({
  gearRequest,
  onGearTypesChange,
  onAdditionalInfoChange,
}: GearRequestSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleTextareaChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string }>;
      if (customEvent.detail.name === 'additionalInfo') {
        onAdditionalInfoChange(customEvent.detail.value);
      }
    };

    section.addEventListener('kbk-textarea-change', handleTextareaChange);
    return () => section.removeEventListener('kbk-textarea-change', handleTextareaChange);
  }, [onAdditionalInfoChange]);

  return (
    <kbk-form-section
      ref={sectionRef}
      heading="Gear Requests"
      description="Select any baby gear you need"
    >
      <div className="space-y-6">
        {/* Gear types */}
        <IconChipGroup
          label="Desired Gear"
          options={gearTypeOptions}
          selected={gearRequest.gearTypes}
          onChange={onGearTypesChange}
          mode="multiple"
        />

        {/* Additional information */}
        <kbk-textarea
          label="Additional Information"
          name="additionalInfo"
          placeholder="Any other details about your request..."
          value={gearRequest.additionalInfo}
          rows={4}
        />
      </div>
    </kbk-form-section>
  );
}
