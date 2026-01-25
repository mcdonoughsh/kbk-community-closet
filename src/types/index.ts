// Shared types for the application

// Size options for clothing requests
export type ClothingSize = 'Newborn' | '3-6m' | '6-9m' | '9-12m' | '12-18m' | '2T' | '3T';

// Gender options
export type Gender = 'Girl' | 'Boy';

// Clothing types
export type ClothingType = 'shirts' | 'pants' | 'Dresses' | 'Coats' | 'Warm' | 'Sweaters' | 'Shoes';

// Gear types
export type GearType = 'Crib' | 'Carrier' | 'Pack-n-play' | 'Boppy';

// Individual clothing request (one per child/size)
export interface ClothingRequest {
  id: string;
  size: ClothingSize | null;
  gender: Gender | null;
  clothingTypes: ClothingType[];
}

// Gear request section
export interface GearRequest {
  gearTypes: GearType[];
  additionalInfo: string;
}

// Contact information
export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

// Complete form data
export interface RequestFormData {
  contact: ContactInfo;
  clothingRequests: ClothingRequest[];
  gearRequest: GearRequest;
}

// Chip option for selection components
export interface ChipOption<T = string> {
  value: T;
  label: string;
  icon?: string;
}

// Selection mode for chip groups
export type SelectionMode = 'single' | 'multiple';
