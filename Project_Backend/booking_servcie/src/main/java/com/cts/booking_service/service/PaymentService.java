package com.cts.booking_service.service;

import com.cts.booking_service.dto.payment.CreatePaymentIntentResponse;
import com.cts.booking_service.dto.payment.PaymentDetailsResponse;
import com.cts.booking_service.dto.payment.UpdatePaymentRequest;
import com.cts.booking_service.entity.Booking;
import com.cts.booking_service.exception.BookingNotFoundException;
import com.cts.booking_service.exception.InvalidBookingStatusException;
import com.cts.booking_service.exception.InvalidRequestException;
import com.cts.booking_service.exception.UnauthorizedAccessException;
import com.cts.booking_service.repository.RiderBookingRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RiderBookingRepository repository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
        log.info("✅ Stripe API initialized");
    }

    @Transactional
    public CreatePaymentIntentResponse createPaymentIntent(String bookingId, String userId) {
        log.info("🔑 Creating payment intent for booking: {}", bookingId);

        Booking booking = findAndValidateBooking(bookingId, userId);

        // Validate booking status
        if (booking.getBookingStatus() != Booking.BookingStatus.COMPLETED) {
            throw new InvalidBookingStatusException(
                "Payment can only be made for completed bookings. Current status: " + booking.getBookingStatus()
            );
        }

        if (booking.getPaymentStatus() == Booking.PaymentStatus.COMPLETED) {
            throw new InvalidRequestException("Payment already completed for this booking");
        }

        try {
            PaymentIntent paymentIntent = createStripePaymentIntent(booking);

            log.info("✅ PaymentIntent created: {} for booking: {}", paymentIntent.getId(), bookingId);

            return CreatePaymentIntentResponse.builder()
                .clientSecret(paymentIntent.getClientSecret())
                .paymentIntentId(paymentIntent.getId())
                .amount(booking.getFareAmount())
                .currency("inr")
                .bookingId(bookingId)
                .build();

        } catch (StripeException e) {
            log.error("❌ Stripe error for booking: {}", bookingId, e);
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentDetailsResponse updatePayment(UpdatePaymentRequest request, String userId) {
        log.info("💳 Updating payment for booking: {}", request.getBookingId());

        Booking booking = findAndValidateBooking(request.getBookingId(), userId);

        // Validate booking is completed
        if (booking.getBookingStatus() != Booking.BookingStatus.COMPLETED) {
            throw new InvalidBookingStatusException("Can only update payment for completed bookings");
        }

        booking.setPaymentId(request.getPaymentId());
        booking.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "card");
        booking.setPaymentStatus(Booking.PaymentStatus.COMPLETED);
        booking.setPaidAt(LocalDateTime.now());

        repository.save(booking);

        log.info("✅ Payment completed for booking: {}", request.getBookingId());

        return buildPaymentDetailsResponse(booking, "Payment completed successfully");
    }

    @Transactional
    public void markPaymentFailed(String bookingId, String userId, String reason) {
        log.warn("⚠️ Marking payment as failed for booking: {}, reason: {}", bookingId, reason);

        Booking booking = findAndValidateBooking(bookingId, userId);

        booking.setPaymentStatus(Booking.PaymentStatus.FAILED);
        repository.save(booking);

        log.info("❌ Payment marked as failed for booking: {}", bookingId);
    }

    @Transactional
    public void markPaymentComplete(String bookingId, String userId) {
        log.info("✅ Driver marking payment as complete for booking: {}", bookingId);

        Booking booking = findBooking(bookingId);

        // Verify driver authorization
        if (!userId.equals(booking.getDriverId())) {
            throw new UnauthorizedAccessException(userId, bookingId);
        }

        // Validate booking is completed
        if (booking.getBookingStatus() != Booking.BookingStatus.COMPLETED) {
            throw new InvalidBookingStatusException("Can only mark payment complete for completed bookings");
        }

        booking.setPaymentStatus(Booking.PaymentStatus.COMPLETED);
        booking.setPaymentMethod("cash");
        booking.setPaidAt(LocalDateTime.now());

        repository.save(booking);

        log.info("✅ Cash payment marked complete for booking: {}", bookingId);
    }

    @Transactional(readOnly = true)
    public PaymentDetailsResponse getPaymentDetails(String bookingId, String userId) {
        log.info("📋 Fetching payment details for booking: {}", bookingId);

        Booking booking = findAndValidateBooking(bookingId, userId);

        return buildPaymentDetailsResponse(booking, null);
    }

    private Booking findBooking(String bookingId) {
        return repository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId, true));
    }

    private Booking findAndValidateBooking(String bookingId, String userId) {
        Booking booking = findBooking(bookingId);

        // Verify user is either rider or driver
        if (!booking.getRiderId().equals(userId) && 
            (booking.getDriverId() == null || !booking.getDriverId().equals(userId))) {
            throw new UnauthorizedAccessException(userId, bookingId);
        }

        return booking;
    }

    private PaymentIntent createStripePaymentIntent(Booking booking) throws StripeException {
        long amountInPaise = (long) (booking.getFareAmount().doubleValue() * 100);
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amountInPaise)
            .setCurrency("inr")
            .putMetadata("bookingId", booking.getId())
            .putMetadata("riderId", booking.getRiderId())
            .putMetadata("driverId", booking.getDriverId() != null ? booking.getDriverId() : "N/A")
            .setDescription("Payment for booking " + booking.getId())
            .build();

        return PaymentIntent.create(params);
    }

    private PaymentDetailsResponse buildPaymentDetailsResponse(Booking booking, String message) {
        return PaymentDetailsResponse.builder()
            .bookingId(booking.getId())
            .paymentId(booking.getPaymentId())
            .amount(booking.getFareAmount())
            .paymentMethod(booking.getPaymentMethod())
            .paymentStatus(booking.getPaymentStatus().name())
            .paidAt(booking.getPaidAt())
            .message(message)
            .build();
    }
}