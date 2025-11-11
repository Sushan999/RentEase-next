"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { Booking } from "@/types/booking";
import { User } from "@/types/user";
import { toast } from "react-toastify";
import axios from "axios";
import UserManagementOverview from "./components/UserManagementOverview";
import PropertiesHistoryOverview from "./components/PropertiesHistoryOverview";
import PendingPropertiesOverview from "./components/PendingPropertiesOverview";
import AdminSummaryCards from "./components/AdminSummaryCards";
import { useAppContext } from "@/context/AppContext";

export default function AdminDashboard() {
  const { session, status } = useAppContext();

  const router = useRouter();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [updatingUser, setUpdatingUser] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/unauthorized");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.replace("/unauthorized");
      return;
    }

    fetchDashboard();
  }, [session, status]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [approvedRes, pendingRes, rejectedRes, usersRes, bookingsRes] =
        await Promise.all([
          axios.get("/api/properties"),
          axios.get("/api/properties?status=PENDING"),
          axios.get("/api/properties?status=REJECTED"),
          axios.get("/api/users"),
          axios.get("/api/bookings"),
        ]);

      const approvedData = approvedRes.data;
      const pendingData = pendingRes.data;
      const rejectedData = rejectedRes.data;
      const usersData = usersRes.data;
      const bookingsData = bookingsRes.data;

      const allProps = [...approvedData, ...pendingData, ...rejectedData];
      setAllProperties(allProps);
      setPendingProperties(pendingData);
      setUsers(usersData);
      setAllBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setAllProperties([]);
      setPendingProperties([]);
      setUsers([]);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshPendingProperties = async () => {
    setPendingLoading(true);
    try {
      const response = await axios.get("/api/properties");
      const data = response.data;
      setAllProperties(data);
      setPendingProperties(
        data.filter((p: Property) => p.approved === "PENDING")
      );
    } catch (err) {
      console.error("Error refreshing pending properties:", err);
    } finally {
      setPendingLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    setUpdating(id);
    try {
      await axios.put(`/api/properties/${id}`, { approved: status });

      setAllProperties((prev) =>
        prev.map((property) =>
          property.id === id ? { ...property, approved: status } : property
        )
      );
      setPendingProperties((prev) =>
        prev.filter((property) => property.id !== id)
      );
      toast.success(`Property ${status.toLowerCase()} successfully!`);
    } catch (err: unknown) {
      console.error("Error updating property status:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error(
          "You don't have permission to update this property status."
        );
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleBlockUser = async (userId: number, blocked: boolean) => {
    setUpdatingUser(userId);
    try {
      await axios.put("/api/users", { userId, blocked: !blocked });
      const usersRes = await axios.get("/api/users");
      setUsers(usersRes.data);
      toast.success(`User ${!blocked ? "blocked" : "unblocked"} successfully!`);
    } catch (err: unknown) {
      console.error("Error updating user status:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error("You don't have permission to update user status.");
      } else {
        toast.error("Failed to update user status. Please try again.");
      }
    } finally {
      setUpdatingUser(null);
    }
  };

  // Derived data
  const approvedProperties = allProperties.filter(
    (p) => p.approved === "APPROVED"
  );
  const rejectedProperties = allProperties.filter(
    (p) => p.approved === "REJECTED"
  );
  const adminUsers = users.filter((u) => u.role === "ADMIN");
  const landlordUsers = users.filter((u) => u.role === "LANDLORD");
  const tenantUsers = users.filter((u) => u.role === "TENANT");

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage properties and monitor platform activity
          </p>
        </div>

        <AdminSummaryCards
          totalProperties={allProperties.length}
          approvedProperties={approvedProperties.length}
          pendingProperties={pendingProperties.length}
          rejectedProperties={rejectedProperties.length}
          totalUsers={users.length}
          adminUsers={adminUsers.length}
          landlordUsers={landlordUsers.length}
          tenantUsers={tenantUsers.length}
        />

        <PendingPropertiesOverview
          pendingProperties={pendingProperties}
          updating={updating}
          handleUpdateStatus={handleUpdateStatus}
          pendingLoading={pendingLoading}
          refreshPendingProperties={refreshPendingProperties}
        />

        <UserManagementOverview
          users={users}
          updatingUser={updatingUser}
          handleToggleBlockUser={handleToggleBlockUser}
        />

        <PropertiesHistoryOverview
          properties={allProperties}
          bookings={allBookings}
          updating={updating}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
