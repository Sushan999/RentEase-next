"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Property {
  id: number;
  title: string;
  approved: "PENDING" | "APPROVED" | "REJECTED";
  landlord: { id: number; name: string; email: string };
  images: { url: string }[];
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [redirecting, setRedirecting] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [updatingUser, setUpdatingUser] = useState<number | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/dashboard/admin") &&
      (error === "Unauthorized" || error === "Failed to load dashboard data")
    ) {
      setRedirecting(true);
      window.location.href = "/unauthorized";
    }
  }, [error]);

  useEffect(() => {
    if (!redirecting) {
      fetchDashboard();
    }
  }, [redirecting]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (redirecting) return null;

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all property statuses and users
      const [approvedRes, pendingRes, rejectedRes, usersRes] =
        await Promise.all([
          fetch("/api/properties"), // Approved properties (default)
          fetch("/api/properties?status=PENDING"), // Pending properties
          fetch("/api/properties?status=REJECTED"), // Rejected properties
          fetch("/api/users"),
        ]);

      if (
        !approvedRes.ok ||
        !pendingRes.ok ||
        !rejectedRes.ok ||
        !usersRes.ok
      ) {
        throw new Error("Failed to fetch data");
      }

      const [approvedData, pendingData, rejectedData, usersData] =
        await Promise.all([
          approvedRes.json(),
          pendingRes.json(),
          rejectedRes.json(),
          usersRes.json(),
        ]);

      // Combine all for history and summary
      const allProps = [...approvedData, ...pendingData, ...rejectedData];
      setAllProperties(allProps);
      setPendingProperties(pendingData);
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setAllProperties([]);
      setPendingProperties([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh pending properties by re-filtering from all properties
  const refreshPendingProperties = async () => {
    setPendingLoading(true);
    try {
      const response = await fetch("/api/properties");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
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
      // Update property status
      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: status }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert("You don't have permission to update this property status.");
          return;
        }
        throw new Error("Failed to update property status");
      }

      // Update both local states
      setAllProperties((prev) =>
        prev.map((property) =>
          property.id === id ? { ...property, approved: status } : property
        )
      );

      // Remove from pending properties since it's no longer pending
      setPendingProperties((prev) =>
        prev.filter((property) => property.id !== id)
      );

      alert(`Property ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating property status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleBlockUser = async (userId: number, blocked: boolean) => {
    setUpdatingUser(userId);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, blocked: !blocked }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("You don't have permission to update user status.");
          return;
        }
        throw new Error("Failed to update user status");
      }

      // Refetch users from backend to ensure UI matches DB
      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      alert(`User ${!blocked ? "blocked" : "unblocked"} successfully!`);
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    } finally {
      setUpdatingUser(null);
    }
  };

  // Calculate stats from all properties
  const approvedProperties = allProperties.filter(
    (p) => p.approved === "APPROVED"
  );
  const rejectedProperties = allProperties.filter(
    (p) => p.approved === "REJECTED"
  );

  // Filter users by role
  const adminUsers = users.filter((u) => u.role === "ADMIN");
  const landlordUsers = users.filter((u) => u.role === "LANDLORD");
  const tenantUsers = users.filter((u) => u.role === "TENANT");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading admin dashboard...</div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage properties and monitor platform activity
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {allProperties.length}
            </div>
            <div className="text-gray-700 font-medium">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {approvedProperties.length}
            </div>
            <div className="text-gray-700 font-medium">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {pendingProperties.length}
            </div>
            <div className="text-gray-700 font-medium">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {rejectedProperties.length}
            </div>
            <div className="text-gray-700 font-medium">Rejected</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {users.length}
            </div>
            <div className="text-gray-700 font-medium">Total Users</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-indigo-500">
            <div className="text-xl font-bold text-indigo-600 mb-1">
              {adminUsers.length} | {landlordUsers.length} |{" "}
              {tenantUsers.length}
            </div>
            <div className="text-gray-700 font-medium text-sm">
              Admin | Landlord | Tenant
            </div>
          </div>
        </div>

        {/* Pending Properties Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Pending Properties ({pendingProperties.length})
              </h2>
              <p className="text-gray-600 mt-1">Properties awaiting approval</p>
            </div>
            <button
              onClick={refreshPendingProperties}
              disabled={pendingLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {pendingLoading ? "Refreshing..." : "Refresh Pending"}
            </button>
          </div>

          {pendingProperties.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500 text-lg">No pending properties</div>
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
                      Landlord
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingProperties.map((property) => (
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
                              ID: {property.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.landlord.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.landlord.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${property.rent}/month
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.bedrooms}bed • {property.bathrooms}bath
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(property.id, "APPROVED")
                            }
                            disabled={updating === property.id}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === property.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(property.id, "REJECTED")
                            }
                            disabled={updating === property.id}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === property.id ? "..." : "Reject"}
                          </button>
                          <a
                            href={`/properties/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
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

        {/* Users Management Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              User Management ({users.length})
            </h2>
            <p className="text-gray-600 mt-1">
              Manage user roles and permissions
            </p>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500 text-lg">No users found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                            <span className="text-gray-600 font-medium text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "LANDLORD"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleToggleBlockUser(user.id, user.blocked)
                          }
                          disabled={updatingUser === user.id}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
                            user.blocked
                              ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                              : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updatingUser === user.id
                            ? "Updating..."
                            : user.blocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Properties History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              All Properties ({allProperties.length})
            </h2>
            <p className="text-gray-600 mt-1">
              Complete property management history
            </p>
          </div>

          {allProperties.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500 text-lg">No properties found</div>
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
                      Landlord
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {property.images && property.images.length > 0 ? (
                            <Image
                              src={property.images[0].url}
                              alt={property.title}
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
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.landlord?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.landlord?.email || "N/A"}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {property.approved === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(property.id, "APPROVED")
                                }
                                disabled={updating === property.id}
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updating === property.id ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(property.id, "REJECTED")
                                }
                                disabled={updating === property.id}
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updating === property.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                          <a
                            href={`/properties/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                          >
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
      </div>
    </div>
  );
}
