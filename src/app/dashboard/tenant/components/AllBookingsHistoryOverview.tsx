import React from "react";
import { Booking } from "../../../../types/booking";

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
          All Bookings History ({bookings.length})
        </h2>
        <p className="text-gray-600 mt-1">Your complete booking history</p>
      </div>
      {bookings.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-lg">No bookings found</div>
          <div className="text-gray-400 text-sm mt-1">
            Start booking your next stay!
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.property.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(booking.startDate)} -{" "}
                    {formatDate(booking.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(booking.property.rent)}
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
