"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Title from "./Title";
import PropertyCard from "./PropertyCard";
import { useAppContext } from "@/context/AppContext";

export default function FeaturedSection2() {
  const { properties, propertiesLoading, propertiesError } = useAppContext();

  if (propertiesLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Title
            title="Our Top Rated Properties"
            subtitle="Discover our Properties with Top Ratings"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-lg h-64"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (propertiesError) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center text-red-500">
          <p>{propertiesError}</p>
        </div>
      </section>
    );
  }

  // Sort properties by top reviews descending
  const sortedProperties = [...properties].sort(
    (a, b) => (b.totalReviews ?? 0) - (a.totalReviews ?? 0)
  );

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Title
          title="Our Top Rated Properties"
          subtitle="Discover our Properties with Top Ratings"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProperties.slice(0, 4).map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="text-center mt-12">
        <Link
          href="/properties"
          className="bg-blue-600 text-white py-3 px-12 mb-10 rounded hover:bg-blue-800 inline-block"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
