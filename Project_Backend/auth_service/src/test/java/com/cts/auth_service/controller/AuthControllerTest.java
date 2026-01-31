package com.cts.auth_service.controller;

import com.cts.auth_service.dto.AuthResponse;
import com.cts.auth_service.dto.LoginRequest;
import com.cts.auth_service.dto.SignupRequest;
import com.cts.auth_service.service.AuthService;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private AuthResponse authResponse;

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

        // Setup auth response
        authResponse = new AuthResponse("mock-jwt-token", "user123", "CUSTOMER");
    }

    @Test
    void login_Success() {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("mock-jwt-token", response.getBody().getToken());
        assertEquals("user123", response.getBody().getUserId());
        assertEquals("CUSTOMER", response.getBody().getRole());

        verify(authService, times(1)).login(loginRequest);
    }

    @Test
    void login_WithDriverRole() {
        // Arrange
        AuthResponse driverResponse = new AuthResponse("driver-token", "driver123", "DRIVER");
        when(authService.login(any(LoginRequest.class))).thenReturn(driverResponse);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("DRIVER", response.getBody().getRole());
        assertEquals("driver123", response.getBody().getUserId());
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        // Arrange
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(FeignException.class);

        // Act & Assert
        assertThrows(FeignException.class, () -> authController.login(loginRequest));

        verify(authService, times(1)).login(loginRequest);
    }

    @Test
    void login_ServiceReturnsNull() {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(null);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void signup_Success() {
        // Arrange
        String expectedMessage = "User registered successfully";
        when(authService.signup(any(SignupRequest.class))).thenReturn(expectedMessage);

        // Act
        ResponseEntity<String> response = authController.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedMessage, response.getBody());

        verify(authService, times(1)).signup(signupRequest);
    }

    @Test
    void signup_WithDriverRole() {
        // Arrange
        signupRequest.setRole("DRIVER");
        String expectedMessage = "Driver registered successfully";
        when(authService.signup(any(SignupRequest.class))).thenReturn(expectedMessage);

        // Act
        ResponseEntity<String> response = authController.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedMessage, response.getBody());
    }

    @Test
    void signup_DuplicateEmail_ThrowsException() {
        // Arrange
        when(authService.signup(any(SignupRequest.class)))
                .thenThrow(FeignException.class);

        // Act & Assert
        assertThrows(FeignException.class, () -> authController.signup(signupRequest));

        verify(authService, times(1)).signup(signupRequest);
    }

    @Test
    void signup_ServiceReturnsNull() {
        // Arrange
        when(authService.signup(any(SignupRequest.class))).thenReturn(null);

        // Act
        ResponseEntity<String> response = authController.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void login_VerifyResponseEntityStructure() {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Assert
        assertTrue(response.hasBody());
        assertNotNull(response.getHeaders());
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void signup_VerifyResponseEntityStructure() {
        // Arrange
        String message = "Success";
        when(authService.signup(any(SignupRequest.class))).thenReturn(message);

        // Act
        ResponseEntity<String> response = authController.signup(signupRequest);

        // Assert
        assertTrue(response.hasBody());
        assertNotNull(response.getHeaders());
        assertEquals(201, response.getStatusCode().value());
    }

    @Test
    void login_ServiceCalledWithCorrectParameters() {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act
        authController.login(loginRequest);

        // Assert
        verify(authService, times(1)).login(argThat(request -> request.getEmail().equals("test@example.com") &&
                request.getPassword().equals("password123")));
    }

    @Test
    void signup_ServiceCalledWithCorrectParameters() {
        // Arrange
        when(authService.signup(any(SignupRequest.class))).thenReturn("Success");

        // Act
        authController.signup(signupRequest);

        // Assert
        verify(authService, times(1)).signup(argThat(request -> request.getEmail().equals("john.doe@example.com") &&
                request.getFirstName().equals("John") &&
                request.getLastName().equals("Doe") &&
                request.getRole().equals("CUSTOMER")));
    }
}
