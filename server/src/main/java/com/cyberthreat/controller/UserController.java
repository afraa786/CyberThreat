package com.cyberthreat.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/security")
public class UserController {

    @GetMapping("/all")
    public String publicHello() {
        return "Public Endpoint: Hello, world!";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/secured/admin")
    public String adminHello() {
        return "Secured Endpoint (Admin): Hello Admin!";
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/secured/common")
    public String userOrAdminHello() {
        return "Secured Endpoint (User/Admin): Hello!";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/secured/user")
    public String userHello() {
        return "Secured Endpoint (User): Welcome user!";
    }
}
