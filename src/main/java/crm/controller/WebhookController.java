package crm.controller;

import crm.dto.MessageRequest;
import crm.service.TicketService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    private final TicketService ticketService;

    public WebhookController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public String receiveWebhook(@RequestBody MessageRequest request) {

        // basic validation
        if (request.getContent() == null || request.getContent().isEmpty()) {
            return "IGNORED";
        }

        ticketService.createTicket(request.getContent());

        return "EVENT_RECEIVED";
    }
}
