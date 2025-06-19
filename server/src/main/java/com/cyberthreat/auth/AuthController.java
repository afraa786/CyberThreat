package com.cyberthreat.auth;

import com.cyberthreat.Token.TokenBlacklistService;
import com.cyberthreat.model.RegisterRequest;
import com.cyberthreat.model.Users;
import com.cyberthreat.Jwt.JwtUtil;
import com.cyberthreat.service.CustomUserDetailsService;
import com.cyberthreat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userService;
    
    @Autowired
    private TokenBlacklistService tokenBlacklistService;

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

        // ✅ Wrap the token in a JSON object so frontend can read it
        return ResponseEntity.ok(Map.of("token", jwt));

    } catch (BadCredentialsException ex) {
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

   @PostMapping("/logout")
public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }
    return ResponseEntity.badRequest().body("No token found");
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
