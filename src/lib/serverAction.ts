// app/lib/serverActions.ts
import { prisma } from "./prisma";
import { Property } from "@/types/property";

export async function getTopRatedProperties(): Promise<Property[]> {
  const propertiesFromDB = await prisma.property.findMany({
    where: { approved: "APPROVED" },
    include: { images: true, reviews: true, landlord: true },
    take: 4,
    orderBy: { createdAt: "desc" }, // or by avg rating
  });

  return propertiesFromDB.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    rent: p.rent,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    propertyType: p.propertyType,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? "",
    })),
    rating:
      p.reviews.length > 0
        ? Math.round(
            (p.reviews.reduce((acc, r) => acc + r.rating, 0) /
              p.reviews.length) *
              10
          ) / 10
        : 0,
    totalReviews: p.reviews.length,
    approved: p.approved,
    landlord: {
      id: p.landlord.id,
      name: p.landlord.name,
      email: p.landlord.email,
    },
  }));
}
