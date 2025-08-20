"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { Filter, Search, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      setLoading(true);
      const res = await fetch("/api/properties?status=APPROVED");
      const data = await res.json();
      // Add rating and review count if reviews exist
      const mapped: Property[] = data.map(
        (p: {
          id: number;
          title: string;
          location: string;
          rent: number;
          bedrooms: number;
          bathrooms: number;
          images: { id: number; url: string; alt?: string }[];
          reviews?: { rating: number }[] | number;
          totalReviews?: number;
          createdAt: string;
          propertyType: string;
          approved?: "PENDING" | "APPROVED" | "REJECTED";
        }) => {
          const totalReviews =
            typeof p.totalReviews === "number"
              ? p.totalReviews
              : typeof p.reviews === "number"
              ? p.reviews
              : Array.isArray(p.reviews)
              ? p.reviews.length
              : 0;
          const rating =
            totalReviews > 0 && Array.isArray(p.reviews)
              ? p.reviews.reduce(
                  (sum: number, r: { rating: number }) => sum + r.rating,
                  0
                ) / totalReviews
              : 0;
          return {
            ...p,
            location: p.location,
            images: (p.images || []).map(
              (img: { id: number; url: string; alt?: string }) => ({
                id: img.id,
                url: img.url,
                alt: img.alt ?? "",
              })
            ),
            rating: Math.round(rating),
            totalReviews,
            approved: p.approved ?? "APPROVED",
            createdAt: p.createdAt,
          };
        }
      );
      setProperties(mapped);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filteredList = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "newest") {
      filteredList = filteredList.sort(
        (a, b) =>
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime()
      );
    } else if (sort === "oldest") {
      filteredList = filteredList.sort(
        (a, b) =>
          new Date(a.createdAt ?? "").getTime() -
          new Date(b.createdAt ?? "").getTime()
      );
    } else if (sort === "priceLow") {
      filteredList = filteredList.sort((a, b) => a.rent - b.rent);
    } else if (sort === "priceHigh") {
      filteredList = filteredList.sort((a, b) => b.rent - a.rent);
    } else if (sort === "rating") {
      filteredList = filteredList.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
      );
    }
    setFiltered([...filteredList]);
  }, [search, sort, properties]);

  const selectedOption =
    sortOptions.find((option) => option.value === sort) || sortOptions[0];

  return (
    <div className="min-h-screen container mx-auto py-8 px-4 md:px-12">
      <h1 className="text-2xl md:text-4xl  mb-6 text-gray-900">
        All Properties
      </h1>

      <div className="flex flex-col justify-between md:flex-row md:items-center gap-4 mb-6">
        {/* Search input with icon */}
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md px-4 py-2 w-full transition-colors shadow-sm bg-white"
          />
        </div>

        <div className="relative w-full md:w-1/7">
          <Listbox
            value={selectedOption}
            onChange={(opt) => setSort(opt.value)}
          >
            <div className="relative">
              <Listbox.Button className="flex items-center w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none">
                <Filter className="mr-2 text-gray-500" />
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none z-10">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading properties...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
