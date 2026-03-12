package com.easyvenue.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easyvenue.backend.model.Booking;
import com.easyvenue.backend.model.User;
import com.easyvenue.backend.model.Venue;
import com.easyvenue.backend.repository.BookingRepository;
import com.easyvenue.backend.repository.VenueRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VenueRepository venueRepository;

    public List<Booking> getMyBookings(User currentUser) {
        return bookingRepository.findByUser(currentUser);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        Venue venue = validateVenueExists(booking.getVenue().getId());

        LocalDate bookingDate = booking.getBookingDate();
        validateVenueAvailability(venue, bookingDate);

        validateNoExistingBooking(venue.getId(), bookingDate);

        Double totalCost = calculateBookingCost(venue, booking.getHoursBooked());
        booking.setTotalCost(totalCost);
        booking.setVenue(venue);

        Booking savedBooking = bookingRepository.save(booking);

        blockVenueDate(venue, bookingDate);

        return savedBooking;
    }

    public List<Booking> getRecentBookings(User currentUser) {
        List<Booking> bookings = bookingRepository.findTop10ByUserOrderByCreatedAtDesc(currentUser);
        System.out.println("📊 Found " + bookings.size() + " recent bookings");
        return bookings;
    }

    public Optional<Booking> getBookingById(Long id,User currentUser) {
        return bookingRepository.findByIdAndUser(id,currentUser);
    }

    public void deleteBooking(Long id,User currentUser) {
        bookingRepository.deleteByIdAndUser(id,currentUser);
    }

    public Booking updateBooking(Long id, Booking updatedBooking,User currentUser) {
        return bookingRepository.findByIdAndUser(id,currentUser)
                .map(existingBooking -> {
                    existingBooking.setBookingDate(updatedBooking.getBookingDate());
                    existingBooking.setHoursBooked(updatedBooking.getHoursBooked());

                    return bookingRepository.save(existingBooking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    private Venue validateVenueExists(Long venueId) {
        return venueRepository.findById(venueId)
                .orElseThrow(() -> new IllegalArgumentException("Venue not found"));
    }

    private void validateVenueAvailability(Venue venue, LocalDate bookingDate) {
        if (venue.getUnavailableDates().contains(bookingDate)) {
            throw new IllegalArgumentException("Venue is not available on the selected date");
        }
    }

    private void validateNoExistingBooking(Long venueId, LocalDate bookingDate) {
        Optional<Booking> existingBooking = bookingRepository
                .findConfirmedBookingByVenueAndDate(venueId, bookingDate);

        if (existingBooking.isPresent()) {
            throw new IllegalArgumentException("Venue is already booked on this date");
        }
    }

    private Double calculateBookingCost(Venue venue, Integer hoursBooked) {
        return venue.getPricePerHour() * hoursBooked;
    }

    private void blockVenueDate(Venue venue, LocalDate bookingDate) {
        venue.getUnavailableDates().add(bookingDate);
        venueRepository.save(venue);
    }
}
