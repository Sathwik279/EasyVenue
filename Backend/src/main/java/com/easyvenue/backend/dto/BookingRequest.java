package com.easyvenue.backend.dto;

import java.time.LocalDate;

public class BookingRequest {

    private Long venueId;

    private LocalDate bookingDate;

    private Integer hoursBooked;

    public BookingRequest() {
    }

    public BookingRequest(Long venueId,
                          LocalDate bookingDate, Integer hoursBooked) {
        this.venueId = venueId;
        this.bookingDate = bookingDate;
        this.hoursBooked = hoursBooked;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Integer getHoursBooked() {
        return hoursBooked;
    }

    public void setHoursBooked(Integer hoursBooked) {
        this.hoursBooked = hoursBooked;
    }

    public String toString() {
        return "BookingRequest{" +
                "venueId=" + venueId +
                ", bookingDate=" + bookingDate +
                ", hoursBooked=" + hoursBooked +
                '}';
    }
}
