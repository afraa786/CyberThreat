package com.cyberthreat.kafka;

import com.cyberthreat.entity.ThreatReport;
import com.cyberthreat.repository.ThreatReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ThreatReportConsumer {

    @Autowired
    private ThreatReportRepository repository;

    @KafkaListener(topics = "threat-reports", groupId = "threat-group")
    public void consume(String message) {
        // Parse message and save to database
        ThreatReport report = new ThreatReport();
        // Logic to parse message and populate report
        repository.save(report);
    }
}
