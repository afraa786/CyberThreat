package com.cyberthreat.controller;

import com.cyberthreat.model.User;
import com.cyberthreat.service.UserService;
import com.cyberthreat.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.cyberthreat.model.User;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.List;
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

@RequestMapping("/users")
@RestController
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // ✅ Single constructor for both dependencies
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // @GetMapping("/me")
    // public ResponseEntity<User> authenticatedUser() {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     User currentUser = (User) authentication.getPrincipal();
    //     return ResponseEntity.ok(currentUser);
   

    // }

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


}
