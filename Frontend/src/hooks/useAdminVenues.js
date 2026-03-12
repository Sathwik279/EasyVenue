import { getAdminVenues } from "../services/venueService";
import { useQuery } from "@tanstack/react-query";

// Add this new hook (create useMyVenues.js or just add below)
export const useAdminVenues = () => {
  return useQuery({
    queryKey: ["myVenues"],
    queryFn: getAdminVenues,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};