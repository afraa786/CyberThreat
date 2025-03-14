package com.cyberthreat.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class ThreatReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String threatType; // phishing/malware
    private String description;

    @Column(name = "reporter_id")
    private Long reporterId;

    private LocalDateTime timestamp = LocalDateTime.now();
} 
