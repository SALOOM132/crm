package crm.service;

import crm.dto.AiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiService {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String url;

    public AiService() {
        this.restTemplate = new RestTemplate();
    }

    public AiResponse detectIntent(String message) {

        Map<String, String> request = Map.of("message", message);

        try {
            return restTemplate.postForObject(url, request, AiResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage());
        }
    }
}