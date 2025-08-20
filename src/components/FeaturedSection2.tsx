"use client";

"use client";
import { useEffect, useState } from "react";
import Title from "./Title";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturedSection2() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties?limit=4&order=desc");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
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
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sort by top reviewed (descending)
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
          {sortedProperties.map((property, idx) => (
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
          className="bg-blue-600 text-white py-3 px-12 mb-10 rounded hover:bg-blue-800 cursor-pointer inline-block"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
