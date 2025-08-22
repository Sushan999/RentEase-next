import React from "react";
import { Calendar, Clock } from "lucide-react";

interface TenantSummaryCardsProps {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  formatCurrency: (amount: number) => string;
  totalSpent: number;
}

const TenantSummaryCards: React.FC<TenantSummaryCardsProps> = ({
  totalBookings,
  pendingBookings,
  approvedBookings,
  formatCurrency,
  totalSpent,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {totalBookings}
            </div>
            <div className="text-gray-700 font-medium">Total Bookings</div>
          </div>
          <Calendar className="h-12 w-12 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {pendingBookings}
            </div>
            <div className="text-gray-700 font-medium">Pending</div>
          </div>
          <Clock className="h-12 w-12 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {approvedBookings}
            </div>
            <div className="text-gray-700 font-medium">Approved</div>
          </div>
          <Calendar className="h-12 w-12 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-gray-700 font-medium">Total Spent</div>
          </div>
          <Calendar className="h-12 w-12 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default TenantSummaryCards;
