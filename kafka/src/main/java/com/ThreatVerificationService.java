package com.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class ThreatVerificationService {

    private final String FLASK_API_URL = "http://localhost:5000/predict"; // or your container IP/service

    private final RestTemplate restTemplate = new RestTemplate();

    public String verifyThreat(Threat threat) {
    try {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("url", threat.getLocationUrl()); // assuming URL field
        requestBody.put("message", threat.getMessage());
        requestBody.put("evidence", threat.getEvidence());
        requestBody.put("type", threat.getType());
        requestBody.put("firstStep", threat.getFirstStep());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("prediction");
        } else {
            return "error";
        }
    } catch (Exception e) {
        e.printStackTrace();
        return "error";
    }
}

}
