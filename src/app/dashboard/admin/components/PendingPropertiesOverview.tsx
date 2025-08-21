import React from "react";
import Image from "next/image";
import { Property } from "@/types/property";

interface PendingPropertiesOverviewProps {
  pendingProperties: Property[];
  updating: number | null;
  handleUpdateStatus: (id: number, status: "APPROVED" | "REJECTED") => void;
  pendingLoading: boolean;
  refreshPendingProperties: () => void;
}

const PendingPropertiesOverview: React.FC<PendingPropertiesOverviewProps> = ({
  pendingProperties,
  updating,
  handleUpdateStatus,
  pendingLoading,
  refreshPendingProperties,
}) => {
  return (
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
                          <span className="text-gray-400 text-xs">No img</span>
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
                      {property.landlord?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.landlord?.email}
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
                          handleUpdateStatus(Number(property.id), "APPROVED")
                        }
                        disabled={updating === property.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === property.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(Number(property.id), "REJECTED")
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
  );
};

export default PendingPropertiesOverview;
