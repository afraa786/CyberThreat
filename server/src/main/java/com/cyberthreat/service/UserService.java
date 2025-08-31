package com.cyberthreat.service;

import com.cyberthreat.model.User;
import com.cyberthreat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

     public List<User> allUsers() {
        return userRepository.findAll();
    }

    
}