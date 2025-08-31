package com.cyberthreat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public Map<String, Object> test() {
        System.out.println("=== /api/test called ===");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello World");
        response.put("success", true);
        response.put("timestamp", System.currentTimeMillis());
        
        System.out.println("Response: " + response);
        return response;
    }

    @GetMapping("/api/test-string")
    public String testString() {
        System.out.println("=== /api/test-string called ===");
        return "Simple string response";
    }
}