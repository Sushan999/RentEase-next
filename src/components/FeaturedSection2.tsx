// app/components/FeaturedSection2.tsx
"use client";

import { useEffect, useState } from "react";
import Title from "./Title";
import PropertyCard from "./PropertyCard";
import Link from "next/link";
import { Property } from "@/types/property";
import { getTopRatedProperties } from "@/lib/serverAction";

export default function FeaturedSection2() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getTopRatedProperties();
      // Sort by rating descending
      data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      setProperties(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="text-center py-12">Loading top-rated properties...</p>;
  }

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
