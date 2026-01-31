package com.cts.auth_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secretKey = "mySecretKeyForJWTTokenGenerationThatIsLongEnough1234567890";
    private final long jwtExpiration = 86400000; // 24 hours

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", jwtExpiration);
    }

    @Test
    void generateToken_Success() {
        // Arrange
        String userId = "user123";
        String role = "CUSTOMER";

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void generateToken_ContainsCorrectClaims() {
        // Arrange
        String userId = "user123";
        String role = "CUSTOMER";

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals(userId, claims.getSubject());
        assertEquals(role, claims.get("role"));
        assertEquals(userId, claims.get("userId"));
    }

    @Test
    void generateToken_HasCorrectExpiration() {
        // Arrange
        String userId = "user123";
        String role = "CUSTOMER";
        long beforeGeneration = System.currentTimeMillis();

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Date expiration = claims.getExpiration();
        Date issuedAt = claims.getIssuedAt();

        assertNotNull(expiration);
        assertNotNull(issuedAt);
        assertTrue(expiration.getTime() > beforeGeneration);
        assertTrue(expiration.getTime() - issuedAt.getTime() <= jwtExpiration + 1000); // Allow 1 second tolerance
    }

    @Test
    void generateToken_WithDriverRole() {
        // Arrange
        String userId = "driver456";
        String role = "DRIVER";

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        assertNotNull(token);
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals("DRIVER", claims.get("role"));
        assertEquals(userId, claims.get("userId"));
    }

    @Test
    void generateToken_WithAdminRole() {
        // Arrange
        String userId = "admin789";
        String role = "ADMIN";

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        assertNotNull(token);
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals("ADMIN", claims.get("role"));
    }

    @Test
    void generateToken_DifferentTokensForDifferentUsers() {
        // Arrange & Act
        String token1 = jwtService.generateToken("user1", "CUSTOMER");
        String token2 = jwtService.generateToken("user2", "CUSTOMER");

        // Assert
        assertNotEquals(token1, token2);
    }

    @Test
    void generateToken_IssuedAtBeforeExpiration() {
        // Arrange
        String userId = "user123";
        String role = "CUSTOMER";

        // Act
        String token = jwtService.generateToken(userId, role);

        // Assert
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertTrue(claims.getIssuedAt().before(claims.getExpiration()));
    }
}
