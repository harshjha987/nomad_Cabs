package com.cts.booking_service.service;

import com.cts.booking_service.client.UserServiceClient;
import com.cts.booking_service.dto.UserResponse;
import com.cts.booking_service.dto.rider.CreateBookingRequest;
import com.cts.booking_service.dto.rider.RiderBookingResponse;
import com.cts.booking_service.entity.Booking;
import com.cts.booking_service.exception.BookingNotFoundException;
import com.cts.booking_service.exception.InvalidBookingStatusException;
import com.cts.booking_service.exception.InvalidVehicleTypeException;
import com.cts.booking_service.exception.UnauthorizedAccessException;
import com.cts.booking_service.repository.RiderBookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Rider Booking Service Tests")
class RiderBookingServiceTest {

    @Mock
    private RiderBookingRepository repository;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private RiderBookingService riderBookingService;

    private CreateBookingRequest createRequest;
    private Booking booking;
    private UserResponse driverResponse;

    @BeforeEach
    void setUp() {
        // Setup request
        createRequest = new CreateBookingRequest();
        createRequest.setPickupLatitude(19.0760);
        createRequest.setPickupLongitude(72.8777);
        createRequest.setPickupAddress("Mumbai Central");
        createRequest.setDropoffLatitude(19.0596);
        createRequest.setDropoffLongitude(72.8295);
        createRequest.setDropoffAddress("Bandra West");
        createRequest.setVehicleType("SEDAN");

        // Setup booking entity
        booking = new Booking();
        booking.setId("booking-123");
        booking.setRiderId("rider-123");
        booking.setDriverId("driver-123");
        booking.setPickupLatitude(19.0760);
        booking.setPickupLongitude(72.8777);
        booking.setPickupAddress("Mumbai Central");
        booking.setDropoffLatitude(19.0596);
        booking.setDropoffLongitude(72.8295);
        booking.setDropoffAddress("Bandra West");
        booking.setVehicleType(Booking.VehicleType.SEDAN);
        booking.setFareAmount(new BigDecimal("150.00"));
        booking.setTripDistanceKm(new BigDecimal("5.5"));
        booking.setTripDurationMinutes(15);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        booking.setRequestTime(OffsetDateTime.now());
        booking.setCreatedAt(OffsetDateTime.now());

        // Setup driver response
        driverResponse = new UserResponse();
        driverResponse.setId("driver-123");
        driverResponse.setFirstName("John");
        driverResponse.setLastName("Doe");
        driverResponse.setPhoneNumber("+919876543210");
    }

    // ==================== METHOD 1: Create Booking ====================

    @Test
    @DisplayName("Should create booking successfully with valid data")
    void testCreateBooking_Success() {
        // Given
        when(repository.save(any(Booking.class))).thenReturn(booking);

        // When
        RiderBookingResponse response = riderBookingService.createBooking("rider-123", createRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("booking-123");
        assertThat(response.getRiderId()).isEqualTo("rider-123");
        assertThat(response.getPickupAddress()).isEqualTo("Mumbai Central");
        assertThat(response.getDropoffAddress()).isEqualTo("Bandra West");
        assertThat(response.getVehicleType()).isEqualTo("sedan");
        assertThat(response.getBookingStatus()).isEqualTo("pending");
        assertThat(response.getPaymentStatus()).isEqualTo("pending");
        assertThat(response.getFareAmount()).isGreaterThan(BigDecimal.ZERO);
        assertThat(response.getTripDistanceKm()).isGreaterThan(BigDecimal.ZERO);

        verify(repository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception for invalid vehicle type")
    void testCreateBooking_InvalidVehicleType() {
        // Given
        createRequest.setVehicleType("INVALID_TYPE");

        // When & Then
        assertThatThrownBy(() -> riderBookingService.createBooking("rider-123", createRequest))
                .isInstanceOf(InvalidVehicleTypeException.class)
                .hasMessageContaining("INVALID_TYPE");

        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should calculate fare correctly based on vehicle type")
    void testCreateBooking_FareCalculation() {
        // Given
        when(repository.save(any(Booking.class))).thenReturn(booking);

        // When
        RiderBookingResponse response = riderBookingService.createBooking("rider-123", createRequest);

        // Then
        assertThat(response.getFareAmount()).isNotNull();
        assertThat(response.getFareAmount()).isGreaterThan(new BigDecimal("50")); // Base fare for sedan
        
        verify(repository, times(1)).save(any(Booking.class));
    }

    // ==================== METHOD 2: Cancel Booking ====================

    @Test
    @DisplayName("Should cancel PENDING booking successfully")
    void testCancelBooking_Success_Pending() {
        // Given
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(repository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking savedBooking = invocation.getArgument(0);
            savedBooking.setBookingStatus(Booking.BookingStatus.CANCELLED);
            return savedBooking;
        });

        // When
        RiderBookingResponse response = riderBookingService.cancelBooking("booking-123", "rider-123");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("booking-123");
        assertThat(response.getBookingStatus()).isEqualTo("cancelled");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should cancel ACCEPTED booking successfully")
    void testCancelBooking_Success_Accepted() {
        // Given
        booking.setBookingStatus(Booking.BookingStatus.ACCEPTED);
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(repository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking savedBooking = invocation.getArgument(0);
            savedBooking.setBookingStatus(Booking.BookingStatus.CANCELLED);
            return savedBooking;
        });

        // When
        RiderBookingResponse response = riderBookingService.cancelBooking("booking-123", "rider-123");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getBookingStatus()).isEqualTo("cancelled");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when cancelling STARTED booking")
    void testCancelBooking_InvalidStatus_Started() {
        // Given
        booking.setBookingStatus(Booking.BookingStatus.STARTED);
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));

        // When & Then
        assertThatThrownBy(() -> riderBookingService.cancelBooking("booking-123", "rider-123"))
                .isInstanceOf(InvalidBookingStatusException.class)
                .hasMessageContaining("started");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when cancelling COMPLETED booking")
    void testCancelBooking_InvalidStatus_Completed() {
        // Given
        booking.setBookingStatus(Booking.BookingStatus.COMPLETED);
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));

        // When & Then
        assertThatThrownBy(() -> riderBookingService.cancelBooking("booking-123", "rider-123"))
                .isInstanceOf(InvalidBookingStatusException.class)
                .hasMessageContaining("completed");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when booking not found")
    void testCancelBooking_NotFound() {
        // Given
        when(repository.findById("booking-123")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> riderBookingService.cancelBooking("booking-123", "rider-123"))
                .isInstanceOf(BookingNotFoundException.class)
                .hasMessageContaining("booking-123");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when user is unauthorized")
    void testCancelBooking_Unauthorized() {
        // Given
        booking.setRiderId("rider-123");
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));

        // When & Then
        assertThatThrownBy(() -> riderBookingService.cancelBooking("booking-123", "different-user"))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("different-user");

        verify(repository, times(1)).findById("booking-123");
        verify(repository, never()).save(any(Booking.class));
    }

