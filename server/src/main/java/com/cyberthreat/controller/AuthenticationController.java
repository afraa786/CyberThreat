package com.cyberthreat.controller;

import com.cyberthreat.Dto.LoginUserDto;
import com.cyberthreat.Dto.RegisterUserDto;
import com.cyberthreat.Dto.VerifyUserDto;
import com.cyberthreat.Response.LoginResponse;
import com.cyberthreat.model.User;
import com.cyberthreat.service.AuthenticationService;
import com.cyberthreat.service.JwtService;
import com.cyberthreat.repository.UserRepository; // Make sure this import exists
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import com.cyberthreat.service.UserService;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository; // ADD THIS FIELD
    private final UserService userService;

    // Update constructor to include UserRepository
    public AuthenticationController(JwtService jwtService, 
                                   AuthenticationService authenticationService,
                                   UserRepository userRepository, UserService userService
                                   ) { // ADD THIS PARAMETER
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userRepository = userRepository; // INITIALIZE IT
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
// @GetMapping("/me")
// public ResponseEntity<Map<String, Object>> authenticatedUser() {
//     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
//     System.out.println("Authentication: " + authentication);
    
//     if (authentication == null || !authentication.isAuthenticated()) {
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//     }
    
//     Object principal = authentication.getPrincipal();
//     System.out.println("Principal class: " + principal.getClass().getName());
    
//     Map<String, Object> response = new HashMap<>();
    
//     if (principal instanceof User) {
//         // Your custom User entity
//         User currentUser = (User) principal;
//         response.put("id", currentUser.getId());
//         response.put("username", currentUser.getUsername());
//         response.put("email", currentUser.getEmail());
//         response.put("enabled", currentUser.isEnabled());
//         response.put("authenticated", true);
//     } else {
//         // Fallback for other principal types
//         response.put("username", principal.toString());
//         response.put("authenticated", true);
//     }
    
//     // Add authorities/roles
//     response.put("roles", authentication.getAuthorities().stream()
//         .map(authority -> authority.getAuthority())
//         .collect(Collectors.toList()));
    
//     System.out.println("Response: " + response);
//     return ResponseEntity.ok(response);
// }

 @GetMapping("/all")
public List<User> allUsers() {
    return userRepository.findAll();
}
@GetMapping("/me")
public Map<String, Object> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName(); // This gets the email from JWT
    
    System.out.println("Email from token: " + email);
    
    // Fetch the complete user from database using email
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    Map<String, Object> response = new HashMap<>();
    response.put("id", user.getId());
    response.put("username", user.getUsername());
    response.put("email", user.getEmail());
    response.put("enabled", user.isEnabled());
    
    System.out.println("User found: " + user.getUsername());
    return response;
}
}