package com.cyberthreat.service;
import org.springframework.ai.chat.ChatClient;
import org.springframework.stereotype.Service;
@Service
public class CyberChatService {

    private final ChatClient chatClient;

    public CyberChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String getResponse(String userInput) {
        return chatClient.call(userInput);
    }
}
