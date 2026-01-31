package com.cts.driver_service.controller;

import com.cts.driver_service.dto.AdminVehicleVerificationRequest;
import com.cts.driver_service.dto.VehicleResponse;
import com.cts.driver_service.entity.Vehicle;
import com.cts.driver_service.exception.InvalidStatusException;
import com.cts.driver_service.service.VehicleService;
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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/vehicles")
@RequiredArgsConstructor
@Slf4j
public class AdminVehicleController {

    private final VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<Page<VehicleResponse>> getVehiclesByStatus(
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Admin: Get vehicles by status: {} (page: {}, size: {})", status, page, size);

        Vehicle.VerificationStatus verificationStatus;
        try {
            verificationStatus = Vehicle.VerificationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidStatusException(
                    "Invalid status. Valid values: PENDING, UNDER_REVIEW, APPROVED, REJECTED");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Vehicle> vehiclesPage = vehicleService.getVehiclesByStatus(verificationStatus, pageable);

        Page<VehicleResponse> response = vehiclesPage.map(VehicleResponse::fromEntity);

        log.info("Admin: Returning {} vehicles (page {} of {})",
                response.getNumberOfElements(),
                response.getNumber() + 1,
                response.getTotalPages());

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{vehicleId}/verify")
    public ResponseEntity<VehicleResponse> verifyVehicle(
            @PathVariable String vehicleId,
            @Valid @RequestBody AdminVehicleVerificationRequest request) {

        log.info("Admin: Verify vehicle {} with action: {}", vehicleId, request.getAction());

        Vehicle vehicle = vehicleService.adminVerifyVehicle(vehicleId, request);

        log.info("Admin: Vehicle {} verification completed with status: {}",
                vehicleId, vehicle.getVerificationStatus());

        return ResponseEntity.ok(VehicleResponse.fromEntity(vehicle));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<VehicleResponse>> getDriverVehicles(@PathVariable String driverId) {
        log.info("Admin: Get vehicles for driver: {}", driverId);

        List<Vehicle> vehicles = vehicleService.getVehiclesByDriverId(driverId);
        List<VehicleResponse> response = vehicles.stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}