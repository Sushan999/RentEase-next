"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";

import { Property } from "@/types/property";
import { Booking } from "@/types/booking";

import LandlordSummaryCards from "./components/LandlordSummaryCards";
import PendingRequestsOverview from "./components/PendingRequestsOverview";
import AllBookingsHistoryOverview from "./components/AllBookingsHistoryOverview";
import PropertiesOverview from "./components/PropertiesOverview";

export default function LandlordDashboard() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "LANDLORD") {
      window.location.href = "/unauthorized";
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role === "LANDLORD") {
      fetchDashboard();
    }
  }, [status, session]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get("/api/properties/my-properties"),
        axios.get("/api/bookings"),
      ]);
      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
      console.log("Bookings after approval:", bookingsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setProperties([]);
      setBookings([]);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Formatters
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
      // Re-fetch bookings to ensure revenue and state are up-to-date
      const bookingsRes = await axios.get("/api/bookings");
      setBookings(bookingsRes.data);
      toast.success(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error("Failed to update booking");
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Stats
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
  console.log("Bookings for revenue calculation:", bookings);
  const totalRevenue = bookings
    .filter((b) => ["APPROVED", "COMPLETED"].includes(b.status))
    .reduce((sum, booking) => {
      const days = Math.ceil(
        (new Date(booking.endDate).getTime() -
          new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const monthlyRent = booking.property.rent;
      return sum + (monthlyRent * days) / 30;
    }, 0);

  if (status === "loading" || loading) {
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
        <h1 className="text-2xl md:text-4xl text-gray-900 mb-2">
          Landlord Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your properties and bookings
        </p>

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

        <PendingRequestsOverview
          bookings={bookings}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          handleBookingAction={handleBookingAction}
          updatingBooking={updatingBooking}
        />

        <AllBookingsHistoryOverview
          bookings={bookings}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />

        <PropertiesOverview
          properties={properties}
          bookings={bookings}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
