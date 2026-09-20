import { useState, useCallback } from 'react';
import type {
  RequestFormData,
  ClothingRequest,
  Gender,
  ClothingType,
  GearType,
  CuratedBagEntry,
  KidSize,
} from '@/types';

// Generate unique ID for list entries
const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Initial empty clothing request
const createEmptyClothingRequest = (): ClothingRequest => ({
  id: generateId('clothing'),
  sizeFrom: null,
  sizeTo: null,
  gender: null,
  clothingTypes: [],
  shoeSize: '',
});

// Initial empty curated bag entry
const createEmptyCuratedBagEntry = (): CuratedBagEntry => ({
  id: generateId('curated'),
  sizeFrom: null,
  sizeTo: null,
  gender: null,
});

// Initial form state
const createInitialFormData = (): RequestFormData => ({
  contact: {
    name: '',
    phone: '',
    email: '',
  },
  curatedBagRequests: [createEmptyCuratedBagEntry()],
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

  // Curated bag request methods (multiple entries)
  addCuratedBagRequest: () => void;
  removeCuratedBagRequest: (id: string) => void;
  updateCuratedBagSizeRange: (
    id: string,
    sizeFrom: KidSize | null,
    sizeTo: KidSize | null,
  ) => void;
  updateCuratedBagGender: (id: string, gender: Gender | null) => void;

  // Clothing request methods
  addClothingRequest: () => void;
  removeClothingRequest: (id: string) => void;
  updateClothingSizeRange: (
    id: string,
    sizeFrom: KidSize | null,
    sizeTo: KidSize | null,
  ) => void;
  updateClothingGender: (id: string, gender: Gender | null) => void;
  updateClothingTypes: (id: string, types: ClothingType[]) => void;
  updateClothingShoeSize: (id: string, shoeSize: string) => void;

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

  // Curated bag request methods
  const addCuratedBagRequest = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      curatedBagRequests: [...prev.curatedBagRequests, createEmptyCuratedBagEntry()],
    }));
  }, []);

  const removeCuratedBagRequest = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      curatedBagRequests: prev.curatedBagRequests.filter((entry) => entry.id !== id),
    }));
  }, []);

  const updateCuratedBagSizeRange = useCallback(
    (id: string, sizeFrom: KidSize | null, sizeTo: KidSize | null) => {
      setFormData((prev) => ({
        ...prev,
        curatedBagRequests: prev.curatedBagRequests.map((entry) =>
          entry.id === id ? { ...entry, sizeFrom, sizeTo } : entry,
        ),
      }));
    },
    [],
  );

  const updateCuratedBagGender = useCallback((id: string, gender: Gender | null) => {
    setFormData((prev) => ({
      ...prev,
      curatedBagRequests: prev.curatedBagRequests.map((entry) =>
        entry.id === id ? { ...entry, gender } : entry,
      ),
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

  const updateClothingSizeRange = useCallback(
    (id: string, sizeFrom: KidSize | null, sizeTo: KidSize | null) => {
      setFormData((prev) => ({
        ...prev,
        clothingRequests: prev.clothingRequests.map((req) =>
          req.id === id ? { ...req, sizeFrom, sizeTo } : req,
        ),
      }));
    },
    [],
  );

  const updateClothingGender = useCallback((id: string, gender: Gender | null) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) =>
        req.id === id ? { ...req, gender } : req,
      ),
    }));
  }, []);

  const updateClothingTypes = useCallback((id: string, types: ClothingType[]) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) => {
        if (req.id !== id) return req;
        const shoeSize = types.includes('Shoes') ? req.shoeSize : '';
        return { ...req, clothingTypes: types, shoeSize };
      }),
    }));
  }, []);

  const updateClothingShoeSize = useCallback((id: string, shoeSize: string) => {
    setFormData((prev) => ({
      ...prev,
      clothingRequests: prev.clothingRequests.map((req) =>
        req.id === id ? { ...req, shoeSize } : req,
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
    addCuratedBagRequest,
    removeCuratedBagRequest,
    updateCuratedBagSizeRange,
    updateCuratedBagGender,
    addClothingRequest,
    removeClothingRequest,
    updateClothingSizeRange,
    updateClothingGender,
    updateClothingTypes,
    updateClothingShoeSize,
    updateGearTypes,
    updateAdditionalInfo,
    resetForm,
    isValid,
  };
}
