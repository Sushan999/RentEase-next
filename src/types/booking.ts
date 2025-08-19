export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  message?: string;
  createdAt: string;
  tenant: {
    id: number;
    name: string;
    email: string;
  };
  property: {
    id: number;
    title: string;
    location: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    images: { url: string }[];
  };
}
