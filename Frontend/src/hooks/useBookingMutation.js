import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/bookingService";
import { createVenue } from "../services/venueService";
import { useAuth } from "../contexts/AuthContext";

const MY_BOOKINGS_QUERY_KEY = ["myBookings"];

export const useCreateBooking = (venue) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: createBooking,
    onMutate: async (bookingData) => {
      await queryClient.cancelQueries({ queryKey: MY_BOOKINGS_QUERY_KEY });

      const previousBookings =
        queryClient.getQueryData(MY_BOOKINGS_QUERY_KEY) ?? [];

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

      queryClient.setQueryData(MY_BOOKINGS_QUERY_KEY, (current = []) => [
        optimisticBooking,
        ...current,
      ]);

      return {
        previousBookings,
        optimisticBookingId: optimisticBooking.id,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(MY_BOOKINGS_QUERY_KEY, context.previousBookings);
      }
    },
    onSuccess: (response, _variables, context) => {
      const createdBooking = response?.booking;
      if (!createdBooking) {
        return;
      }

      queryClient.setQueryData(MY_BOOKINGS_QUERY_KEY, (current = []) =>
        current.map((booking) =>
          booking.id === context?.optimisticBookingId ? createdBooking : booking,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MY_BOOKINGS_QUERY_KEY });
    },
  });
};

export const ADMIN_VENUES_QUERY_KEY = ["adminVenues"];

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: createVenue,
    onMutate: async (venueData) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_VENUES_QUERY_KEY });

      const previousVenues =
        queryClient.getQueryData(ADMIN_VENUES_QUERY_KEY) ?? [];

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

      queryClient.setQueryData(ADMIN_VENUES_QUERY_KEY, (current = []) => [
        optimisticVenue,
        ...current,
      ]);

      return {
        previousVenues,
        optimisticVenueId: optimisticVenue.id,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousVenues) {
        queryClient.setQueryData(ADMIN_VENUES_QUERY_KEY, context.previousVenues);
      }
    },
    onSuccess: (response, _variables, context) => {
      const createdVenue = response?.venue;
      if (!createdVenue) {
        return;
      }

      queryClient.setQueryData(ADMIN_VENUES_QUERY_KEY, (current = []) =>
        current.map((venue) =>
          venue.id === context?.optimisticVenueId ? createdVenue : venue,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VENUES_QUERY_KEY });
    },
  });
};
