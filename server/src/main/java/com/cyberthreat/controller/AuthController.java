package com.cyberthreat.controller;

import com.cyberthreat.model.User;
import com.cyberthreat.security.JwtUtil;
import com.cyberthreat.service.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.Map;
import java.util.Collections;
import java.util.list;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // You can restrict this to your frontend domain
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody RegistrationRequest request) {
        try {
            authService.registerUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody LoginRequest request) {
        try {
            String token = authService.loginUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "").trim();
            Claims claims = jwtUtil.extractAllClaims(jwt);

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "username", claims.getSubject(),
                    "expiresAt", claims.getExpiration()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "valid", false,
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/user")
public ResponseEntity<?> getUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
    }

    String username = authentication.getName();

    try {
        User user = authService.getUserByUsername(username); // implement this method in your service
        return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }
}


    // DTOs
    static class RegistrationRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
