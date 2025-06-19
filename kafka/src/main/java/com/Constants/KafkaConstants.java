package com.Constants;

public class KafkaConstants {
    public static final String KAFKA_TOPIC = "kafka-chat-3";
    public static final String GROUP_ID = "kafka-sandbox";
    public static final String KAFKA_BROKER = "localhost:9092";
}

// This class contains constants used for Kafka configuration in the application.
// KAFKA_TOPIC: The topic to which messages will be published and from which they will be consumed.
// GROUP_ID: The consumer group ID for Kafka consumers.
// KAFKA_BROKER: The address of the Kafka broker to connect to.