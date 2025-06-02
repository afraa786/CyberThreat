package com.cyberthreat.service;

import com.cyberthreat.model.User;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;


import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "TPEsdVZFwffrAqdtEjAcK8u6zc/MhLFOreCV5n+YU+A=";
    private final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 10; // 10 days

    /**
     * Generates a JWT token with email and role
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Extracts email/username from the token
     */
    public String extractUsername(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * Validates token by matching email and expiry
     */
    public boolean validateToken(String token, User user) {
        final String username = extractUsername(token);
        return username.equals(user.getEmail()) && !isTokenExpired(token);
    }

    /**
     * Checks if the token is expired
     */
    public boolean isTokenExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }

    /**
     * Internal method to parse token
     */
    private Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
