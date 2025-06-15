package com.cyberthreat.controller;

import com.cyberthreat.model.RegisterRequest;
import com.cyberthreat.model.Users;
import com.cyberthreat.Jwt.JwtUtil;
import com.cyberthreat.service.CustomUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());

            return ResponseEntity.ok(jwt);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null || request.getRole().isBlank()) {
            request.setRole("USER"); // default to USER
        }

        try {
            Users user = userService.registerUser(request);
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            return ResponseEntity.status(400).body("Registration failed: " + ex.getMessage());
        }
    }
}
