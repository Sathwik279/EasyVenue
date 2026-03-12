package com.easyvenue.backend.service.impl;

import com.easyvenue.backend.model.User;
import com.easyvenue.backend.model.Venue;
import com.easyvenue.backend.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public List<Venue> getAllVenues() {
        return venueRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public Venue createVenue(Venue venue) {
        if (venue.getIsActive() == null) {
            venue.setIsActive(true);
        }

        return venueRepository.save(venue);
    }

    public List<Venue> getAdminVenues(User currentUser){
        if(currentUser.getRole() != User.Role.VENUE_ADMIN){
            throw new IllegalArgumentException("Only Venue admin can view their own venues");
        }
        return venueRepository.findByAdmin(currentUser);
    }

    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id)
                .filter(Venue::getIsActive);
    }

    public void deleteMyVenue(Long id, User currentUser) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getAdmin().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only delete your own venues");
        }

        venue.setIsActive(false);
        venueRepository.save(venue);
    }

    public Venue updateMyVenue(Long id, Venue updatedVenue, User currentUser) {
        return venueRepository.findById(id)
                .map(existingVenue -> {
                    if (!existingVenue.getAdmin().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("You can only update your own venues");
                    }

                    existingVenue.setName(updatedVenue.getName());
                    existingVenue.setLocation(updatedVenue.getLocation());
                    existingVenue.setCapacity(updatedVenue.getCapacity());
                    existingVenue.setPricePerHour(updatedVenue.getPricePerHour());

                    return venueRepository.save(existingVenue);
                })
                .orElseThrow(() -> new RuntimeException("Venue not found with ID: " + id));
    }

    public Venue updateMyAvailability(Long id, List<LocalDate> blockDates,
                                      List<LocalDate> unblockDates, User currentUser) {
        return venueRepository.findById(id)
                .map(venue -> {
                    if (!venue.getAdmin().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("You can only update availability of your own venues");
                    }

                    Set<LocalDate> unavailableSet = new HashSet<>(venue.getUnavailableDates());

                    if (blockDates != null && !blockDates.isEmpty()) {
                        unavailableSet.addAll(blockDates);
                    }
                    if (unblockDates != null && !unblockDates.isEmpty()) {
                        unavailableSet.removeAll(unblockDates);
                    }

                    venue.setUnavailableDates(List.copyOf(unavailableSet));
                    return venueRepository.save(venue);
                })
                .orElseThrow(() -> new RuntimeException("Venue not found with ID: " + id));
    }

    public boolean isVenueAvailable(Long venueId, LocalDate date) {
        Optional<Venue> venue = getVenueById(venueId);
        return venue.isPresent() && venue.get().isAvailableOn(date);
    }

    public List<Venue> getVenuesByLocation(String location) {
        return venueRepository.findActiveVenuesByLocation(location);
    }

    public List<Venue> getVenuesByCapacityRange(Integer minCapacity, Integer maxCapacity) {
        return venueRepository.findActiveVenuesByCapacityRange(minCapacity, maxCapacity);
    }

    public List<Venue> getVenuesByPriceRange(Double minPrice, Double maxPrice) {
        return venueRepository.findActiveVenuesByPriceRange(minPrice, maxPrice);
    }
}
