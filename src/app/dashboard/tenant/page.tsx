"use client";
import TenantSummaryCards from "./components/TenantSummaryCards";
import TenantPendingOverview from "./components/TenantPendingOverview";
import AllBookingsHistoryOverview from "./components/AllBookingsHistoryOverview";

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
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
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
        <TenantSummaryCards
          totalBookings={stats.total}
          pendingBookings={stats.pending}
          approvedBookings={stats.approved}
          formatCurrency={(amount) =>
            amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          }
          totalSpent={bookings
            .filter((b) => b.status === "APPROVED" || b.status === "COMPLETED")
            .reduce((sum, b) => {
              const days = Math.ceil(
                (new Date(b.endDate).getTime() -
                  new Date(b.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const monthlyRent = b.property.rent;
              return sum + (monthlyRent * days) / 30;
            }, 0)}
        />

        {/* Pending Bookings Section */}
        <TenantPendingOverview
          bookings={bookings}
          formatDate={formatDate}
          handleCancelBooking={handleCancelBooking}
          updating={updating}
        />

        {/* All Bookings History */}
        <AllBookingsHistoryOverview
          bookings={bookings}
          formatDate={formatDate}
          formatCurrency={(amount) =>
            amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          }
        />

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
