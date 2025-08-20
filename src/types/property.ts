// export interface PropertyWithImages {
//   id: string | number;
//   title: string;
//   description: string;
//   location: string;
//   rent: number;
//   bedrooms: number;
//   bathrooms: number;
//   area?: number | null;
//   propertyType: string;
//   amenities?: string | null;
//   available: boolean;
//   availableDate: string | Date;
//   approved: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   landlordId: string | number;
//   images: Array<PropertyImage & { id: string | number }>;
//   rating?: number;
//   reviews?: number;
// }
export interface PropertyImage {
  id: string | number;
  url: string;
  alt?: string | null;
}

export interface Property {
  description?: string;
  amenities?: string | null;
  availableDate?: string | Date;
  averageRating?: number;
  totalReviews?: number;
  landlord?: { id: number; name: string; email: string; phone?: string | null };
  id: string | number;
  title: string;
  location: string;
  rent: number;
  images: PropertyImage[];
  rating?: number;
  reviews?: Array<{
    id: number;
    rating: number;
    comment?: string | null;
    createdAt: string | Date;
    tenant: { name: string };
  }>;
  bedrooms: number;
  bathrooms: number;
  area?: number | null;
  propertyType: string;
  approved: "PENDING" | "APPROVED" | "REJECTED";
  _count?: { bookings: number };
  createdAt?: string;
}
