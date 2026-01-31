package com.cts.driver_service.dto;

import com.cts.driver_service.entity.Driver;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponse {
    private String id;
    private String userId;
    private String aadhaarNumber;
    private String dlNumber;
    private LocalDate dlExpiryDate;
    private String verificationStatus; 
    private Boolean isAvailable;
    private Boolean docsSubmitted;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String city;
    private String state;
    
    public static DriverResponse fromEntity(Driver driver, UserResponse userDetails) {
        DriverResponseBuilder builder = DriverResponse.builder()
                .id(driver.getId())
                .userId(driver.getUserId())
                .aadhaarNumber(driver.getAadhaarNumber())
                .dlNumber(driver.getDlNumber())
                .dlExpiryDate(driver.getDlExpiryDate())
                .verificationStatus(driver.getVerificationStatus() != null 
                    ? driver.getVerificationStatus().name() 
                    : "PENDING")
                .isAvailable(driver.isAvailable())
                .docsSubmitted(driver.isDocsSubmitted())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt());
        
        if (userDetails != null) {
            builder
                .firstName(userDetails.getFirst_name())
                .lastName(userDetails.getLast_name())
                .email(userDetails.getEmail())
                .phoneNumber(userDetails.getPhoneNumber())
                .city(userDetails.getCity())
                .state(userDetails.getState());
        }
        
        return builder.build();
    }
}