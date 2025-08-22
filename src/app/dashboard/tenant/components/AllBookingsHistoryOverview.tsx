import React from "react";
import { Booking } from "@/types/booking";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface AllBookingsHistoryOverviewProps {
  bookings: Booking[];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

const AllBookingsHistoryOverview: React.FC<AllBookingsHistoryOverviewProps> = ({
  bookings,
  formatDate,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Booking History ({bookings.length})
        </h2>
        <p className="text-gray-600 mt-1">
          Complete history of all your booking applications
        </p>
      </div>
      {bookings.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-lg">No bookings yet</div>
          <div className="text-gray-400 text-sm mt-1">
            Start browsing properties to make your first booking!
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {booking.property.images &&
                      booking.property.images.length > 0 ? (
                        <Image
                          src={booking.property.images[0].url}
                          alt={booking.property.title}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                          style={{ objectFit: "cover" }}
                          priority={true}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 mr-4 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.property.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.property.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {booking.property.bedrooms} bed •{" "}
                          {booking.property.bathrooms} bath •{" "}
                          {booking.property.propertyType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatDate(booking.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(booking.property.rent)} / month
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(booking.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookingsHistoryOverview;
