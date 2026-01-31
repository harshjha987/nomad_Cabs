package com.cts.driver_service.controller;

import com.cts.driver_service.dto.AdminVerificationRequest;
import com.cts.driver_service.dto.DriverResponse;
import com.cts.driver_service.entity.Driver;
import com.cts.driver_service.exception.InvalidStatusException;
import com.cts.driver_service.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/drivers")
@RequiredArgsConstructor
@Slf4j
public class AdminDriverController {

    private final DriverService driverService;

    @GetMapping
    public ResponseEntity<Page<DriverResponse>> listDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        
        log.info("Admin: List drivers request - page: {}, size: {}, status: {}", page, size, status);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<DriverResponse> drivers;

        if (status != null && !status.isBlank()) {
            Driver.VerificationStatus verificationStatus=Driver.VerificationStatus.valueOf(status.toUpperCase());
            drivers = driverService.listByStatus(verificationStatus, pageable);
        } else {
            drivers = driverService.listAll(pageable);
        }

        log.info("Admin: Returning {} drivers (page {} of {})", 
                 drivers.getNumberOfElements(), 
                 drivers.getNumber() + 1, 
                 drivers.getTotalPages());
        
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<DriverResponse> getDriver(@PathVariable String driverId) {
        log.info("Admin: Get driver request for ID: {}", driverId);
        
        DriverResponse driver = driverService.getById(driverId);
        
        log.info("Admin: Successfully retrieved driver: {}", driverId);
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/{driverId}/verify")
    public ResponseEntity<DriverResponse> verifyDriver(
            @PathVariable String driverId,
            @Valid @RequestBody AdminVerificationRequest verificationRequest) {
        
        log.info("Admin: Verify driver {} with action: {}", driverId, verificationRequest.getAction());

        DriverResponse driver = driverService.adminVerifyDriver(driverId, verificationRequest);
        
        log.info("Admin: Driver {} verification completed with status: {}", 
                 driverId, driver.getVerificationStatus());
        
        return ResponseEntity.ok(driver);
    }

    @DeleteMapping("/{driverId}")
    public ResponseEntity<Void> deleteDriver(@PathVariable String driverId) {
        log.info("Admin: Delete driver request for ID: {}", driverId);
    
        driverService.deleteDriverById(driverId);
        
        log.info("Admin: Driver {} deleted successfully", driverId);
        return ResponseEntity.noContent().build();
    }
}