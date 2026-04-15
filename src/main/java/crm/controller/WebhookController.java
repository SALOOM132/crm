package crm.controller;

import crm.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    private final TicketService ticketService;

    private static final String VERIFY_TOKEN = "3A8BnzfcGwwZQJXzlq0pkuyjoyv_5AMqXMdgypbA6XcCxEgMx";

    public WebhookController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 🔹 Webhook Verification (required by Meta)
    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.challenge") String challenge,
            @RequestParam("hub.verify_token") String token) {
        if ("subscribe".equals(mode) && VERIFY_TOKEN.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(403).body("Verification failed");
    }

    // 🔹 Receive messages
    @PostMapping
    public ResponseEntity<String> receiveMessage(@RequestBody Map<String, Object> payload) {

        try {
            System.out.println(payload);
            List<Map<String, Object>> entries = (List<Map<String, Object>>) payload.get("entry");

            if (entries != null && !entries.isEmpty()) {

                Map<String, Object> entry = entries.get(0);
                List<Map<String, Object>> messaging = (List<Map<String, Object>>) entry.get("messaging");

                if (messaging != null && !messaging.isEmpty()) {

                    Map<String, Object> messageEvent = messaging.get(0);
                    Map<String, Object> message = (Map<String, Object>) messageEvent.get("message");

                    if (message != null && message.get("text") != null) {
                        String text = message.get("text").toString();

                        ticketService.createTicket(text);
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("EVENT_RECEIVED");

    }
}