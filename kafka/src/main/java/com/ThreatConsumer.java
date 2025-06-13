package com;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import java.time.LocalDateTime;


@Service
public class ThreatConsumer {

    @Autowired
    private ThreatRepository threatRepository;

    @KafkaListener(topics = "threats-topic", groupId = "cyber-threat-group")
    public void listen(String message) {
        System.out.println("Received Threat: " + message);
        String type = "Unidentified";

        if (message.toLowerCase().contains("phishing")) {
            System.out.println("[ALERT] Phishing threat detected!");
            type = "Phishing";
        } else if (message.toLowerCase().contains("malware")) {
            System.out.println("[ALERT] Malware threat detected!");
            type = "Malware";
        } else if (message.toLowerCase().contains("ransomware")) {
            System.out.println("[ALERT] Ransomware threat detected!");
            type = "Ransomware";
        } else if (message.toLowerCase().contains("ddos")) {
            System.out.println("[ALERT] DDoS attack detected!");
            type = "DDoS";
        } else if (message.toLowerCase().contains("sql injection")) {
            System.out.println("[ALERT] SQL Injection threat detected!");
            type = "SQL Injection";
        } else {
            System.out.println("[INFO] Threat type unidentified. Needs manual review.");
        }

        Threat threat = new Threat();
        threat.setMessage(message);
        threat.setType(type);
        threat.setTimestamp(LocalDateTime.now());
        threatRepository.save(threat);
    }
}