    // ==================== METHOD 3: Get Booking Details ====================

    @Test
    @DisplayName("Should get booking details successfully without driver")
    void testGetBookingDetails_Success_NoDriver() {
        // Given
        booking.setDriverId(null);
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));

        // When
        RiderBookingResponse response = riderBookingService.getBookingDetails("booking-123", "rider-123");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("booking-123");
        assertThat(response.getRiderId()).isEqualTo("rider-123");
        assertThat(response.getDriverId()).isNull();
        assertThat(response.getDriverName()).isNull();

        verify(repository, times(1)).findById("booking-123");
        verify(userServiceClient, never()).getUserById(anyString());
    }

    @Test
    @DisplayName("Should get booking details successfully with driver info")
    void testGetBookingDetails_Success_WithDriver() {
        // Given
        booking.setDriverId("driver-123");
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(userServiceClient.getUserById("driver-123")).thenReturn(driverResponse);

        // When
        RiderBookingResponse response = riderBookingService.getBookingDetails("booking-123", "rider-123");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("booking-123");
        assertThat(response.getDriverId()).isEqualTo("driver-123");
        assertThat(response.getDriverName()).isEqualTo("John Doe");
        assertThat(response.getDriverPhone()).isEqualTo("+919876543210");

        verify(repository, times(1)).findById("booking-123");
        verify(userServiceClient, times(1)).getUserById("driver-123");
    }

    @Test
    @DisplayName("Should handle driver service failure gracefully")
    void testGetBookingDetails_DriverServiceFailure() {
        // Given
        booking.setDriverId("driver-123");
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(userServiceClient.getUserById("driver-123")).thenThrow(new RuntimeException("Service unavailable"));

        // When
        RiderBookingResponse response = riderBookingService.getBookingDetails("booking-123", "rider-123");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("booking-123");
        assertThat(response.getDriverId()).isEqualTo("driver-123");
        assertThat(response.getDriverName()).isNull(); // Should be null due to failure
        assertThat(response.getDriverPhone()).isNull();

        verify(repository, times(1)).findById("booking-123");
        verify(userServiceClient, times(1)).getUserById("driver-123");
    }

    @Test
    @DisplayName("Should throw exception when booking not found for get details")
    void testGetBookingDetails_NotFound() {
        // Given
        when(repository.findById("booking-123")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> riderBookingService.getBookingDetails("booking-123", "rider-123"))
                .isInstanceOf(BookingNotFoundException.class)
                .hasMessageContaining("booking-123");

        verify(repository, times(1)).findById("booking-123");
    }

    @Test
    @DisplayName("Should throw exception when unauthorized to get booking details")
    void testGetBookingDetails_Unauthorized() {
        // Given
        booking.setRiderId("rider-123");
        when(repository.findById("booking-123")).thenReturn(Optional.of(booking));

        // When & Then
        assertThatThrownBy(() -> riderBookingService.getBookingDetails("booking-123", "different-user"))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("different-user");

        verify(repository, times(1)).findById("booking-123");
    }

    // ==================== ADDITIONAL EDGE CASE TESTS ====================

    @Test
    @DisplayName("Should handle null vehicle type gracefully")
    void testCreateBooking_NullVehicleType() {
        // Given
        createRequest.setVehicleType(null);

        // When & Then
        assertThatThrownBy(() -> riderBookingService.createBooking("rider-123", createRequest))
                .isInstanceOf(InvalidVehicleTypeException.class);

        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should handle empty vehicle type gracefully")
    void testCreateBooking_EmptyVehicleType() {
        // Given
        createRequest.setVehicleType("");

        // When & Then
        assertThatThrownBy(() -> riderBookingService.createBooking("rider-123", createRequest))
                .isInstanceOf(InvalidVehicleTypeException.class);

        verify(repository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should handle case-insensitive vehicle type")
    void testCreateBooking_CaseInsensitiveVehicleType() {
        // Given
        createRequest.setVehicleType("sedan"); // lowercase
        when(repository.save(any(Booking.class))).thenReturn(booking);

        // When
        RiderBookingResponse response = riderBookingService.createBooking("rider-123", createRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getVehicleType()).isEqualTo("sedan");

        verify(repository, times(1)).save(any(Booking.class));
    }
}