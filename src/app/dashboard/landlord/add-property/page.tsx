"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ImageInput = {
  url: string;
  alt?: string;
};

export default function AddPropertyForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [amenities, setAmenities] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [images, setImages] = useState<ImageInput[]>([{ url: "", alt: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // sabai ekeichoti
  const inputStyle =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm " +
    "placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  if (!session || session.user.role !== "LANDLORD") {
    return (
      <div className="text-red-600 text-center mt-10">
        Only landlords can add properties.
      </div>
    );
  }

  const handleAddImage = () => setImages([...images, { url: "", alt: "" }]);
  const handleRemoveImage = (index: number) =>
    setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (
    index: number,
    field: "url" | "alt",
    value: string
  ) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          rent,
          bedrooms,
          bathrooms,
          area,
          propertyType,
          amenities,
          availableDate,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create property");

      alert("Success");
      router.push(`/dashboard/landlord`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 py-2 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-center mb-6 text-gray-800">
        Add New Property
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputStyle}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={inputStyle}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Rent"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Bathrooms"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Area (sq ft)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputStyle}
          />
        </div>

        {/* Property Type & Available Date on the same line */}
        <div className="grid grid-cols-2 gap-4">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={inputStyle}
          >
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="STUDIO">Studio</option>
            <option value="ROOM">Room</option>
            <option value="VILLA">Villa</option>
          </select>

          <input
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        <textarea
          placeholder="Amenities (comma separated)"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          className={inputStyle}
        />

        <div>
          <h4 className="font-medium mb-2 text-gray-700">Images</h4>
          {images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL"
                value={img.url}
                onChange={(e) =>
                  handleImageChange(index, "url", e.target.value)
                }
                className={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Alt text"
                value={img.alt}
                onChange={(e) =>
                  handleImageChange(index, "alt", e.target.value)
                }
                className={inputStyle}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-600 text-white px-3 rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2"
          >
            Add Another Image
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 mt-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
