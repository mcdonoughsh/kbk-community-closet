// Shared types for the application

import type { KidSize } from '@/lib/sizes';

export type { KidSize };

// Gender options
export type Gender = 'Girl' | 'Boy';

// Clothing types
export type ClothingType = 'shirts' | 'pants' | 'Dresses' | 'Coats' | 'Warm' | 'Sweaters' | 'Shoes';

// Gear types
export type GearType = 'Crib' | 'Carrier' | 'Pack-n-play' | 'Boppy';

// Individual clothing request (one per child/size)
export interface ClothingRequest {
  id: string;
  sizeFrom: KidSize | null;
  sizeTo: KidSize | null;
  gender: Gender | null;
  clothingTypes: ClothingType[];
  /** Free-text shoe size; used when Shoes is among clothingTypes */
  shoeSize: string;
}

// Gear request section
export interface GearRequest {
  gearTypes: GearType[];
  additionalInfo: string;
}

// Single curated bag entry (size range + optional gender)
export interface CuratedBagRequest {
  sizeFrom: KidSize | null;
  sizeTo: KidSize | null;
  gender: Gender | null;
}

// Curated bag entry in the list (has id for React keys and remove)
export interface CuratedBagEntry extends CuratedBagRequest {
  id: string;
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
  curatedBagRequests: CuratedBagEntry[];
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

// Featured gear item from Contentful (donated products people can request)
export type FeaturedGearStatus = "available" | "claimed";

export interface FeaturedGearItem {
  id: string;
  title: string;
  description: string;
  status: FeaturedGearStatus;
  image: {
    url: string;
    width: number;
    height: number;
    alt: string | null;
  } | null;
}
