import { request } from "./httpClient";

// Create a booking
export const createBooking = (bookingData) =>
  request("/bookings", {
    method: "POST",
    body: bookingData,
  });

// Get recent bookings (admin's own bookings or context-specific)
export const getRecentBookings = () => request("/bookings/recent");

// Get current user's bookings (VENUE_USER only)
export const getMyBookings = () => request("/bookings/getMyBookings");
