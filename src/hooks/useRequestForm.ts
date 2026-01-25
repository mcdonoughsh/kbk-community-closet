import { useState, useCallback } from 'react';
import type {
  RequestFormData,
  ClothingRequest,
  ClothingSize,
  Gender,
  ClothingType,
  GearType,
} from '@/types';

// Generate unique ID for clothing requests
const generateId = () => `clothing-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Initial empty clothing request
const createEmptyClothingRequest = (): ClothingRequest => ({
  id: generateId(),
  size: null,
  gender: null,
  clothingTypes: [],
});

// Initial form state
const createInitialFormData = (): RequestFormData => ({
  contact: {
    name: '',
    phone: '',
    email: '',
  },
  clothingRequests: [createEmptyClothingRequest()],
  gearRequest: {
    gearTypes: [],
    additionalInfo: '',
  },
});

interface UseRequestFormReturn {
  formData: RequestFormData;
  
  // Contact methods
  updateName: (name: string) => void;
  updatePhone: (phone: string) => void;
  updateEmail: (email: string) => void;
  
  // Clothing request methods
  addClothingRequest: () => void;
  removeClothingRequest: (id: string) => void;
  updateClothingSize: (id: string, size: ClothingSize | null) => void;
  updateClothingGender: (id: string, gender: Gender | null) => void;
  updateClothingTypes: (id: string, types: ClothingType[]) => void;
  
  // Gear request methods
  updateGearTypes: (types: GearType[]) => void;
  updateAdditionalInfo: (info: string) => void;
  
  // Form methods
  resetForm: () => void;
  isValid: boolean;
}

/**
 * useRequestForm - Manages overall form state and validation
 */
export function useRequestForm(): UseRequestFormReturn {
  const [formData, setFormData] = useState<RequestFormData>(createInitialFormData);

  // Contact methods
  const updateName = useCallback((name: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, name },
    }));
  }, []);

  const updatePhone = useCallback((phone: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, phone },
    }));
  }, []);

  const updateEmail = useCallback((email: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, email },
    }));
  }, []);

  // Clothing request methods
  const addClothingRequest = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: [...prev.clothingRequests, createEmptyClothingRequest()],
    }));
  }, []);

  const removeClothingRequest = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.filter((req) => req.id !== id),
    }));
  }, []);

  const updateClothingSize = useCallback((id: string, size: ClothingSize | null) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) =>
        req.id === id ? { ...req, size } : req
      ),
    }));
  }, []);

  const updateClothingGender = useCallback((id: string, gender: Gender | null) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) =>
        req.id === id ? { ...req, gender } : req
      ),
    }));
  }, []);

  const updateClothingTypes = useCallback((id: string, types: ClothingType[]) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) =>
        req.id === id ? { ...req, clothingTypes: types } : req
      ),
    }));
  }, []);

  // Gear request methods
  const updateGearTypes = useCallback((types: GearType[]) => {
    setFormData((prev) => ({
      ...prev,
      gearRequest: { ...prev.gearRequest, gearTypes: types },
    }));
  }, []);

  const updateAdditionalInfo = useCallback((info: string) => {
    setFormData((prev) => ({
      ...prev,
      gearRequest: { ...prev.gearRequest, additionalInfo: info },
    }));
  }, []);

  // Form methods
  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
  }, []);

  // Validation: phone is required
  const isValid = formData.contact.phone.trim().length > 0;

  return {
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
  };
}
