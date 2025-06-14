package com; // update if your package is different

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Threat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String type;
    private String threatDate;
    private String incidentLocation;
    // location
    private String locationUrl;
    private String moreInformation;
    private String evidence;
    private String reasonForDelay;
    private String firstStep;

    private LocalDateTime timestamp;
    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getThreatDate() {
        return threatDate;
    }
    public void setThreatDate(String threatDate) {
        this.threatDate = threatDate;
    }
    public String getIncidentLocation() {
        return incidentLocation;
    }
    public void setIncidentLocation(String incidentLocation) {
        this.incidentLocation = incidentLocation;
    }
    public String getLocationUrl() {
        return locationUrl;
    }
    public void setLocationUrl(String locationUrl) {
        this.locationUrl = locationUrl;
    }
    public String getMoreInformation() {
        return moreInformation;
    }
    public void setMoreInformation(String moreInformation) {
        this.moreInformation = moreInformation;
    }
    public String getEvidence() {
        return evidence;
    }
    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }
    public String getReasonForDelay() {
        return reasonForDelay;
    }
    public void setReasonForDelay(String reasonForDelay) {
        this.reasonForDelay = reasonForDelay;
    }
    public String getFirstStep() {
        return firstStep;
    }
    public void setFirstStep(String firstStep) {
        this.firstStep = firstStep;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }   
}