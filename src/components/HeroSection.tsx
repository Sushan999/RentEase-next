// components/HeroSection.tsx
import Image from "next/image";
export function HeroSection() {
  return (
    <section className="relative bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
          alt="Modern apartment buildings and residential complex"
          fill
          className="w-full h-full object-cover opacity-40"
          style={{ objectFit: "cover" }}
          priority={true}
        />
        {/* Make sure to import Image from next/image at the top */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-[80vh] px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
          Find Your Dream Home
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
          Browse, book, and rent apartments, flats, and houses with ease.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search by city or property..."
            className="flex-1 px-4 py-3 text-gray-800 outline-none"
          />
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
