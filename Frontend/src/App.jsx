import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VenueList from "./pages/user/VenueList";
import VenueDetails from "./pages/user/VenueDetails";
import BookingForm from "./pages/user/BookingForm";
import BookingSuccess from "./pages/user/BookingSuccess";
import MyBookings from "./pages/user/MyBookings";

// Admin Pages
import AdminVenueList from "./pages/admin/AdminVenueList";
import AddVenueForm from "./pages/admin/AddVenueForm";
import AvailabilityForm from "./pages/admin/AvailabilityForm";
import RecentBookings from "./pages/admin/RecentBookings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/venues"
          element={
            <ProtectedRoute roles={["VENUE_USER"]}>
              <VenueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues/:venueId"
          element={
            <ProtectedRoute>
              <VenueDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:venueId"
          element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:venueId/confirm"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute roles={["VENUE_USER"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Layout - VENUE_ADMIN or ADMIN only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["VENUE_ADMIN", "ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="venues" replace />} />
        <Route path="venues" element={<AdminVenueList />} />
        <Route path="venues/new" element={<AddVenueForm />} />
        <Route path="venues/:id/availability" element={<AvailabilityForm />} />
        <Route path="bookings/recent" element={<RecentBookings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
