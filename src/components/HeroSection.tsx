// components/HeroSection.tsx
import Image from "next/image";
import { Home, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] md:min-h-screen  justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8 py-48 md:py-24">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl  text-slate-900 leading-tight">
            Find Your
            <span className="block font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Perfect Home
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto  leading-relaxed">
            Discover exceptional properties in prime locations
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/properties"
            className="bg-blue-600 text-white rounded-md shadow-md px-8 py-4 hover:bg-blue-800 cursor-pointer  "
          >
            Get Started
          </Link>
        </div>

        <div className=" grid-cols-1 sm:grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto hidden md:grid mt-16">
          <div className="text-center space-y-2">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl sm:text-3xl  text-slate-900">1000+</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Properties
            </div>
          </div>
          <div className="text-center space-y-2">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl sm:text-3xl  text-slate-900">50+</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Cities
            </div>
          </div>
          <div className="text-center space-y-2">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl sm:text-3xl  text-slate-900">24/7</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Support
            </div>
          </div>
        </div>

        {/* //mobileee ko */}
        <div className="md:hidden flex justify-between px-4 mt-32">
          <div className="text-center space-y-2 ">
            <Home className="w-6 h-6 text-blue-600 mx-auto mb-3" />
            <div className="text-xl sm:text-3xl  text-slate-900">1000+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Properties
            </div>
          </div>
          <div className="text-center space-y-2">
            <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-3" />
            <div className="text-xl sm:text-3xl  text-slate-900">50+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Cities
            </div>
          </div>
          <div className="text-center space-y-2">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-3" />
            <div className="text-xl sm:text-3xl  text-slate-900">24/7</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Support
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="pt-12 ">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full mx-auto relative">
            <div className="w-1 h-3 bg-slate-400 rounded-full mx-auto mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
