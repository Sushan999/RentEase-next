import React from "react";
import Image from "next/image";
import { Booking } from "@/types/booking";

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
          All Bookings ({bookings.length})
        </h2>
        <p className="text-gray-600 mt-1">
          Complete booking history for your properties
        </p>
      </div>
      {bookings.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-lg">No bookings yet</div>
          <div className="text-gray-400 text-sm mt-1">
            Bookings will appear here once tenants make requests
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
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => {
                if (!booking.tenant || !booking.tenant.name) return null;
                const days = Math.ceil(
                  (new Date(booking.endDate).getTime() -
                    new Date(booking.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const revenue = (booking.property.rent * days) / 30;
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {booking.property.images.length > 0 ? (
                          <Image
                            src={booking.property.images[0].url}
                            alt={booking.property.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            style={{ objectFit: "cover" }}
                            priority={true}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 mr-3 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No img
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.tenant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {days} days • Requested {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : booking.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "CANCELLED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(revenue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${booking.property.rent}/month
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookingsHistoryOverview;
