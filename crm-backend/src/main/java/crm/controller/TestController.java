package crm.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crm.dto.MessageRequest;
import crm.model.Conversation;
import crm.service.ConversationService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/test")
public class TestController {

    private final ConversationService conversationService;

    public TestController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping
    public Conversation createTest(@RequestBody MessageRequest request) {
        return conversationService.handleIncomingMessage(
            "test-user",
            request.getContent(),
            "TEST"
        );
    }
}
