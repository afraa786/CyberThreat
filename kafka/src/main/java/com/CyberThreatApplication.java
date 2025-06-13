package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.annotation.KafkaStreamsDefaultConfiguration;

@SpringBootApplication
@EnableKafka
public class CyberThreatApplication {
    public static void main(String[] args) {
        SpringApplication.run(CyberThreatApplication.class, args);
    }
}


