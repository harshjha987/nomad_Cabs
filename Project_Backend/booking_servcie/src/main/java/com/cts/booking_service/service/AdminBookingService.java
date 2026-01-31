package com.cts.booking_service.service;

import com.cts.booking_service.client.UserServiceClient;
import com.cts.booking_service.dto.UserResponse;
import com.cts.booking_service.dto.common.PageResponse;
import com.cts.booking_service.dto.rider.RiderBookingResponse;
import com.cts.booking_service.entity.Booking;
import com.cts.booking_service.exception.BookingNotFoundException;
import com.cts.booking_service.exception.InvalidRequestException;
import com.cts.booking_service.repository.RiderBookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminBookingService {

    private final RiderBookingRepository repository;
    private final UserServiceClient userServiceClient;

    // ============================================
    // PUBLIC METHODS
    // ============================================

    @Transactional(readOnly = true)
    public PageResponse<RiderBookingResponse> getAllBookings(String status, int page, int size) {
        log.info("Admin fetching all bookings (status: {}, page: {}, size: {})", status, page, size);

        Page<Booking> bookingsPage = (status != null && !status.isBlank())
                ? repository.findByBookingStatusOrderByCreatedAtDesc(
                        parseBookingStatus(status), PageRequest.of(page, size))
                : repository.findAll(PageRequest.of(page, size));

        log.info("Admin retrieved {} bookings", bookingsPage.getNumberOfElements());

        return PageResponse.of(bookingsPage, this::toResponseWithUsers);
    }

    @Transactional(readOnly = true)
    public RiderBookingResponse getBookingById(String bookingId) {
        log.info("Admin fetching booking: {}", bookingId);

        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId, true));

        return toResponseWithUsers(booking);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Convert Booking to Response DTO and populate both rider and driver details
     */
    private RiderBookingResponse toResponseWithUsers(Booking booking) {
        RiderBookingResponse response = RiderBookingResponse.fromEntity(booking);

        // Fetch rider details (admin needs to see rider info)
        if (booking.getRiderId() != null) {
            try {
                UserResponse rider = userServiceClient.getUserById(booking.getRiderId());
                response.setRiderName(rider.getFirstName() + " " + rider.getLastName());
                response.setRiderPhone(rider.getPhoneNumber());
                log.debug("✅ Fetched rider details for riderId: {}", booking.getRiderId());
            } catch (Exception e) {
                log.warn("⚠️ Failed to fetch rider details for riderId: {}", booking.getRiderId());
            }
        }

        // Fetch driver details
        if (booking.getDriverId() != null) {
            try {
                UserResponse driver = userServiceClient.getUserById(booking.getDriverId());
                response.setDriverName(driver.getFirstName() + " " + driver.getLastName());
                response.setDriverPhone(driver.getPhoneNumber());
                log.debug("✅ Fetched driver details for driverId: {}", booking.getDriverId());
            } catch (Exception e) {
                log.warn("⚠️ Failed to fetch driver details for driverId: {}", booking.getDriverId());
            }
        }

        return response;
    }

    private Booking.BookingStatus parseBookingStatus(String status) {
        try {
            return Booking.BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("❌ Invalid booking status: {}", status);
            throw new InvalidRequestException(
                    "Invalid booking status: " + status +
                            ". Valid values: PENDING, ACCEPTED, STARTED, COMPLETED, CANCELLED");
        }
    }
}