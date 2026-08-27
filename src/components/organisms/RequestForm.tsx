"use client";

import { useState } from "react";
import { useRequestForm } from "@/hooks";
import { trpc } from "@/lib/trpc";
import { ContactInfoSection } from "./ContactInfoSection";
import { CuratedBagSection } from "./CuratedBagSection";
import { ClothingRequestSection } from "./ClothingRequestSection";
import { GearRequestSection } from "./GearRequestSection";
import { RequestPickupSection } from "./RequestPickupSection";
import type { RequestFormData } from "@/types";

/**
 * Transform the local form data into the shape the API expects.
 * curatedBags: only entries with a size selected; each has size, quantity, optional gender.
 * items: clothing and gear (one API item per type per request).
 */
function buildSubmitPayload(formData: RequestFormData) {
  const items: {
    itemTypeName: string;
    size: string | null;
    gender: string | null;
  }[] = [];

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

  const curatedBags = formData.curatedBagRequests
    .filter((entry) => entry.size != null && entry.quantity >= 1)
    .map((entry) => ({
      size: entry.size!,
      quantity: entry.quantity,
      ...(entry.gender != null ? { gender: entry.gender } : {}),
    }));

  return {
    contact: {
      name: formData.contact.name,
      phone: formData.contact.phone,
      email: formData.contact.email || undefined,
    },
    curatedBags: curatedBags.length > 0 ? curatedBags : undefined,
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
    addCuratedBagRequest,
    removeCuratedBagRequest,
    updateCuratedBagSize,
    updateCuratedBagQuantity,
    updateCuratedBagGender,
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

  const handleSubmitClick = async () => {
    if (!isValid || submitMutation.isPending) return;

    const payload = buildSubmitPayload(formData);
    const hasCuratedBags =
      payload.curatedBags != null && payload.curatedBags.length > 0;
    const hasItems = payload.items.length > 0;

    if (!hasCuratedBags && !hasItems) {
      alert(
        "Please request at least one curated bag (pick a size and quantity) or add specific clothing or gear items.",
      );
      return;
    }

    try {
      await submitMutation.mutateAsync(payload);
      setSubmitted(true);
      resetForm();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong submitting your request. Please try again.");
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-medium text-[#171717]">
          Request Submitted!
        </h2>
        <p className="text-base text-[#171717]/80 sm:text-lg">
          Thank you! We&apos;ve received your request and will be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-xl bg-[#025a9a] px-6 py-3.5 text-white font-semibold hover:bg-[#025a9a]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* 1. Contact info */}
        <ContactInfoSection
          name={formData.contact.name}
          phone={formData.contact.phone}
          email={formData.contact.email}
          onNameChange={updateName}
          onPhoneChange={updatePhone}
          onEmailChange={updateEmail}
        />

        {/* 2. Curated bags */}
        <CuratedBagSection
          curatedBagRequests={formData.curatedBagRequests}
          onSizeChange={updateCuratedBagSize}
          onQuantityChange={updateCuratedBagQuantity}
          onGenderChange={updateCuratedBagGender}
          onAdd={addCuratedBagRequest}
          onRemove={removeCuratedBagRequest}
        />

        {/* 3. Additional requested clothing */}
        <ClothingRequestSection
          clothingRequests={formData.clothingRequests}
          onSizeChange={updateClothingSize}
          onGenderChange={updateClothingGender}
          onClothingTypesChange={updateClothingTypes}
          onRemove={removeClothingRequest}
          onAdd={addClothingRequest}
        />

        {/* 4. Gear requests */}
        <GearRequestSection
          gearRequest={formData.gearRequest}
          onGearTypesChange={updateGearTypes}
          onAdditionalInfoChange={updateAdditionalInfo}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={!isValid || submitMutation.isPending}
            className="w-full sm:w-auto rounded-xl bg-[#025a9a] px-6 py-3.5 text-white font-semibold hover:bg-[#025a9a]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? "Submitting…" : "Submit Request"}
          </button>
        </div>

        {/* Error message from API */}
        {submitMutation.isError && (
          <p className="text-base text-red-600 text-center">
            {submitMutation.error.message}
          </p>
        )}

        {/* Validation message */}
        {!isValid && (
          <p className="text-base text-red-600 text-center">
            Please enter a phone number to submit your request.
          </p>
        )}
      </form>
      <RequestPickupSection />
    </div>
  );
}
