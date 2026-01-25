'use client';

import { useEffect, useRef } from 'react';
import { useRequestForm } from '@/hooks';
import { ContactInfoSection } from './ContactInfoSection';
import { ClothingRequestSection } from './ClothingRequestSection';
import { GearRequestSection } from './GearRequestSection';

/**
 * RequestForm - Complete request form organism
 * Composes all form sections and manages form state
 */
export function RequestForm() {
  const {
    formData,
    updatePhone,
    updateEmail,
    addClothingRequest,
    removeClothingRequest,
    updateClothingSize,
    updateClothingGender,
    updateClothingTypes,
    updateGearTypes,
    updateAdditionalInfo,
    isValid,
  } = useRequestForm();

  const addButtonRef = useRef<HTMLElement>(null);
  const submitButtonRef = useRef<HTMLElement>(null);

  // Handle add clothing request button
  useEffect(() => {
    const button = addButtonRef.current;
    if (!button) return;

    const handleClick = () => addClothingRequest();
    button.addEventListener('kbk-add-click', handleClick);
    return () => button.removeEventListener('kbk-add-click', handleClick);
  }, [addClothingRequest]);

  // Handle submit button
  useEffect(() => {
    const button = submitButtonRef.current;
    if (!button) return;

    const handleClick = () => {
      if (isValid) {
        // For now, just log the form data
        console.log('Form submitted:', formData);
        alert('Request submitted! (Check console for form data)');
      }
    };
    button.addEventListener('kbk-button-click', handleClick);
    return () => button.removeEventListener('kbk-button-click', handleClick);
  }, [isValid, formData]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Contact Information */}
      <ContactInfoSection
        phone={formData.contact.phone}
        email={formData.contact.email}
        onPhoneChange={updatePhone}
        onEmailChange={updateEmail}
      />

      {/* Clothing Requests */}
      {formData.clothingRequests.map((request, index) => (
        <ClothingRequestSection
          key={request.id}
          request={request}
          index={index}
          onSizeChange={(size) => updateClothingSize(request.id, size)}
          onGenderChange={(gender) => updateClothingGender(request.id, gender)}
          onClothingTypesChange={(types) => updateClothingTypes(request.id, types)}
          onRemove={() => removeClothingRequest(request.id)}
          showRemove={formData.clothingRequests.length > 1}
        />
      ))}

      {/* Add another clothing request button */}
      <div className="flex justify-center">
        <kbk-add-button ref={addButtonRef} />
      </div>

      {/* Gear Requests */}
      <GearRequestSection
        gearRequest={formData.gearRequest}
        onGearTypesChange={updateGearTypes}
        onAdditionalInfoChange={updateAdditionalInfo}
      />

      {/* Submit Button */}
      <div className="pt-4">
        <kbk-button
          ref={submitButtonRef}
          variant="primary"
          type="submit"
          disabled={!isValid || undefined}
        >
          Submit Request
        </kbk-button>
      </div>

      {/* Validation message */}
      {!isValid && (
        <p className="text-sm text-red-600 text-center">
          Please enter a phone number to submit your request.
        </p>
      )}
    </form>
  );
}
