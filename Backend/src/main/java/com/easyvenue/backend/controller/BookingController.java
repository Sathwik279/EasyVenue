package com.easyvenue.backend.controller;

import com.easyvenue.backend.dto.BookingRequest;
import com.easyvenue.backend.model.Booking;
import com.easyvenue.backend.model.User;
import com.easyvenue.backend.model.Venue;
import com.easyvenue.backend.service.impl.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/getMyBookings")
    @PreAuthorize("hasRole('VENUE_USER')")
    public List<Booking> getMyBookings(@AuthenticationPrincipal User currentUser) {
        return bookingService.getMyBookings(currentUser);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request,
            @AuthenticationPrincipal User currentUser) {
        try {
            Booking booking = new Booking();
            booking.setBookingDate(request.getBookingDate());
            booking.setHoursBooked(request.getHoursBooked());
            booking.setUser(currentUser);

            // Create a venue object with ID
            Venue venue = new Venue();
            venue.setId(request.getVenueId());
            booking.setVenue(venue);

            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Booking confirmed successfully",
                    "booking", created
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/recent")
    public List<Booking> getRecentBookings(@AuthenticationPrincipal User currentUser) {
        return bookingService.getRecentBookings(currentUser); // This returns List<Booking> directly
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id,@AuthenticationPrincipal User currentUser) {
        return bookingService.getBookingById(id,currentUser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id,@AuthenticationPrincipal User currentUser) {
        bookingService.deleteBooking(id,currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking,@AuthenticationPrincipal User currentUser) {
        try {
            Booking updated = bookingService.updateBooking(id, updatedBooking,currentUser);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
