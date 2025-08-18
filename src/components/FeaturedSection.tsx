// app/components/FeaturedSection.tsx

import Title from "./Title";
import { prisma } from "@/lib/prisma";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";
import Link from "next/link";

export default async function FeaturedSection() {
  // Fetch properties server-side
  const propertiesFromDB = await prisma.property.findMany({
    where: { approved: "APPROVED" },
    include: {
      images: true,
      reviews: true,
      landlord: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Map DB data to Property type your PropertyCard expects
  const properties: Property[] = propertiesFromDB.map((p) => ({
    id: p.id,
    title: p.title,
    city: p.location, // Using location field from schema
    rent: p.rent, // This is Float in schema
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area, // This is Float? (optional) in schema
    propertyType: p.propertyType, // This is PropertyType enum
    images: p.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
    })),
    rating:
      p.reviews.length > 0
        ? Math.round(
            (p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
              p.reviews.length) *
              10
          ) / 10 // Round to 1 decimal place
        : 0,
    reviews: p.reviews.length,
    landlord: {
      id: p.landlord.id,
      name: p.landlord.name,
      email: p.landlord.email,
    },
  }));

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Title
          title="Featured Properties"
          subtitle="Discover our top properties"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
      <div className="text-center mt-12">
        <Link
          href="/properties"
          className="bg-blue-600 text-white py-3 px-12 mb-10 rounded hover:bg-blue-800 cursor-pointer inline-block"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
