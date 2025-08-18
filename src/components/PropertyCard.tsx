// src/components/PropertyCard.tsx
import { Property } from "@/types/property";
import Link from "next/link";
import { Star, Bed, Bath, Home, Square, MapPin } from "lucide-react";

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0]?.url || "/placeholder.png";

  // Render stars visually
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-100 shadow-md">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {property.propertyType}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${property.rent.toLocaleString()}/month
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">{property.city}</span>
          </div>

          {/* Property Details */}
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

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              {renderStars(property.rating || 0)}
              <span className="text-gray-500 text-xs ml-1">
                ({property.reviews})
              </span>
            </div>

            {/* Availability Status */}
            <span className="text-blue-600 text-sm font-medium">
              Available Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
