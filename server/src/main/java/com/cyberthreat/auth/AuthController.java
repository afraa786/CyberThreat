package com.cyberthreat.auth;

import com.cyberthreat.model.User;
import com.cyberthreat.repository.UserRepository;
import com.cyberthreat.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        user.setOtp((int) (Math.random() * 9000) + 1000); // Generate OTP
        userRepository.save(user);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PutMapping("/register")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam int otp) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getOtp() != otp) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        user.setVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok("User verified successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        UserDetails userDetails = userRepository.findByEmail(user.getEmail()).orElse(null);
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        return ResponseEntity.ok(user);
    }
}
