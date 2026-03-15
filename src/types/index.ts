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

// Curated bag request (size + quantity)
export type CuratedBagSize =
  | 'Newborn'
  | '0–3 months'
  | '3–6 months'
  | '6–9 months'
  | '9–12 months'
  | '12–18 months'
  | '18–24 months'
  | '2T'
  | '3T'
  | '4T and up';

// Single curated bag entry (size + quantity)
export interface CuratedBagRequest {
  size: CuratedBagSize | null;
  quantity: number;
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
