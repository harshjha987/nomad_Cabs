package com.cts.driver_service.controller;

import com.cts.driver_service.dto.DriverProfileRequest;
import com.cts.driver_service.dto.DriverResponse;
import com.cts.driver_service.entity.Driver;
import com.cts.driver_service.exception.UnauthorizedException;
import com.cts.driver_service.service.DriverService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@Slf4j
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/me")
    public ResponseEntity<DriverResponse> getDriverDetails(HttpServletRequest request) {
        String userId = extractUserId(request);
        
        log.info("Driver: Get profile request for userId: {}", userId);
        DriverResponse driver = driverService.getDriverProfile(userId);
        
        return new ResponseEntity<>(driver, HttpStatus.OK);
    }

    @PostMapping("/me/profile")
    public ResponseEntity<Driver> createProfile(
            HttpServletRequest request,
            @Valid @RequestBody DriverProfileRequest profileRequest) {

        String userId = extractUserId(request);
        
        log.info("Driver: Create profile request for userId: {}", userId);
        Driver driver = driverService.createOrUpdateProfile(userId, profileRequest);
        
        log.info("Driver: Profile created successfully for userId: {}", userId);
        return new ResponseEntity<>(driver, HttpStatus.CREATED);
    }

    @PutMapping("/me/profile")
    public ResponseEntity<Driver> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody DriverProfileRequest profileRequest) {

        String userId = extractUserId(request);
        
        log.info("Driver: Update profile request for userId: {}", userId);
        Driver driver = driverService.createOrUpdateProfile(userId, profileRequest);
        
        log.info("Driver: Profile updated successfully for userId: {}", userId);
        return ResponseEntity.ok(driver);
    }

    private String extractUserId(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        if (userId == null || userId.isBlank()) {
            log.error("Missing or invalid X-User-Id header in request");
            throw new UnauthorizedException("Missing or invalid X-User-Id header");
        }
        return userId;
    }
}