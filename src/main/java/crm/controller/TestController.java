package crm.controller;

import crm.dto.MessageRequest;
import crm.model.Ticket;
import crm.service.TicketService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/test")
public class TestController {

    private final TicketService ticketService;

    public TestController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public Ticket createticket(@RequestBody MessageRequest request) {
        return ticketService.createTicket(request.getContent());
    }
}
