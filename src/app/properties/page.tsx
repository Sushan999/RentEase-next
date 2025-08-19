"use client";

import { useEffect, useState } from "react";
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
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      setLoading(true);
      const res = await fetch("/api/properties?status=APPROVED");
      const data = await res.json();
      // Add rating and review count if reviews exist
      const mapped = data.map((p: any) => {
        const totalReviews = p.reviews?.length || 0;
        const rating =
          totalReviews > 0
            ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              totalReviews
            : 0;
        return {
          ...p,
          city: p.location,
          rating: Math.round(rating),
          reviews: totalReviews,
        };
      });
      setProperties(mapped);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filteredList = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "newest") {
      filteredList = filteredList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === "oldest") {
      filteredList = filteredList.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sort === "priceLow") {
      filteredList = filteredList.sort((a, b) => a.rent - b.rent);
    } else if (sort === "priceHigh") {
      filteredList = filteredList.sort((a, b) => b.rent - a.rent);
    } else if (sort === "rating") {
      filteredList = filteredList.sort((a, b) => b.rating - a.rating);
    }
    setFiltered([...filteredList]);
  }, [search, sort, properties]);

  const selectedOption =
    sortOptions.find((option) => option.value === sort) || sortOptions[0];

  return (
    <div className="min-h-screen container mx-auto py-8 px-4 md:px-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Properties</h1>

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
        <div className="text-gray-500">Loading properties...</div>
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
