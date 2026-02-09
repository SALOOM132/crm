package crm.controller;

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
    public Ticket create(@RequestBody String message) {
        return ticketService.createTicket(message);
    }
}
