package com.cyberthreat.repository;

import com.cyberthreat.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRole(String role); // e.g., ROLE_ADMIN, ROLE_USER
}
