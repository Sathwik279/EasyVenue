import { request } from "./httpClient";

// Create new venue (Admin)
export const createVenue = (venueData) =>
  request("/venues", {
    method: "POST",
    body: venueData,
  });

// Get all venues
export const getAllVenues = () => request("/venues");

// Get venue by ID
export const getVenueById = (id) => request(`/venues/${id}`);

// For Admin Only
export const getAdminVenues = () => request("/venues/getAdminVenues");

// Update venue availability (Admin)
export const updateVenueAvailability = (id, availabilityData) =>
  request(`/venues/${id}/availability`, {
    method: "PUT",
    body: availabilityData,
  });
