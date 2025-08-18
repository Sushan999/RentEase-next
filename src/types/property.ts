export interface PropertyWithImages {
  id: string | number;
  title: string;
  description: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area?: number | null;
  propertyType: string;
  amenities?: string | null;
  available: boolean;
  availableDate: string | Date;
  approved: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  landlordId: string | number;
  images: Array<PropertyImage & { id: string | number }>;
  rating?: number;
  reviews?: number;
}
export interface PropertyImage {
  id: string | number;
  url: string;
  alt?: string | null;
}

export interface Property {
  id: string | number;
  title: string;
  city: string;
  rent: number;
  images: PropertyImage[];
  rating?: number;
  reviews?: number;
  bedrooms: number;
  bathrooms: number;
  area?: number | null;
  propertyType: string;
}
