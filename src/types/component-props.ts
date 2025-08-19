export interface PropertyCardProps {
  property: import("./property").Property;
  className?: string;
}

export interface BookingFormClientProps {
  propertyId: number | string;
  className?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  tenant: { name: string };
}
