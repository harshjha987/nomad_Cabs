package com.cts.booking_service.service;

import com.cts.booking_service.client.UserServiceClient;
import com.cts.booking_service.dto.UserResponse;
import com.cts.booking_service.dto.common.PageResponse;
import com.cts.booking_service.dto.rider.*;
import com.cts.booking_service.entity.Booking;
import com.cts.booking_service.exception.*;
import com.cts.booking_service.repository.RiderBookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RiderBookingService {

    private final RiderBookingRepository repository;
    private final UserServiceClient userServiceClient;

    @Transactional
    public RiderBookingResponse createBooking(String riderId, CreateBookingRequest request) {
        log.info("Creating booking for rider: {}", riderId);

        Booking booking = new Booking();
        booking.setRiderId(riderId);
        booking.setPickupLatitude(request.getPickupLatitude());
        booking.setPickupLongitude(request.getPickupLongitude());
        booking.setPickupAddress(request.getPickupAddress());
        booking.setDropoffLatitude(request.getDropoffLatitude());
        booking.setDropoffLongitude(request.getDropoffLongitude());
        booking.setDropoffAddress(request.getDropoffAddress());
        booking.setVehicleType(parseVehicleType(request.getVehicleType()));

        BigDecimal distance = calculateDistance(
                request.getPickupLatitude(), request.getPickupLongitude(),
                request.getDropoffLatitude(), request.getDropoffLongitude());


        booking.setTripDistanceKm(distance);
        booking.setFareAmount(calculateFare(distance, booking.getVehicleType()));
        booking.setTripDurationMinutes(calculateDuration(distance));

        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        booking.setRequestTime(OffsetDateTime.now());

        Booking saved = repository.save(booking);

        log.info("Booking created: {} | Fare: ₹{} | Distance: {} km",
                saved.getId(), saved.getFareAmount(), saved.getTripDistanceKm());

        return RiderBookingResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<RiderBookingResponse> getMyBookings(
            String riderId, String filterType, String searchTerm, String status, int page, int size) {

        log.info("Fetching bookings for rider: {}", riderId);

        Page<Booking> bookingsPage = fetchBookings(riderId, filterType, searchTerm, status, page, size);
        return PageResponse.of(bookingsPage, this::toResponseWithDriver);
    }

    @Transactional
    public RiderBookingResponse cancelBooking(String bookingId, String riderId) {
        log.info("Cancelling booking {} by rider {}", bookingId, riderId);

        Booking booking = findBooking(bookingId);
        validateOwnership(booking, riderId);

        if (booking.getBookingStatus() != Booking.BookingStatus.PENDING &&
                booking.getBookingStatus() != Booking.BookingStatus.ACCEPTED) {
            throw new InvalidBookingStatusException(
                    "Cannot cancel booking in " + booking.getBookingStatus().name().toLowerCase() + " status");
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        booking.setUpdatedAt(OffsetDateTime.now());

        return RiderBookingResponse.fromEntity(repository.save(booking));
    }

    @Transactional(readOnly = true)
    public RiderBookingResponse getBookingDetails(String bookingId, String riderId) {
        log.info("Fetching booking details: {}", bookingId);

        Booking booking = findBooking(bookingId);
        validateOwnership(booking, riderId);

        return toResponseWithDriver(booking);
    }

    private Page<Booking> fetchBookings(String riderId, String filterType, String searchTerm, String status, int page,
            int size) {

        PageRequest pageRequest = PageRequest.of(page, size);

        if (status != null && !status.isBlank()) {
            return repository.findByRiderIdAndBookingStatusOrderByCreatedAtDesc(
                    riderId, parseBookingStatus(status), pageRequest);
        }

        if ("pickup".equals(filterType) && searchTerm != null && !searchTerm.isBlank()) {
            return repository.searchByPickupAddress(riderId, searchTerm, pageRequest);
        }

        if ("dropoff".equals(filterType) && searchTerm != null && !searchTerm.isBlank()) {
            return repository.searchByDropoffAddress(riderId, searchTerm, pageRequest);
        }

        if ("travel_date".equals(filterType) && searchTerm != null && !searchTerm.isBlank()) {
            try {
                OffsetDateTime date = OffsetDateTime.parse(searchTerm + "T00:00:00Z");
                return repository.searchByDate(riderId, date, pageRequest);
            } catch (Exception e) {
                throw new InvalidRequestException("Invalid date format. Use YYYY-MM-DD");
            }
        }
        
        Page<Booking> allBookings = repository.findByRiderIdOrderByCreatedAtDesc(riderId, pageRequest);
        return allBookings;
    }



    private Booking findBooking(String bookingId) {
        return repository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId, true));
    }

    private void validateOwnership(Booking booking, String riderId) {
        if (!booking.getRiderId().equals(riderId)) {
            throw new UnauthorizedAccessException(riderId, booking.getId());
        }
    }

    private BigDecimal calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        double distance = 1 + (Math.random() * 19); 
        return BigDecimal.valueOf(distance).setScale(2, RoundingMode.HALF_UP);
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

    private Integer calculateDuration(BigDecimal distance) {
        double hours = distance.doubleValue() / 30.0;
        return (int) Math.round(hours * 60); // Convert to minutes
    }

    private RiderBookingResponse toResponseWithDriver(Booking booking) {
        RiderBookingResponse response = RiderBookingResponse.fromEntity(booking);

        if (booking.getDriverId() != null) {
            try {
                UserResponse driver = userServiceClient.getUserById(booking.getDriverId());
                response.setDriverName(driver.getFirstName() + " " + driver.getLastName());
                response.setDriverPhone(driver.getPhoneNumber());
                log.debug("Fetched driver details for booking {}", booking.getId());
            } catch (Exception e) {
                log.warn("Failed to fetch driver details: {}", e.getMessage());
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
            throw new InvalidRequestException(
                    "Invalid status: " + status + ". Valid values: PENDING, ACCEPTED, STARTED, COMPLETED, CANCELLED");
        }
    }
}