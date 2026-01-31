package com.cts.driver_service.controller;

import com.cts.driver_service.dto.VehicleRequest;
import com.cts.driver_service.dto.VehicleResponse;
import com.cts.driver_service.entity.Vehicle;
import com.cts.driver_service.exception.UnauthorizedException;
import com.cts.driver_service.service.VehicleService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Slf4j
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getMyVehicles(HttpServletRequest request) {
        String userId = extractUserId(request);
        
        log.info("Driver: Get vehicles request for userId: {}", userId);
        
        List<Vehicle> vehicles = vehicleService.getDriverVehicles(userId);
        List<VehicleResponse> response = vehicles.stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());

        log.info("Driver: Returning {} vehicles for userId: {}", response.size(), userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponse> getVehicle(
            HttpServletRequest request,
            @PathVariable String vehicleId) {

        String userId = extractUserId(request);
        
        log.info("Driver: Get vehicle {} for userId: {}", vehicleId, userId);
        
        Vehicle vehicle = vehicleService.getVehicle(vehicleId, userId);
        
        return ResponseEntity.ok(VehicleResponse.fromEntity(vehicle));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> addVehicle(
            HttpServletRequest request,
            @Valid @RequestBody VehicleRequest vehicleRequest) {

        String userId = extractUserId(request);
        
        log.info("Driver: Add vehicle request for userId: {}", userId);
        
        Vehicle vehicle = vehicleService.addVehicle(userId, vehicleRequest);
        
        log.info("Driver: Vehicle {} added successfully for userId: {}", vehicle.getId(), userId);
        return new ResponseEntity<>(VehicleResponse.fromEntity(vehicle), HttpStatus.CREATED);
    }


    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            HttpServletRequest request,
            @PathVariable String vehicleId,
            @Valid @RequestBody VehicleRequest vehicleRequest) {

        String userId = extractUserId(request);
        
        log.info("Driver: Update vehicle {} for userId: {}", vehicleId, userId);
        
        Vehicle vehicle = vehicleService.updateVehicle(vehicleId, userId, vehicleRequest);
        
        log.info("Driver: Vehicle {} updated successfully", vehicleId);
        return ResponseEntity.ok(VehicleResponse.fromEntity(vehicle));
    }


    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> deleteVehicle(
            HttpServletRequest request,
            @PathVariable String vehicleId) {

        String userId = extractUserId(request);
        
        log.info("Driver: Delete vehicle {} for userId: {}", vehicleId, userId);
        
        vehicleService.deleteVehicle(vehicleId, userId);
        
        log.info("Driver: Vehicle {} deleted successfully", vehicleId);
        return ResponseEntity.noContent().build();
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