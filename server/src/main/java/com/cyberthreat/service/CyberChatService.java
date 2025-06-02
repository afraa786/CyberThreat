// import org.springframework.ai.chat.ChatCompletionResponse;
// import reactor.core.publisher.Mono;

// @Service
// public class CyberChatService {

//     private final ChatClient chatClient;

//     public CyberChatService(ChatClient chatClient) {
//         this.chatClient = chatClient;
//     }

//     public String getResponse(String userInput) {
//         Mono<ChatCompletionResponse> responseMono = chatClient.call(userInput);
        
//         // block() waits for the response synchronously
//         ChatCompletionResponse response = responseMono.block();

//         if (response != null && !response.choices().isEmpty()) {
//             return response.choices().get(0).message().content();
//         }
//         return "No response from AI";
//     }
// }
