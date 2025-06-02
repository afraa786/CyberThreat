package com.cyberthreat.controller;

import org.springframework.ai.chat.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class aiController {

	public static final String PROMPT = """
			You are a professional cybersecurity analyst. 
			Guide the user on threats like phishing, ransomware, and malware. Respond clearly and helpfully.
				""";

	private final ChatClient aiClient;

	public aiController(ChatClient aiClient) {
		this.aiClient = aiClient;
	}

	@GetMapping("/ask")
	public ResponseEntity<String> generateAdvice() {
		return ResponseEntity.ok(aiClient.call(PROMPT));
	}

}

