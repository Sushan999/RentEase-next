// app/components/FeaturedSection.tsx

import Title from "./Title";
import { prisma } from "@/lib/prisma";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";
import Link from "next/link";

// Force this component to always fetch fresh data (no caching)
export const dynamic = "force-dynamic";

export default async function FeaturedSection2() {
  // Fetch properties from DB
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
  let properties: Property[] = propertiesFromDB.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    rent: p.rent,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    propertyType: p.propertyType,
    images: p.images.map(
      (img: { id: number; url: string; alt: string | null }) => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? "",
      })
    ),
    rating:
      p.reviews.length > 0
        ? Math.round(
            (p.reviews.reduce(
              (acc: number, r: { rating: number }) => acc + r.rating,
              0
            ) /
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

  // Sort by rating descending
  properties = properties.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Title
          title="Our Top Rated Properties"
          subtitle="Discover our Properties with Top Ratings"
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
