package com.cyberthreat.service;

import com.cyberthreat.model.*;
import com.cyberthreat.repository.UserRepository;
import com.cyberthreat.repository.RoleRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(UserRepository userRepository,
                                    RoleRepository roleRepository,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));
                    System.out.println("🔍 Found user: " + user.getEmail() + " with password: " + user.getPassword());

        return new CustomUserDetails(user);

    }

 public Users registerUser(RegisterRequest request) {
    Users user = new Users();
    user.setName(request.getName());
    user.setLastName(request.getLastName());
    user.setEmail(request.getEmail());
    user.setActive(1);
   Role userRole = roleRepository.findByRole("ROLE_USER")
        .orElseThrow(() -> new RuntimeException("Role not found"));

user.setRoles(Set.of(userRole));

    user.setPassword(passwordEncoder.encode(request.getPassword()));
     // 🔥 encode it here

    return userRepository.save(user);
}
}