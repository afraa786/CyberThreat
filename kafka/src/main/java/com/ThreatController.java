package com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
@RestController
@RequestMapping("/threats")
public class ThreatController {

    @Autowired
    private ThreatProducer producer;

    @Autowired
    private ThreatVerificationService verificationService;

    @PostMapping("/report")
    public ResponseEntity<String> reportThreat(@RequestBody Threat threat) {
        ObjectMapper mapper = new ObjectMapper();

        // Step 1: Verify with ML model
        String result = verificationService.verifyThreat(threat.getUrl());

        if ("phishing".equals(result)) {
            try {
                String threatJson = mapper.writeValueAsString(threat);
                producer.sendThreat(threatJson);  // Send only if phishing
                return ResponseEntity.ok("Phishing threat reported successfully");
            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing threat data");
            }
        } else if ("safe".equals(result)) {
            return ResponseEntity.ok("URL is safe. No action taken.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("ML service unreachable or failed.");
        }
    }

    @PostMapping("/verify")
    public String verifyThreat(@RequestBody Threat threat) {
    return threatVerificationService.verifyThreat(threat);
    }
    
    @GetMapping("/status")
    public String status() {
        return "Threat reporting service is running";
    }

}
