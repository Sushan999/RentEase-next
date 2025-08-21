"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import AllBookingsHistoryOverview from "./components/AllBookingsHistoryOverview";
import LandlordSummaryCards from "./components/LandlordSummaryCards";
import PendingRequestsOverview from "./components/PendingRequestsOverview";
import PropertiesOverview from "./components/PropertiesOverview";
import { Property } from "@/types/property";
import { Booking } from "@/types/booking";
import { toast } from "react-toastify";
import axios from "axios";

export default function LandlordDashboard() {
  const { data: session, status } = useSession();
  const [redirecting, setRedirecting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get("/api/properties/my-properties"),
        axios.get("/api/bookings"),
      ]);
      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setProperties([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Booking action handler
  const handleBookingAction = async (
    bookingId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    setUpdatingBooking(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
      toast.success(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating booking:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error("You don't have permission to update this booking.");
      } else {
        toast.error("Failed to update booking. Please try again.");
      }
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Calculate statistics
  const totalProperties = properties.length;
  const pendingProperties = properties.filter(
    (p: Property) => p.approved === "PENDING"
  ).length;
  const approvedProperties = properties.filter(
    (p: Property) => p.approved === "APPROVED"
  ).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b: Booking) => b.status === "PENDING"
  ).length;
  const approvedBookings = bookings.filter(
    (b: Booking) => b.status === "APPROVED"
  ).length;
  const totalRevenue = bookings
    .filter((b: Booking) => b.status === "APPROVED" || b.status === "COMPLETED")
    .reduce((sum, booking) => {
      const days = Math.ceil(
        (new Date(booking.endDate).getTime() -
          new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const monthlyRent = booking.property.rent;
      return sum + (monthlyRent * days) / 30;
    }, 0);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-4xl text-gray-900 ">
            Landlord Dashboard
          </h1>
          <p className="text-gray-600">Manage your properties and bookings</p>
        </div>

        {/* Summary Cards */}

        <LandlordSummaryCards
          totalProperties={totalProperties}
          approvedProperties={approvedProperties}
          pendingProperties={pendingProperties}
          totalBookings={totalBookings}
          approvedBookings={approvedBookings}
          pendingBookings={pendingBookings}
          totalRevenue={totalRevenue}
          formatCurrency={formatCurrency}
        />

        {/* Pending Requests Overview */}
        <PendingRequestsOverview
          bookings={bookings}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          handleBookingAction={handleBookingAction}
          updatingBooking={updatingBooking}
        />
        {/* All Bookings History Overview */}
        <AllBookingsHistoryOverview
          bookings={bookings}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />

        {/* Properties Overview */}
        <PropertiesOverview
          properties={properties}
          bookings={bookings}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
