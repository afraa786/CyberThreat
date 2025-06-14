package com;
import org.springframework.stereotype.Component;


public class PredictionResponse {
    private String prediction;

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }
}
