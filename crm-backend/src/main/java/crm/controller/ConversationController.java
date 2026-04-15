package crm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crm.model.Conversation;
import crm.model.Message;
import crm.service.ConversationService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    // GET /conversations
    @GetMapping
    public List<Conversation> getAllConversations() {
        return conversationService.getAllConversations();
    }

    // GET /conversations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Conversation> getConversation(@PathVariable Long id) {
        return conversationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /conversations/{id}/messages
    @GetMapping("/{id}/messages")
    public List<Message> getMessages(@PathVariable Long id) {
        return conversationService.getMessages(id);
    }

    // POST /conversations/{id}/reply
    @PostMapping("/{id}/reply")
    public ResponseEntity<Conversation> reply(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Conversation updated = conversationService.replyToConversation(id, body.get("reply"));
        return ResponseEntity.ok(updated);
    }

    // PATCH /conversations/{id}/close
    @PatchMapping("/{id}/close")
    public ResponseEntity<Conversation> close(@PathVariable Long id) {
        Conversation updated = conversationService.closeConversation(id);
        return ResponseEntity.ok(updated);
    }
}
