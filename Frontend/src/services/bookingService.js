// frontend/src/services/bookingService.js
import apiClient from "./apiClient";

// Create a booking
export const createBooking = (bookingData) => {
  console.log("Sending booking data:", bookingData);
  return apiClient.post("/bookings", bookingData).then((res) => res.data);
};

// Get recent bookings (admin's own bookings or context-specific)
export const getRecentBookings = () =>
  apiClient.get("/bookings/recent").then((res) => res.data);

// Get current user's bookings (VENUE_USER only)
export const getMyBookings = () =>
  apiClient.get("/bookings/getMyBookings").then((res) => res.data);
