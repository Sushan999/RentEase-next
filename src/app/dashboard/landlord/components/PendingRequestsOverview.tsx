import React from "react";
import { Booking } from "@/types/booking";

interface PendingRequestsOverviewProps {
  bookings: Booking[];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  handleBookingAction: (
    bookingId: number,
    status: "APPROVED" | "REJECTED"
  ) => void;
  updatingBooking: number | null;
}

const PendingRequestsOverview: React.FC<PendingRequestsOverviewProps> = ({
  bookings,
  formatDate,
  formatCurrency,
  handleBookingAction,
  updatingBooking,
}) => {
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Pending Booking Requests ({pendingBookings.length})
        </h2>
        <p className="text-gray-600 mt-1">Bookings awaiting your approval</p>
      </div>
      {pendingBookings.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-lg">No pending requests</div>
          <div className="text-gray-400 text-sm mt-1">All caught up! 🎉</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.property?.images &&
                    booking.property.images.length > 0 ? (
                      <img
                        src={booking.property.images[0].url}
                        alt={booking.property.title}
                        className="h-12 w-12 rounded-lg object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.tenant?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.tenant?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.property?.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.property?.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.startDate)} -{" "}
                      {formatDate(booking.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(booking.property?.rent ?? 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleBookingAction(booking.id, "APPROVED")
                        }
                        disabled={updatingBooking === booking.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingBooking === booking.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() =>
                          handleBookingAction(booking.id, "REJECTED")
                        }
                        disabled={updatingBooking === booking.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingBooking === booking.id ? "..." : "Reject"}
                      </button>
                    </div>
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

export default PendingRequestsOverview;
