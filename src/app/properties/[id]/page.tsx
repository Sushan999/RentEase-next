import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Metadata } from "next";
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
import BookingForm from "@/components/BookingFormClient";
import PropertyReviewsClient from "@/components/PropertiesReviewClient";
import { Property } from "@/types/property";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: paramId } = await params;

  if (!paramId || isNaN(Number(paramId)) || Number(paramId) <= 0) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found",
    };
  }

  const property = await prisma.property.findUnique({
    where: { id: Number(paramId) },
  });

  return {
    title: property?.title || "Property Detail",
    description: property?.description || "View property details",
  };
}

export default async function PropertyPage({ params }: Props) {
  const { id: paramId } = await params;

  if (!paramId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Invalid property ID</h1>
      </div>
    );
  }

  const id = Number(paramId);
  if (isNaN(id) || id <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Invalid property ID</h1>
      </div>
    );
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
      </div>
    );
  }

  const property: Property = {
    ...propertyRaw,
    area: propertyRaw.area ?? undefined,
    amenities: propertyRaw.amenities ?? undefined,
    reviews:
      propertyRaw.reviews?.map((r) => ({
        ...r,
        comment: r.comment ?? undefined,
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
      })) ?? [],
    createdAt:
      propertyRaw.createdAt instanceof Date
        ? propertyRaw.createdAt.toISOString()
        : propertyRaw.createdAt,
    averageRating:
      propertyRaw.reviews.length > 0
        ? propertyRaw.reviews.reduce((a, b) => a + b.rating, 0) /
          propertyRaw.reviews.length
        : 0,
    totalReviews: propertyRaw.reviews.length,
  };

  const session = await getServerSession(authOptions);
  const isTenant = session?.user.role === "TENANT";

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
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
              {renderStars(Math.round(property.averageRating ?? 0))}
              <span className="text-gray-600 text-sm">
                ({property.totalReviews} reviews)
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
            <PropertyReviewsClient
              propertyId={Number(property.id)}
              canReview={isTenant}
            />
          </div>

          {/* Booking & Landlord Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-md top-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-4">
                ${property.rent}/month
              </div>
              <div className="flex items-center text-gray-600 mb-4 text-sm md:text-base">
                <Calendar className="h-4 w-4 mr-1" />
                Available from {formatDate(property.availableDate ?? "")}
              </div>

              {isTenant && (
                <div className="sticky top-4">
                  <BookingForm propertyId={property.id.toString()} />
                </div>
              )}
            </div>

            {/* Landlord Info */}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2 md:mb-4">
                Contact Landlord
              </h3>
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {property.landlord?.name}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  {property.landlord?.email}
                </div>
                {property.landlord?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                    {property.landlord.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
