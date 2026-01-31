package com.cts.booking_service.dto.rider;

import com.cts.booking_service.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiderBookingResponse {
    private String id;
    
    // Rider Info
    private String riderId;
    private String riderName;   // ✅ ADD THIS (populated by UserService)
    private String riderPhone;  // ✅ ADD THIS (populated by UserService)
    
    // Driver Info
    private String driverId;
    private String driverName;   // Populated from User Service
    private String driverPhone;  // Populated from User Service
    
    private String vehicleId;

    private String pickupAddress;
    private String dropoffAddress;

    private String vehicleType;
    private BigDecimal fareAmount;
    private BigDecimal tripDistanceKm;
    private Integer tripDurationMinutes;

    private String bookingStatus;

    // Payment Info
    private String paymentId;
    private String paymentStatus;

    // Timestamps
    private OffsetDateTime requestTime;
    private OffsetDateTime pickupTime;
    private OffsetDateTime dropoffTime;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public static RiderBookingResponse fromEntity(Booking booking) {
        RiderBookingResponse response = new RiderBookingResponse();
        response.setId(booking.getId());
        response.setRiderId(booking.getRiderId());
        response.setDriverId(booking.getDriverId());
        response.setVehicleId(booking.getVehicleId());
        response.setPickupAddress(booking.getPickupAddress());
        response.setDropoffAddress(booking.getDropoffAddress());
        response.setVehicleType(booking.getVehicleType() != null ? booking.getVehicleType().name().toLowerCase() : null);
        response.setFareAmount(booking.getFareAmount());
        response.setTripDistanceKm(booking.getTripDistanceKm());
        response.setTripDurationMinutes(booking.getTripDurationMinutes());
        response.setBookingStatus(booking.getBookingStatus() != null ? booking.getBookingStatus().name().toLowerCase() : null);
        
        // Payment Info
        response.setPaymentId(booking.getPaymentId());
        response.setPaymentStatus(booking.getPaymentStatus() != null ? booking.getPaymentStatus().name().toLowerCase() : null);
        
        // Timestamps
        response.setRequestTime(booking.getRequestTime());
        response.setPickupTime(booking.getPickupTime());
        response.setDropoffTime(booking.getDropoffTime());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        
        return response;
    }
}