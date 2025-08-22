export interface PropertyCardProps {
  property: import("./property").Property;
  className?: string;
}

export interface BookingFormClientProps {
  propertyId: number;
  canSubmit: boolean;
  className?: string;
}

export interface PropertiesReviewClientProps {
  propertyId: number;
  canSubmit: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  tenant: { name: string };
  tenantId: number;
}
