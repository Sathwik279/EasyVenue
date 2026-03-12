package com.easyvenue.backend.controller;

import com.easyvenue.backend.dto.AvailabilityUpdateRequest;
import com.easyvenue.backend.dto.VenueCreationRequest;
import com.easyvenue.backend.model.User;
import com.easyvenue.backend.model.Venue;
import com.easyvenue.backend.service.impl.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "*")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @GetMapping
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    @GetMapping("/getAdminVenues")
    @PreAuthorize("hasRole('VENUE_ADMIN')")
    public List<Venue>  getAdminVenues(@AuthenticationPrincipal User currentUser){
        return venueService.getAdminVenues(currentUser);
    }

    @PostMapping
    @PreAuthorize("hasRole('VENUE_ADMIN')")
    public ResponseEntity<?> createVenue(@RequestBody VenueCreationRequest request,
                                                           @AuthenticationPrincipal User currentUser) {
        try{
            Venue venue = new Venue();
            venue.setName(request.getName());
            venue.setLocation(request.getLocation());
            venue.setCapacity(request.getCapacity());
            venue.setPricePerHour(request.getPricePerHour());
            venue.setAdmin(currentUser);
            venue.setIsActive(true);

            Venue created  = venueService.createVenue(venue);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message","Venue created Successfully",
                            "venue",created
                    ));
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id,
                                             @RequestBody Venue updatedVenue) {
        try {
            Venue updated = venueService.updateVenue(id, updatedVenue);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Venue> updateAvailability(@PathVariable Long id,
                                                    @RequestBody AvailabilityUpdateRequest request) {
        try {
            Venue updated = venueService.updateAvailability(
                    id,
                    request.getBlockDates(),
                    request.getUnblockDates()
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
