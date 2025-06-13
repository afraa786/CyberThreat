package com;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/threats")
public class ThreatController {

    @Autowired
    private ThreatProducer producer;

    @PostMapping("/report")
    public ResponseEntity<String> reportThreat(@RequestBody Threat threat) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String threatJson = mapper.writeValueAsString(threat);
            producer.sendThreat(threatJson);
            return ResponseEntity.ok("Threat reported successfully");
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing threat data");
        }
    }
}
