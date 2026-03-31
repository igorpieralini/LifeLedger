package com.lifeledger.security.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

/**
 * Encapsulates all JWT creation and validation logic.
 * Uses JJWT 0.12+ API (key-based signing, no deprecated string secrets).
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${lifeledger.jwt.secret}") String secret,
            @Value("${lifeledger.jwt.expiration-ms}") long expirationMs
    ) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        return parseClaims(token).getPayload().getExpiration().before(new Date());
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
    }
}
