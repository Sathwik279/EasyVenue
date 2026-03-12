/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createVenue,
  getAdminVenues,
  getAllVenues,
  getVenueById,
  updateVenueAvailability,
} from "../services/venueService";
import {
  createBooking,
  getMyBookings,
  getRecentBookings,
} from "../services/bookingService";

const DataContext = createContext(null);

function applyAvailabilityUpdates(unavailableDates = [], updates = {}) {
  const nextDates = new Set(unavailableDates);

  (updates.blockDates || []).forEach((date) => nextDates.add(date));
  (updates.unblockDates || []).forEach((date) => nextDates.delete(date));

  return [...nextDates];
}

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [venues, setVenues] = useState([]);
  const [adminVenues, setAdminVenues] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [venueDetails, setVenueDetails] = useState({});

  const [loading, setLoading] = useState({
    venues: false,
    adminVenues: false,
    myBookings: false,
    recentBookings: false,
    venueDetails: {},
  });
  const [loaded, setLoaded] = useState({
    venues: false,
    adminVenues: false,
    myBookings: false,
    recentBookings: false,
    venueDetails: {},
  });
  const [errors, setErrors] = useState({
    venues: null,
    adminVenues: null,
    myBookings: null,
    recentBookings: null,
    venueDetails: {},
  });

  const resetData = useCallback(() => {
    setVenues([]);
    setAdminVenues([]);
    setMyBookings([]);
    setRecentBookings([]);
    setVenueDetails({});
    setLoading({
      venues: false,
      adminVenues: false,
      myBookings: false,
      recentBookings: false,
      venueDetails: {},
    });
    setLoaded({
      venues: false,
      adminVenues: false,
      myBookings: false,
      recentBookings: false,
      venueDetails: {},
    });
    setErrors({
      venues: null,
      adminVenues: null,
      myBookings: null,
      recentBookings: null,
      venueDetails: {},
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      resetData();
    }
  }, [isAuthenticated, resetData]);

  const fetchVenues = useCallback(async ({ force = false } = {}) => {
    if (!force && loaded.venues) {
      return venues;
    }

    setLoading((current) => ({ ...current, venues: true }));
    setErrors((current) => ({ ...current, venues: null }));

    try {
      const data = await getAllVenues();
      const nextVenues = Array.isArray(data) ? data : [];
      setVenues(nextVenues);
      setLoaded((current) => ({ ...current, venues: true }));
      return nextVenues;
    } catch (error) {
      setErrors((current) => ({ ...current, venues: error }));
      throw error;
    } finally {
      setLoading((current) => ({ ...current, venues: false }));
    }
  }, [loaded.venues, venues]);

  const fetchAdminVenues = useCallback(async ({ force = false } = {}) => {
    if (!force && loaded.adminVenues) {
      return adminVenues;
    }

    setLoading((current) => ({ ...current, adminVenues: true }));
    setErrors((current) => ({ ...current, adminVenues: null }));

    try {
      const data = await getAdminVenues();
      const nextVenues = Array.isArray(data) ? data : [];
      setAdminVenues(nextVenues);
      setLoaded((current) => ({ ...current, adminVenues: true }));
      return nextVenues;
    } catch (error) {
      setErrors((current) => ({ ...current, adminVenues: error }));
      throw error;
    } finally {
      setLoading((current) => ({ ...current, adminVenues: false }));
    }
  }, [adminVenues, loaded.adminVenues]);

  const fetchMyBookings = useCallback(async ({ force = false } = {}) => {
    if (!force && loaded.myBookings) {
      return myBookings;
    }

    setLoading((current) => ({ ...current, myBookings: true }));
    setErrors((current) => ({ ...current, myBookings: null }));

    try {
      const data = await getMyBookings();
      const nextBookings = Array.isArray(data) ? data : [];
      setMyBookings(nextBookings);
      setLoaded((current) => ({ ...current, myBookings: true }));
      return nextBookings;
    } catch (error) {
      setErrors((current) => ({ ...current, myBookings: error }));
      throw error;
    } finally {
      setLoading((current) => ({ ...current, myBookings: false }));
    }
  }, [loaded.myBookings, myBookings]);

  const fetchRecentBookings = useCallback(async ({ force = false } = {}) => {
    if (!force && loaded.recentBookings) {
      return recentBookings;
    }

    setLoading((current) => ({ ...current, recentBookings: true }));
    setErrors((current) => ({ ...current, recentBookings: null }));

    try {
      const data = await getRecentBookings();
      const nextBookings = Array.isArray(data) ? data : [];
      setRecentBookings(nextBookings);
      setLoaded((current) => ({ ...current, recentBookings: true }));
      return nextBookings;
    } catch (error) {
      setErrors((current) => ({ ...current, recentBookings: error }));
      throw error;
    } finally {
      setLoading((current) => ({ ...current, recentBookings: false }));
    }
  }, [loaded.recentBookings, recentBookings]);

  const fetchVenueDetails = useCallback(async (id, { force = false } = {}) => {
    if (!force && loaded.venueDetails[id] && venueDetails[id]) {
      return venueDetails[id];
    }

    setLoading((current) => ({
      ...current,
      venueDetails: { ...current.venueDetails, [id]: true },
    }));
    setErrors((current) => ({
      ...current,
      venueDetails: { ...current.venueDetails, [id]: null },
    }));

    try {
      const data = await getVenueById(id);
      setVenueDetails((current) => ({ ...current, [id]: data }));
      setLoaded((current) => ({
        ...current,
        venueDetails: { ...current.venueDetails, [id]: true },
      }));
      return data;
    } catch (error) {
      setErrors((current) => ({
        ...current,
        venueDetails: { ...current.venueDetails, [id]: error },
      }));
      throw error;
    } finally {
      setLoading((current) => ({
        ...current,
        venueDetails: { ...current.venueDetails, [id]: false },
      }));
    }
  }, [loaded.venueDetails, venueDetails]);

  const createBookingOptimistic = useCallback(async (bookingData, venue) => {
    const previousBookings = myBookings;
    const optimisticBooking = {
      id: `temp-${Date.now()}`,
      bookingDate: bookingData.bookingDate,
      hoursBooked: bookingData.hoursBooked,
      status: "CONFIRMED",
      totalCost: (venue?.pricePerHour || 0) * bookingData.hoursBooked,
      createdAt: new Date().toISOString(),
      venue: venue
        ? {
            id: venue.id,
            name: venue.name,
            location: venue.location,
            pricePerHour: venue.pricePerHour,
          }
        : { id: bookingData.venueId },
      user: user
        ? {
            id: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        : null,
      isOptimistic: true,
    };

    setMyBookings((current) => [optimisticBooking, ...current]);
    setLoaded((current) => ({ ...current, myBookings: true }));
    setErrors((current) => ({ ...current, myBookings: null }));

    try {
      const response = await createBooking(bookingData);
      const createdBooking = response?.booking;

      if (createdBooking) {
        setMyBookings((current) =>
          current.map((booking) =>
            booking.id === optimisticBooking.id ? createdBooking : booking,
          ),
        );
      }

      return response;
    } catch (error) {
      setMyBookings(previousBookings);
      setErrors((current) => ({ ...current, myBookings: error }));
      throw error;
    }
  }, [myBookings, user]);

  const createVenueOptimistic = useCallback(async (venueData) => {
    const previousVenues = adminVenues;
    const optimisticVenue = {
      id: `temp-${Date.now()}`,
      name: venueData.name,
      location: venueData.location,
      capacity: venueData.capacity,
      pricePerHour: venueData.pricePerHour,
      isActive: true,
      createdAt: new Date().toISOString(),
      unavailableDates: [],
      admin: user
        ? {
            id: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        : null,
      isOptimistic: true,
    };

    setAdminVenues((current) => [optimisticVenue, ...current]);
    setLoaded((current) => ({ ...current, adminVenues: true }));
    setErrors((current) => ({ ...current, adminVenues: null }));

    try {
      const response = await createVenue(venueData);
      const createdVenue = response?.venue;

      if (createdVenue) {
        setAdminVenues((current) =>
          current.map((venue) =>
            venue.id === optimisticVenue.id ? createdVenue : venue,
          ),
        );
      }

      return response;
    } catch (error) {
      setAdminVenues(previousVenues);
      setErrors((current) => ({ ...current, adminVenues: error }));
      throw error;
    }
  }, [adminVenues, user]);

  const updateAvailabilityForVenue = useCallback(async (venueId, updates) => {
    const previousAdminVenues = adminVenues;
    const previousVenueDetails = venueDetails;

    setAdminVenues((current) =>
      current.map((venue) =>
        String(venue.id) === String(venueId)
          ? {
              ...venue,
              unavailableDates: applyAvailabilityUpdates(
                venue.unavailableDates,
                updates,
              ),
            }
          : venue,
      ),
    );
    setVenueDetails((current) => {
      const venue = current[venueId];
      if (!venue) {
        return current;
      }

      return {
        ...current,
        [venueId]: {
          ...venue,
          unavailableDates: applyAvailabilityUpdates(
            venue.unavailableDates,
            updates,
          ),
        },
      };
    });

    try {
      const updatedVenue = await updateVenueAvailability(venueId, updates);

      setAdminVenues((current) =>
        current.map((venue) =>
          String(venue.id) === String(venueId) ? updatedVenue : venue,
        ),
      );
      setVenueDetails((current) => ({
        ...current,
        [venueId]: updatedVenue,
      }));

      return updatedVenue;
    } catch (error) {
      setAdminVenues(previousAdminVenues);
      setVenueDetails(previousVenueDetails);
      throw error;
    }
  }, [adminVenues, venueDetails]);

  const value = {
    venues,
    adminVenues,
    myBookings,
    recentBookings,
    venueDetails,
    loading,
    errors,
    fetchVenues,
    fetchAdminVenues,
    fetchMyBookings,
    fetchRecentBookings,
    fetchVenueDetails,
    createBookingOptimistic,
    createVenueOptimistic,
    updateAvailabilityForVenue,
    resetData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }

  return context;
}
