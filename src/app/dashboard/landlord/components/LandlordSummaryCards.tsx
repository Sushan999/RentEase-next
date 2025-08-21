import React from "react";
import { Home, Calendar, Clock, DollarSign } from "lucide-react";

interface LandlordSummaryCardsProps {
  totalProperties: number;
  approvedProperties: number;
  pendingProperties: number;
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  formatCurrency: (amount: number) => string;
}

const LandlordSummaryCards: React.FC<LandlordSummaryCardsProps> = ({
  totalProperties,
  approvedProperties,
  pendingProperties,
  totalBookings,
  approvedBookings,
  pendingBookings,
  totalRevenue,
  formatCurrency,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {totalProperties}
          </div>
          <div className="text-gray-700 font-medium">Total Properties</div>
          <div className="text-sm text-gray-500 mt-1">
            {approvedProperties} approved, {pendingProperties} pending
          </div>
        </div>
        <Home className="h-12 w-12 text-blue-500" />
      </div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {totalBookings}
          </div>
          <div className="text-gray-700 font-medium">Total Bookings</div>
          <div className="text-sm text-gray-500 mt-1">
            {approvedBookings} approved, {pendingBookings} pending
          </div>
        </div>
        <Calendar className="h-12 w-12 text-green-500" />
      </div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {pendingBookings}
          </div>
          <div className="text-gray-700 font-medium">Pending Requests</div>
          <div className="text-sm text-gray-500 mt-1">
            Awaiting your response
          </div>
        </div>
        <Clock className="h-12 w-12 text-yellow-500" />
      </div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-gray-700 font-medium">Est. Revenue</div>
          <div className="text-sm text-gray-500 mt-1">
            From confirmed bookings
          </div>
        </div>
        <DollarSign className="h-12 w-12 text-purple-500" />
      </div>
    </div>
  </div>
);

export default LandlordSummaryCards;
