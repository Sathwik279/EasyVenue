import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import {
  Calendar,
  Clock,
  Building2,
  IndianRupee,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
} from "lucide-react";

export default function MyBookings() {
  const { myBookings, loading, errors, fetchMyBookings } = useData();

  useEffect(() => {
    fetchMyBookings().catch(() => {});
  }, [fetchMyBookings]);

  const bookingList = myBookings;

  if (loading.myBookings) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  const error = errors.myBookings;
  if (error) {
    return (
      <div className="min-h-[80vh] max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-8 max-w-sm mx-4 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Failed to load bookings
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const confirmedCount = bookingList.filter((b) => b.status === "CONFIRMED").length;
  const totalSpent = bookingList.reduce((sum, b) => sum + (b.totalCost || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600 text-lg">
            View and manage your venue bookings
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {bookingList.length} Total
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {confirmedCount} Confirmed
            </span>
            <Link
              to="/venues"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <MapPin className="h-4 w-4" />
              Browse Venues
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookingList.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <IndianRupee className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {bookingList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Browse venues and make your first booking to see them here.
              </p>
              <Link
                to="/venues"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <MapPin className="h-5 w-5" />
                Browse Venues
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingList.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.venue?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.venue?.location || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {new Date(booking.bookingDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">
                            {booking.hoursBooked}{" "}
                            {booking.hoursBooked === 1 ? "hour" : "hours"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-semibold">
                            ₹{booking.totalCost?.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status === "CONFIRMED" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/venues/${booking.venue?.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Venue
                        </Link>
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
