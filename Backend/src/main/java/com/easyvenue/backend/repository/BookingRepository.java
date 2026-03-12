package com.easyvenue.backend.repository;

import com.easyvenue.backend.model.Booking;
import com.easyvenue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findTop10ByUserOrderByCreatedAtDesc(User user);
    List<Booking> findByUser(User user);

    void deleteByIdAndUser(Long id, User user);
    Optional<Booking> findByIdAndUser(Long id, User user);

    @Query("SELECT b FROM Booking b WHERE b.venue.id = :venueId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.status = 'CONFIRMED'")
    Optional<Booking> findConfirmedBookingByVenueAndDate(
            @Param("venueId") Long venueId,
            @Param("bookingDate") LocalDate bookingDate
    );

    List<Booking> findByVenueIdOrderByCreatedAtDesc(Long venueId);


    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate " +
            "ORDER BY b.bookingDate ASC")
    List<Booking> findBookingsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    Long countConfirmedBookings();
}
