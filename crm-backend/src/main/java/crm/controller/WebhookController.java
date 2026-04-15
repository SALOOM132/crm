package crm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import crm.service.ConversationService;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    private final ConversationService conversationService;

    @Value("${webhook.verify.token}")
    private String verifyToken;

    public WebhookController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.challenge") String challenge,
            @RequestParam("hub.verify_token") String token) {
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(403).body("Verification failed");
    }

    @PostMapping
    public ResponseEntity<String> receiveMessage(@RequestBody Map<String, Object> payload) {
        try {
            String platform = "MESSENGER";
            if ("instagram".equals(payload.get("object"))) {
                platform = "INSTAGRAM";
            }

            List<Map<String, Object>> entries = (List<Map<String, Object>>) payload.get("entry");
            if (entries != null && !entries.isEmpty()) {
                Map<String, Object> entry = entries.get(0);
                List<Map<String, Object>> messaging = (List<Map<String, Object>>) entry.get("messaging");

                if (messaging != null && !messaging.isEmpty()) {
                    Map<String, Object> messageEvent = messaging.get(0);
                    Map<String, Object> sender = (Map<String, Object>) messageEvent.get("sender");
                    String senderId = sender.get("id").toString();

                    Map<String, Object> message = (Map<String, Object>) messageEvent.get("message");
                    if (message != null && message.get("text") != null) {
                        String text = message.get("text").toString();
                        conversationService.handleIncomingMessage(senderId, text, platform);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("EVENT_RECEIVED");
    }
}
