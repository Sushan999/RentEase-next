"use client";
import { BookingStats } from "@/types/stats";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MapPin, Bed, Bath, Calendar, Star, Eye, Clock } from "lucide-react";
import { Booking } from "@/types/booking";
import { toast } from "react-toastify";

export default function TenantDashboard() {
  const { data: session, status } = useSession();
  const [redirecting, setRedirecting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      status === "authenticated" &&
      session?.user?.role !== "TENANT"
    ) {
      setRedirecting(true);
      window.location.href = "/unauthorized";
    }
  }, [status, session]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/dashboard/tenant") &&
      (error === "Unauthorized" || error === "Failed to load your bookings")
    ) {
      setRedirecting(true);
      window.location.href = "/unauthorized";
    }
  }, [error]);

  useEffect(() => {
    if (!redirecting) {
      fetchBookings();
    }
  }, [redirecting]);

  useEffect(() => {
    fetchBookings();
  }, []);

  if (redirecting) return null;

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bookings");

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
      setPendingBookings(data.filter((b: Booking) => b.status === "PENDING"));
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings");
      setBookings([]);
      setPendingBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setUpdating(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" as const }
            : booking
        )
      );

      // Remove from pending if it was pending
      setPendingBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );

      toast.success("Booking cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Calculate booking statistics
  const stats: BookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    rejected: bookings.filter((b) => b.status === "REJECTED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            My Bookings Dashboard
          </h1>
          <p className="text-gray-600">
            Track your rental applications and booking history
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.total}
            </div>
            <div className="text-gray-700 font-medium">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.pending}
            </div>
            <div className="text-gray-700 font-medium">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.approved}
            </div>
            <div className="text-gray-700 font-medium">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.rejected}
            </div>
            <div className="text-gray-700 font-medium">Rejected</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-gray-500">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {stats.cancelled}
            </div>
            <div className="text-gray-700 font-medium">Cancelled</div>
          </div>
        </div>

        {/* Pending Bookings Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Pending Applications ({stats.pending})
              </h2>
              <p className="text-gray-600 mt-1">
                Bookings awaiting landlord approval
              </p>
            </div>
            <button
              onClick={fetchBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg">
                No pending applications
              </div>
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

        {/* All Bookings History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Booking History ({stats.total})
            </h2>
            <p className="text-gray-600 mt-1">
              Complete history of all your booking applications
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg">No bookings yet</div>
              <div className="text-gray-400 text-sm mt-1">
                Start browsing properties to make your first booking!
              </div>
              <Link
                href="/properties"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </Link>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {booking.property.images.length > 0 ? (
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
                              <span className="text-gray-400 text-xs">
                                No img
                              </span>
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
                              {booking.property.bedrooms}bed •{" "}
                              {booking.property.bathrooms}bath •{" "}
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
                          $
                          {typeof booking.property.rent === "number"
                            ? booking.property.rent.toLocaleString()
                            : "0"}{" "}
                          / month
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {booking.status === "PENDING" && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={updating === booking.id}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating === booking.id ? "..." : "Cancel"}
                            </button>
                          )}
                          <a
                            href={`/properties/${booking.property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs inline-flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Star className="h-5 w-5 mr-2" />
              Browse Properties
            </Link>
            <button
              onClick={fetchBookings}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <Clock className="h-5 w-5 mr-2" />
              Refresh Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
