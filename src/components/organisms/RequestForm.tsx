'use client';

import { useEffect, useRef, useState } from 'react';
import { useRequestForm } from '@/hooks';
import { trpc } from '@/lib/trpc';
import { ContactInfoSection } from './ContactInfoSection';
import { ClothingRequestSection } from './ClothingRequestSection';
import { GearRequestSection } from './GearRequestSection';
import type { RequestFormData } from '@/types';

/**
 * Transform the local form data into the shape the API expects.
 * Each clothing type in each clothing request becomes a separate item.
 * Each gear type becomes a separate item (no size/gender).
 */
function buildSubmitPayload(formData: RequestFormData) {
  const items: { itemTypeName: string; size: string | null; gender: string | null }[] = [];

  // Clothing: one API item per clothing-type per size/gender group
  for (const req of formData.clothingRequests) {
    for (const clothingType of req.clothingTypes) {
      items.push({
        itemTypeName: clothingType,
        size: req.size,
        gender: req.gender,
      });
    }
  }

  // Gear: one API item per gear type (no size/gender)
  for (const gearType of formData.gearRequest.gearTypes) {
    items.push({
      itemTypeName: gearType,
      size: null,
      gender: null,
    });
  }

  return {
    contact: {
      name: formData.contact.name,
      phone: formData.contact.phone,
      email: formData.contact.email || undefined,
    },
    items,
    additionalInfo: formData.gearRequest.additionalInfo || undefined,
  };
}

/**
 * RequestForm - Complete request form organism
 * Composes all form sections and manages form state
 */
export function RequestForm() {
  const {
    formData,
    updateName,
    updatePhone,
    updateEmail,
    addClothingRequest,
    removeClothingRequest,
    updateClothingSize,
    updateClothingGender,
    updateClothingTypes,
    updateGearTypes,
    updateAdditionalInfo,
    resetForm,
    isValid,
  } = useRequestForm();

  const submitMutation = trpc.request.submit.useMutation();
  const [submitted, setSubmitted] = useState(false);

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

    const handleClick = async () => {
      if (!isValid || submitMutation.isPending) return;

      const payload = buildSubmitPayload(formData);

      // Must have at least one item
      if (payload.items.length === 0) {
        alert('Please select at least one clothing or gear item.');
        return;
      }

      try {
        await submitMutation.mutateAsync(payload);
        setSubmitted(true);
        resetForm();
      } catch (err) {
        console.error('Submit error:', err);
        alert('Something went wrong submitting your request. Please try again.');
      }
    };

    button.addEventListener('kbk-button-click', handleClick);
    return () => button.removeEventListener('kbk-button-click', handleClick);
  }, [isValid, formData, submitMutation, resetForm]);

  // Success state
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-medium text-gray-900">
          Request Submitted!
        </h2>
        <p className="text-gray-600">
          Thank you! We&apos;ve received your request and will be in touch soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2 rounded-lg bg-[var(--kbk-primary,#3b82f6)] text-white hover:opacity-90 transition-opacity"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Contact Information */}
      <ContactInfoSection
        name={formData.contact.name}
        phone={formData.contact.phone}
        email={formData.contact.email}
        onNameChange={updateName}
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
          disabled={!isValid || submitMutation.isPending || undefined}
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Request'}
        </kbk-button>
      </div>

      {/* Error message from API */}
      {submitMutation.isError && (
        <p className="text-sm text-red-600 text-center">
          {submitMutation.error.message}
        </p>
      )}

      {/* Validation message */}
      {!isValid && (
        <p className="text-sm text-red-600 text-center">
          Please enter a phone number to submit your request.
        </p>
      )}
    </form>
  );
}
