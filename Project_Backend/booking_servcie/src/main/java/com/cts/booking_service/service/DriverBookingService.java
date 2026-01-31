package com.cts.booking_service.service;

import com.cts.booking_service.client.UserServiceClient;
import com.cts.booking_service.dto.UserResponse;
import com.cts.booking_service.dto.common.PageResponse;
import com.cts.booking_service.dto.driver.*;
import com.cts.booking_service.entity.Booking;
import com.cts.booking_service.exception.*;
import com.cts.booking_service.repository.DriverBookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DriverBookingService {

    private final DriverBookingRepository repository;
    private final UserServiceClient userServiceClient;

   
    @Transactional(readOnly = true)
    public List<DriverBookingResponse> getAvailableBookings(String driverId, String vehicleType) {
        log.info("Fetching available bookings for driver: {}", driverId);

        // Check if driver already has an active booking
        if (repository.hasActiveBooking(driverId)) {
            throw new InvalidBookingStatusException("You already have an active booking");
        }

        // Get available bookings
        List<Booking> bookings = (vehicleType != null && !vehicleType.isBlank())
            ? repository.findPendingBookingsByVehicleType(parseVehicleType(vehicleType))
            : repository.findPendingBookings();

        log.info("Found {} available bookings", bookings.size());
        
        return bookings.stream()
            .map(this::toResponseWithRider)
            .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<DriverBookingResponse> getMyBookings(String driverId, String status, int page, int size) {
        log.info("Fetching bookings for driver: {}", driverId);

        Page<Booking> bookingsPage = (status != null && !status.isBlank())
            ? repository.findByDriverIdAndBookingStatusOrderByCreatedAtDesc(
                driverId, parseBookingStatus(status), PageRequest.of(page, size))
            : repository.findByDriverIdOrderByCreatedAtDesc(driverId, PageRequest.of(page, size));

        return PageResponse.of(bookingsPage, this::toResponseWithRider);
    }

    @Transactional(readOnly = true)
    public DriverBookingResponse getActiveBooking(String driverId) {
        log.info("Fetching active booking for driver: {}", driverId);
        
        return repository.findActiveBookingByDriverId(driverId)
            .map(this::toResponseWithRider)
            .orElse(null);
    }

    @Transactional
    public DriverBookingResponse acceptBooking(String bookingId, String driverId, AcceptBookingRequest request) {
        log.info("Driver {} accepting booking {}", driverId, bookingId);

        // Validation
        if (repository.hasActiveBooking(driverId)) {
            throw new InvalidBookingStatusException("You already have an active booking");
        }

        Booking booking = findBooking(bookingId);

        if (booking.getBookingStatus() != Booking.BookingStatus.PENDING) {
            throw new InvalidBookingStatusException("This booking is no longer available");
        }

        if (booking.getDriverId() != null) {
            throw new InvalidBookingStatusException("This booking is already assigned");
        }

        // Update booking
        booking.setDriverId(driverId);
        booking.setVehicleId(request.getVehicleId());
        booking.setBookingStatus(Booking.BookingStatus.ACCEPTED);
        booking.setUpdatedAt(OffsetDateTime.now());

        return toResponseWithRider(repository.save(booking));
    }

    @Transactional
    public DriverBookingResponse startRide(String bookingId, String driverId) {
        log.info("Driver {} starting ride {}", driverId, bookingId);

        Booking booking = findBooking(bookingId);
        validateOwnership(booking, driverId);

        if (booking.getBookingStatus() != Booking.BookingStatus.ACCEPTED) {
            throw new InvalidBookingStatusException("Cannot start ride. Must be in 'accepted' status");
        }

        booking.setBookingStatus(Booking.BookingStatus.STARTED);
        booking.setPickupTime(OffsetDateTime.now());
        booking.setUpdatedAt(OffsetDateTime.now());

        return toResponseWithRider(repository.save(booking));
    }

    @Transactional
    public DriverBookingResponse completeRide(String bookingId, String driverId, CompleteBookingRequest request) {
        log.info("Driver {} completing ride {}", driverId, bookingId);

        Booking booking = findBooking(bookingId);
        validateOwnership(booking, driverId);

        if (booking.getBookingStatus() != Booking.BookingStatus.STARTED) {
            throw new InvalidBookingStatusException("Cannot complete ride. Must be in 'started' status");
        }

        // Update trip details
        if (request.getFinalDistanceKm() != null) {
            booking.setTripDistanceKm(request.getFinalDistanceKm());
            booking.setFareAmount(calculateFare(request.getFinalDistanceKm(), booking.getVehicleType()));
        }

        if (request.getFinalDurationMinutes() != null) {
            booking.setTripDurationMinutes(request.getFinalDurationMinutes());
        }

        if (request.getFinalFare() != null) {
            booking.setFareAmount(request.getFinalFare());
        }

        booking.setBookingStatus(Booking.BookingStatus.COMPLETED);
        booking.setDropoffTime(OffsetDateTime.now());
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        booking.setUpdatedAt(OffsetDateTime.now());

        return toResponseWithRider(repository.save(booking));
    }

    @Transactional(readOnly = true)
    public DriverBookingResponse getBookingDetails(String bookingId, String driverId) {
        log.info("Fetching booking details: {}", bookingId);

        Booking booking = findBooking(bookingId);

        // Allow viewing if pending or if driver owns it
        if (booking.getDriverId() != null && !booking.getDriverId().equals(driverId)) {
            throw new UnauthorizedAccessException(driverId, bookingId);
        }

        return toResponseWithRider(booking);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private Booking findBooking(String bookingId) {
        return repository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId, true));
    }

    private void validateOwnership(Booking booking, String driverId) {
        if (!driverId.equals(booking.getDriverId())) {
            throw new UnauthorizedAccessException(driverId, booking.getId());
        }
    }

    private BigDecimal calculateFare(BigDecimal distance, Booking.VehicleType vehicleType) {
        BigDecimal baseFare = switch (vehicleType) {
            case AUTO -> BigDecimal.valueOf(30);
            case BIKE -> BigDecimal.valueOf(20);
            case SEDAN -> BigDecimal.valueOf(50);
            case SUV -> BigDecimal.valueOf(70);
        };

        BigDecimal perKmRate = switch (vehicleType) {
            case AUTO -> BigDecimal.valueOf(12);
            case BIKE -> BigDecimal.valueOf(8);
            case SEDAN -> BigDecimal.valueOf(15);
            case SUV -> BigDecimal.valueOf(20);
        };

        return baseFare.add(distance.multiply(perKmRate)).setScale(2, RoundingMode.HALF_UP);
    }

    private DriverBookingResponse toResponseWithRider(Booking booking) {
        DriverBookingResponse response = DriverBookingResponse.fromEntity(booking);
        
        // Fetch rider details
        if (booking.getRiderId() != null) {
            try {
                UserResponse rider = userServiceClient.getUserById(booking.getRiderId());
                response.setRiderName(rider.getFirstName() + " " + rider.getLastName());
                response.setRiderPhone(rider.getPhoneNumber());
            } catch (Exception e) {
                log.warn("Failed to fetch rider details: {}", e.getMessage());
            }
        }
        
        return response;
    }

    private Booking.VehicleType parseVehicleType(String vehicleType) {
        try {
            return Booking.VehicleType.valueOf(vehicleType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidVehicleTypeException(vehicleType, "AUTO, BIKE, SEDAN, SUV");
        }
    }

    private Booking.BookingStatus parseBookingStatus(String status) {
        try {
            return Booking.BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Invalid status: " + status);
        }
    }
}