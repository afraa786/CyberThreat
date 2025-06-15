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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));
        return new CustomUserDetails(user);
    }

 
  public Users registerUser(RegisterRequest request) {
    Users user = new Users();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setName(request.getName());
    user.setLastName(request.getLastName());
  user.setActive(1);
    user.setIsVerified(true); // Skip verification
    user.setRole(request.getRole().toUpperCase());

    // Save the user first
    Users savedUser = userRepository.save(user);

    // Fetch the role
    Role role = roleRepository.findByRole(request.getRole().toUpperCase())
            .orElseThrow(() -> new RuntimeException("Role not found"));

    // Map role to user
    savedUser.getRoles().add(role);

    // Save again to persist role mapping
    return userRepository.save(savedUser);
}

}