import { Link } from "react-router-dom";
import { MapPin, Home, LogIn, UserPlus, Building2, LogOut, CalendarCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function PublicNavbar() {
  const { isAuthenticated, user, logout, hasAnyRole } = useAuth();

  return (
    <nav className="bg-white m-5 rounded-xl shadow-lg sticky top-5 z-50 border border-gray-300">
      <div className="mx-auto px-6 py-1.5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 flex items-center gap-1"
            >
              <MapPin className="w-7 h-7 text-blue-900" strokeWidth={2.5} />
              EasyVenue
            </Link>
          </div>

          <ul className="flex items-center space-x-5">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 py-2 rounded-lg"
              >
                <Home className="h-[18px] w-[18px]" />
                Home
              </Link>
            </li>
            {isAuthenticated && hasAnyRole("VENUE_USER") && (
              <>
                <li>
                  <Link
                    to="/venues"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 py-2 rounded-lg"
                  >
                    <MapPin className="h-[18px] w-[18px]" />
                    Venues
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 py-2 rounded-lg"
                  >
                    <CalendarCheck className="h-[18px] w-[18px]" />
                    My Bookings
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && hasAnyRole("VENUE_ADMIN", "ADMIN") && (
              <li>
                <Link
                  to="/admin/venues"
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 py-2 rounded-lg"
                >
                  <Building2 className="h-[18px] w-[18px]" />
                  Admin
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <li className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {user?.username || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 py-2 rounded-lg"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 py-2 rounded-lg"
                  >
                    <LogIn className="h-[18px] w-[18px]" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all duration-200"
                  >
                    <UserPlus className="h-[18px] w-[18px]" />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
