package com.cyberthreat.controller;

import com.cyberthreat.model.User;
import com.cyberthreat.repository.UserRepository;
import com.cyberthreat.service.AuthService;
import com.cyberthreat.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(authService.registerUser(email, password));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(authService.loginUser(email, password));
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(authService.getUserFromToken(jwtToken));
    }
}
