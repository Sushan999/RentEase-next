import React from "react";
import Image from "next/image";
import { Property } from "@/types/property";

interface PropertiesHistoryOverviewProps {
  properties: Property[];
  updating: number | null;
  handleUpdateStatus: (id: number, status: "APPROVED" | "REJECTED") => void;
}

const PropertiesHistoryOverview: React.FC<PropertiesHistoryOverviewProps> = ({
  properties,
  updating,
  handleUpdateStatus,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          All Properties ({properties.length})
        </h2>
        <p className="text-gray-600 mt-1">
          Complete property management history
        </p>
      </div>
      {properties.length === 0 ? (
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
              {properties.map((property) => (
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
                          <span className="text-gray-400 text-xs">No img</span>
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
                              handleUpdateStatus(
                                Number(property.id),
                                "APPROVED"
                              )
                            }
                            disabled={updating === property.id}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === property.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                Number(property.id),
                                "REJECTED"
                              )
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
  );
};

export default PropertiesHistoryOverview;
