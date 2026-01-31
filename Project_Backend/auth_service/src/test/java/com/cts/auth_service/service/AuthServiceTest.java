package com.cts.auth_service.service;

import com.cts.auth_service.client.UserServiceClient;
import com.cts.auth_service.dto.AuthResponse;
import com.cts.auth_service.dto.LoginRequest;
import com.cts.auth_service.dto.SignupRequest;
import com.cts.auth_service.dto.UserValidationResponse;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private UserValidationResponse validationResponse;

    @BeforeEach
    void setUp() {
        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Setup signup request
        signupRequest = new SignupRequest();
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setEmail("john.doe@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setRole("CUSTOMER");

        // Setup validation response
        validationResponse = new UserValidationResponse();
        validationResponse.setUserId("user123");
        validationResponse.setRole("CUSTOMER");
    }

    @Test
    void login_Success() {
        // Arrange
        when(userServiceClient.validateCredentials(any(LoginRequest.class)))
                .thenReturn(ResponseEntity.ok(validationResponse));
        when(jwtService.generateToken(anyString(), anyString()))
                .thenReturn("mock-jwt-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("user123", response.getUserId());
        assertEquals("CUSTOMER", response.getRole());

        verify(userServiceClient, times(1)).validateCredentials(loginRequest);
        verify(jwtService, times(1)).generateToken("user123", "CUSTOMER");
    }

    @Test
    void login_InvalidCredentials_ThrowsFeignException() {
        // Arrange
        when(userServiceClient.validateCredentials(any(LoginRequest.class)))
                .thenThrow(FeignException.class);

        // Act & Assert
        assertThrows(FeignException.class, () -> authService.login(loginRequest));

        verify(userServiceClient, times(1)).validateCredentials(loginRequest);
        verify(jwtService, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_WithDriverRole() {
        // Arrange
        validationResponse.setRole("DRIVER");
        when(userServiceClient.validateCredentials(any(LoginRequest.class)))
                .thenReturn(ResponseEntity.ok(validationResponse));
        when(jwtService.generateToken(anyString(), anyString()))
                .thenReturn("mock-jwt-token-driver");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("DRIVER", response.getRole());
        verify(jwtService, times(1)).generateToken("user123", "DRIVER");
    }

    @Test
    void signup_Success() {
        // Arrange
        String expectedMessage = "User registered successfully";
        when(userServiceClient.registerUser(any(SignupRequest.class)))
                .thenReturn(ResponseEntity.ok(expectedMessage));

        // Act
        String response = authService.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(expectedMessage, response);

        verify(userServiceClient, times(1)).registerUser(signupRequest);
    }

    @Test
    void signup_DuplicateEmail_ThrowsFeignException() {
        // Arrange
        when(userServiceClient.registerUser(any(SignupRequest.class)))
                .thenThrow(FeignException.class);

        // Act & Assert
        assertThrows(FeignException.class, () -> authService.signup(signupRequest));

        verify(userServiceClient, times(1)).registerUser(signupRequest);
    }

    @Test
    void signup_WithDriverRole() {
        // Arrange
        signupRequest.setRole("DRIVER");
        String expectedMessage = "Driver registered successfully";
        when(userServiceClient.registerUser(any(SignupRequest.class)))
                .thenReturn(ResponseEntity.ok(expectedMessage));

        // Act
        String response = authService.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(expectedMessage, response);
        verify(userServiceClient, times(1)).registerUser(signupRequest);
    }

    @Test
    void login_NullResponseBody_ThrowsNullPointerException() {
        // Arrange
        when(userServiceClient.validateCredentials(any(LoginRequest.class)))
                .thenReturn(ResponseEntity.ok(null));

        // Act & Assert
        assertThrows(NullPointerException.class, () -> authService.login(loginRequest));
    }

    @Test
    void signup_NullResponseBody_ReturnsNull() {
        // Arrange
        when(userServiceClient.registerUser(any(SignupRequest.class)))
                .thenReturn(ResponseEntity.ok(null));

        // Act
        String response = authService.signup(signupRequest);

        // Assert
        assertNull(response);
        verify(userServiceClient, times(1)).registerUser(signupRequest);
    }
}
