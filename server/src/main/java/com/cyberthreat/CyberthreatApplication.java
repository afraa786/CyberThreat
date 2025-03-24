package com.cyberthreat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
	org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class
})
public class CyberthreatApplication {

	public static void main(String[] args) {
		SpringApplication.run(CyberthreatApplication.class, args);
	}

}
