import React from "react";
import { Booking } from "@/types/booking";
import { MapPin, Bed, Bath, Calendar, Eye } from "lucide-react";
import Image from "next/image";

interface TenantPendingOverviewProps {
  bookings: Booking[];
  formatDate: (dateString: string) => string;
  handleCancelBooking: (bookingId: number) => void;
  updating: number | null;
}

const TenantPendingOverview: React.FC<TenantPendingOverviewProps> = ({
  bookings,
  formatDate,
  handleCancelBooking,
  updating,
}) => {
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Pending Applications ({pendingBookings.length})
          </h2>
          <p className="text-gray-600 mt-1">
            Bookings awaiting landlord approval
          </p>
        </div>
      </div>
      {pendingBookings.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">No pending applications</div>
          <div className="text-gray-400 text-sm mt-1">
            Your applications will appear here once submitted
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {pendingBookings.map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start space-x-4">
                  {booking.property.images.length > 0 ? (
                    <Image
                      src={booking.property.images[0].url}
                      alt={booking.property.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                      style={{ objectFit: "cover" }}
                      priority={true}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.property.location}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {booking.property.bedrooms} beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {booking.property.bathrooms} baths
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="text-xl font-bold text-blue-600 mb-2">
                    $
                    {typeof booking.property.rent === "number"
                      ? booking.property.rent.toLocaleString()
                      : "0"}{" "}
                    / month
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={updating === booking.id}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                    <a
                      href={`/properties/${booking.property.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantPendingOverview;
