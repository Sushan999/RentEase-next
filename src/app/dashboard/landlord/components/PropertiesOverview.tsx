import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { Booking } from "@/types/booking";

interface PropertiesOverviewProps {
  properties: Property[];
  bookings: Booking[];
  formatCurrency: (amount: number) => string;
}

export default function PropertiesOverview({
  properties,
  bookings,
  formatCurrency,
}: PropertiesOverviewProps) {
  const totalProperties = properties.length;
  return (
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
          <div className="text-gray-500 text-lg">No properties listed yet</div>
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
  );
}
