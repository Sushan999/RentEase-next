"use client";
import { PropertyCardProps } from "@/types/component-props";

import Link from "next/link";
import { Star, Bed, Bath, Square, MapPin } from "lucide-react";
import Image from "next/image";

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0]?.url || "/placeholder.png";

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rounded ? "text-yellow-400" : "text-gray-300"}
        fill={i < rounded ? "#facc15" : "none"}
        stroke={i < rounded ? "#facc15" : "#d1d5db"}
      />
    ));
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-100 shadow-md">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            width={400}
            height={192}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            style={{ objectFit: "cover" }}
            priority={true}
          />

          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {property.propertyType}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${property.rent.toLocaleString()}/month
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center  gap-6 text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            {property.area && (
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {property.area} sqft
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Rating */}

            <div className="flex items-center space-x-1">
              {renderStars(
                typeof property.averageRating === "number"
                  ? property.averageRating
                  : property.rating || 0
              )}
              <span className="text-gray-500 text-xs ml-1">
                (
                {property.totalReviews ??
                  (typeof property.reviews === "number"
                    ? property.reviews
                    : Array.isArray(property.reviews)
                    ? property.reviews.length
                    : 0)}{" "}
                reviews)
              </span>
            </div>

            <span className="text-blue-600 text-sm font-medium">
              Available Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
