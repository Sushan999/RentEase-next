import React from "react";

interface AdminSummaryCardsProps {
  totalProperties: number;
  approvedProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  totalUsers: number;
  adminUsers: number;
  landlordUsers: number;
  tenantUsers: number;
}

const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = ({
  totalProperties,
  approvedProperties,
  pendingProperties,
  rejectedProperties,
  totalUsers,
  adminUsers,
  landlordUsers,
  tenantUsers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
        <div className="text-3xl font-bold text-blue-600 mb-1">
          {totalProperties}
        </div>
        <div className="text-gray-700 font-medium">Total Properties</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
        <div className="text-3xl font-bold text-green-600 mb-1">
          {approvedProperties}
        </div>
        <div className="text-gray-700 font-medium">Approved</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
        <div className="text-3xl font-bold text-yellow-600 mb-1">
          {pendingProperties}
        </div>
        <div className="text-gray-700 font-medium">Pending Review</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
        <div className="text-3xl font-bold text-red-600 mb-1">
          {rejectedProperties}
        </div>
        <div className="text-gray-700 font-medium">Rejected</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
        <div className="text-3xl font-bold text-purple-600 mb-1">
          {totalUsers}
        </div>
        <div className="text-gray-700 font-medium">Total Users</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-indigo-500">
        <div className="text-xl font-bold text-indigo-600 mb-1">
          {adminUsers} | {landlordUsers} | {tenantUsers}
        </div>
        <div className="text-gray-700 font-medium text-sm">
          Admin | Landlord | Tenant
        </div>
      </div>
    </div>
  );
};

export default AdminSummaryCards;
