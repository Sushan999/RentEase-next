"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Property } from "@/types/property";
import { Booking } from "@/types/booking";

export default function LandlordDashboard() {
  const { data: session, status } = useSession();
  const [redirecting, setRedirecting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingBooking, setUpdatingBooking] = useState<number | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      status === "authenticated" &&
      session?.user?.role !== "LANDLORD"
    ) {
      setRedirecting(true);
      window.location.href = "/unauthorized";
    }
  }, [status, session]);

  useEffect(() => {
    if (!redirecting) {
      fetchDashboard();
    }
  }, [redirecting]);

  if (redirecting) return null;

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get("/api/properties/my-properties"),
        axios.get("/api/bookings"),
      ]);

      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setProperties([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (
    bookingId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    setUpdatingBooking(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status });

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      alert(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating booking:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        alert("You don't have permission to update this booking.");
      } else {
        alert("Failed to update booking. Please try again.");
      }
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Calculate statistics
  const totalProperties = properties.length;
  const pendingProperties = properties.filter(
    (p) => p.approved === "PENDING"
  ).length;
  const approvedProperties = properties.filter(
    (p) => p.approved === "APPROVED"
  ).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const approvedBookings = bookings.filter(
    (b) => b.status === "APPROVED"
  ).length;
  const totalRevenue = bookings
    .filter((b) => b.status === "APPROVED" || b.status === "COMPLETED")
    .reduce((sum, booking) => {
      const days = Math.ceil(
        (new Date(booking.endDate).getTime() -
          new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const monthlyRent = booking.property.rent;
      return sum + (monthlyRent * days) / 30;
    }, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading landlord dashboard...</div>
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
            onClick={fetchDashboard}
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
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Landlord Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your properties and bookings
              </p>
            </div>

            <Link
              href="/dashboard/landlord/add-property"
              className=" px-4 py-2 md:px-8 md:py-4 rounded-md  bg-blue-600 text-white"
            >
              + Add Proerty
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {totalProperties}
                </div>
                <div className="text-gray-700 font-medium">
                  Total Properties
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {approvedProperties} approved, {pendingProperties} pending
                </div>
              </div>
              <Home className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {totalBookings}
                </div>
                <div className="text-gray-700 font-medium">Total Bookings</div>
                <div className="text-sm text-gray-500 mt-1">
                  {approvedBookings} approved, {pendingBookings} pending
                </div>
              </div>
              <Calendar className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {pendingBookings}
                </div>
                <div className="text-gray-700 font-medium">
                  Pending Requests
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Awaiting your response
                </div>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-gray-700 font-medium">Est. Revenue</div>
                <div className="text-sm text-gray-500 mt-1">
                  From confirmed bookings
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Pending Booking Requests */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Pending Booking Requests ({pendingBookings})
            </h2>
            <p className="text-gray-600 mt-1">
              Review and respond to booking requests
            </p>
          </div>

          {bookings.filter((b) => b.status === "PENDING").length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500 text-lg">
                No pending booking requests
              </div>
              <div className="text-gray-400 text-sm mt-1">
                All caught up! 🎉
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
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings
                    .filter((b) => b.status === "PENDING")
                    .map((booking) => {
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
                              {days} days
                            </div>
                            {booking.message && (
                              <div className="text-sm text-gray-600 mt-1 italic">
                                &quot;{booking.message}&quot;
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(revenue)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${booking.property.rent}/month
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleBookingAction(booking.id, "APPROVED")
                                }
                                disabled={updatingBooking === booking.id}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {updatingBooking === booking.id
                                  ? "..."
                                  : "Accept"}
                              </button>
                              <button
                                onClick={() =>
                                  handleBookingAction(booking.id, "REJECTED")
                                }
                                disabled={updatingBooking === booking.id}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                {updatingBooking === booking.id
                                  ? "..."
                                  : "Reject"}
                              </button>
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

        {/* All Bookings History */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              All Bookings ({totalBookings})
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
                    // Defensive: skip bookings with missing tenant or tenant.name
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
                            {days} days • Requested{" "}
                            {formatDate(booking.createdAt)}
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

        {/* Properties Overview */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Properties ({totalProperties})
            </h2>
            <p className="text-gray-600 mt-1">
              Overview of all your listed properties
            </p>
          </div>

          {properties.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500 text-lg">
                No properties listed yet
              </div>
              <div className="text-gray-400 text-sm mt-1">
                <Link
                  href="/dashboard/landlord/add-property"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add your first property →
                </Link>
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
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {property.images.length > 0 ? (
                            <Image
                              src={property.images[0].url}
                              alt={property.title}
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
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(property.rent)}/month
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.bedrooms}bed • {property.bathrooms}bath
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.approved === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : property.approved === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {property.approved}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property._count?.bookings ?? 0} total
                        </div>
                        <div className="text-sm text-gray-500">
                          {
                            bookings.filter(
                              (b) =>
                                b.property.id === property.id &&
                                b.status === "PENDING"
                            ).length
                          }{" "}
                          pending
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <a
                            href={`/properties/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                          >
                            View
                          </a>
                          <a
                            href={`/properties/${property.id}/edit`}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs"
                          >
                            Edit
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
      </div>
    </div>
  );
}
