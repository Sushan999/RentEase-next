import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  MapPin,
  Bed,
  Bath,
  Calendar,
  Star,
  Phone,
  Mail,
  User,
} from "lucide-react";
import type { Property } from "@/types/property";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PropertyPage({
  params,
  searchParams,
}: PageProps) {
  await searchParams; // Await searchParams to satisfy type checking
  const { id: paramId } = await params;
  const id = Number(paramId);

  if (isNaN(id) || id <= 0) {
    notFound();
  }

  const propertyRaw = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      landlord: true,
      reviews: { include: { tenant: true } },
    },
  });

  if (!propertyRaw) {
    notFound();
  }

  const property: Property = {
    ...propertyRaw,
    area: propertyRaw.area ?? undefined,
    amenities: propertyRaw.amenities ?? undefined,
    reviews: propertyRaw.reviews.map((r) => ({
      ...r,
      comment: r.comment ?? undefined,
      createdAt: r.createdAt.toISOString(),
      tenant: { name: r.tenant.name },
      tenantId: r.tenantId,
    })),
    createdAt: propertyRaw.createdAt.toISOString(),
    availableDate: propertyRaw.availableDate?.toISOString(),
    landlord: propertyRaw.landlord
      ? {
          id: propertyRaw.landlord.id,
          name: propertyRaw.landlord.name,
          email: propertyRaw.landlord.email,
          phone: propertyRaw.landlord.phone ?? undefined,
        }
      : undefined,
    averageRating:
      propertyRaw.reviews.length > 0
        ? propertyRaw.reviews.reduce((a, b) => a + b.rating, 0) /
          propertyRaw.reviews.length
        : 0,
    rating:
      propertyRaw.reviews.length > 0
        ? propertyRaw.reviews.reduce((a, b) => a + b.rating, 0) /
          propertyRaw.reviews.length
        : undefined,
    totalReviews: propertyRaw.reviews.length,
  };

  const session = await getServerSession(authOptions);
  const isTenant = session?.user.role === "TENANT";

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Image gallery */}
        <div className="relative w-full h-64 md:h-96 mb-6 md:mb-8 rounded-lg overflow-hidden">
          {property.images.length > 0 ? (
            <Image
              src={property.images[0].url}
              alt={property.images[0].alt ?? property.title}
              fill
              className="w-full h-full object-cover"
              style={{ objectFit: "cover" }}
              priority={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xl">No Images Available</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Property Details */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {renderStars(Math.round(property.rating || 0))}
              <span className="text-gray-600 text-sm">
                ({property.totalReviews || 0} reviews)
              </span>
            </div>

            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-5 w-5 mr-2" />
              {property.location}
            </div>

            <div className="flex flex-wrap items-center space-x-4 mt-4 text-gray-600">
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-1" />
                {property.bedrooms} Beds
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-1" />
                {property.bathrooms} Baths
              </div>
              {property.area && <div>{property.area} sq ft</div>}
              <div className="capitalize">
                {property.propertyType.toLowerCase()}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-2 md:mb-4">
                Description
              </h2>
              <p className="text-gray-700">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && (
              <div className="bg-white rounded-lg p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-2 md:mb-4">
                  Amenities
                </h2>
                <p className="text-gray-700">{property.amenities}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <PropertyReviewsClient
                propertyId={Number(property.id)}
                canSubmit={!!session && isTenant}
              />
            </div>
          </div>

          {/* Booking & Landlord Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-md top-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-4">
                ${property.rent}/month
              </div>
              <div className="flex items-center text-gray-600 mb-4 text-sm md:text-base">
                <Calendar className="h-4 w-4 mr-1" />
                Available from{" "}
                {property.availableDate
                  ? formatDate(property.availableDate)
                  : "Not specified"}
              </div>

              <div className="mt-4">
                <BookingFormClient
                  propertyId={Number(property.id)}
                  canSubmit={!!session && isTenant}
                />
              </div>
            </div>

            {/* Landlord Info */}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2 md:mb-4">
                Contact Landlord
              </h3>
              {property.landlord ? (
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {property.landlord.name}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    {property.landlord.email}
                  </div>
                  {property.landlord.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {property.landlord.phone}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  Landlord information not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import BookingFormClient from "@/components/BookingFormClient";
import PropertyReviewsClient from "@/components/PropertiesReviewClient";
