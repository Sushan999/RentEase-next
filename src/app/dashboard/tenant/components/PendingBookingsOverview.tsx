import React from "react";
import { Booking } from "../../../../types/booking";

interface PendingBookingsOverviewProps {
  bookings: Booking[];
  formatDate: (dateString: string) => string;
}

const PendingBookingsOverview: React.FC<PendingBookingsOverviewProps> = ({
  bookings,
  formatDate,
}) => {
  const pending = bookings.filter((b) => b.status === "PENDING");
  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Pending Bookings ({pending.length})
        </h2>
        <p className="text-gray-600 mt-1">Bookings awaiting approval</p>
      </div>
      {pending.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-lg">No pending bookings</div>
          <div className="text-gray-400 text-sm mt-1">All caught up! 🎉</div>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pending.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.property.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(booking.startDate)} -{" "}
                    {formatDate(booking.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
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

export default PendingBookingsOverview;
