package crm.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

@Service
public class MessageSenderService {

    // 1. Remove 'static' from RestTemplate (Better for testing/configuration)
    private final RestTemplate restTemplate = new RestTemplate();

    // 2. Remove 'static' from these fields
    @Value("${facebook.page.access.token}")
    private String pageAccessToken;

    @Value("${meta.page.access.token}")
    private String igAccessToken;

    // 3. Methods MUST NOT be static to access the instance variables above
    public void sendMessengerReply(String recipientId, String text) {
        String url = "https://graph.facebook.com/v19.0/me/messages?access_token=" + pageAccessToken;
        sendReply(url, recipientId, text);
    }
    public void sendInstagramReply(String recipientId, String text) {
        String url = "https://graph.facebook.com/v19.0/me/messages?access_token=" + igAccessToken;
        sendReply(url, recipientId, text);
    }

    private void sendReply(String url, String recipientId, String text) {
        System.out.println("Calling Meta API: " + url);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "recipient", Map.of("id", recipientId),
            "message", Map.of("text", text)
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            String response = restTemplate.postForObject(url, request, String.class);
            System.out.println("Meta API response: " + response);
        } catch (Exception e) {
            System.err.println("Meta API error: " + e.getMessage());
        }
    }

    @PostConstruct
    public void init() {
        System.out.println("=== TOKEN CHECK ===");
        System.out.println("FB Token: " + (pageAccessToken != null ? "LOADED ✅" : "MISSING ❌"));
        System.out.println("IG Token: " + (igAccessToken != null ? "LOADED ✅" : "MISSING ❌"));
    }
    public String fetchUserName(String userId, String platform) {
    try {
        String token = "INSTAGRAM".equals(platform) ? igAccessToken : pageAccessToken;
        String url = "https://graph.facebook.com/v19.0/" + userId + "?fields=name&access_token=" + token;
        Map response = restTemplate.getForObject(url, Map.class);
        if (response != null && response.get("name") != null) {
            return response.get("name").toString();
        }
    } catch (Exception e) {
        System.err.println("Could not fetch name for " + userId + ": " + e.getMessage());
    }
    return null;
}

}
