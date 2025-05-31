package com.cyberthreat;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class,
    org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration.class
})
public class CyberthreatApplication {

    public static void main(String[] args) {
        SpringApplication.run(CyberthreatApplication.class, args);
    }
@Configuration
class AppConfig {
	@Bean
	VectorStore vectorStore(EmbeddingClient embeddingClient) {
		return new SimpleVectorStore(embeddingClient);
	}
}
}
