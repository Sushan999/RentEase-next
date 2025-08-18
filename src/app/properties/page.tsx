import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export default async function PropertiesPage() {
  const propertiesFromDB = await prisma.property.findMany({
    where: { approved: "APPROVED" },
    include: {
      images: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Map DB data to Property type with rating & review count
  const properties = propertiesFromDB.map((p) => {
    const totalReviews = p.reviews.length;
    const rating =
      totalReviews > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      ...p,
      city: p.location,
      rating: Math.round(rating), // round to nearest int for full stars
      reviews: totalReviews,
    };
  });
  return (
    <div className="min-h-screen container mx-auto  py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Properties</h1>
      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
