package crm.service;

import crm.model.Ticket;
import crm.repository.TicketRepository;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(String message) {
        Ticket ticket = new Ticket(message, "OPEN");
        return ticketRepository.save(ticket);
    }
}
