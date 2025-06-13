package com;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

// ThreatProducer.java
// This service is responsible for sending threat data to a Kafka topic
// It uses KafkaTemplate to send messages to the "threats-topic"
// It is annotated with @Service to indicate that it is a Spring service component
// It is a part of the com package, which is the main package for the Kafka application
// It is used in the Kafka application to produce threat messages that can be consumed by other service

@Service
public class ThreatProducer {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendThreat(String threatJson) {
        kafkaTemplate.send("threats-topic", threatJson);
    }
}
