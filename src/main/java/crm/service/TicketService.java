package crm.service;

import crm.dto.AiResponse;
import crm.model.Ticket;
import crm.model.enumerations.StatusEnum;
import crm.repository.TicketRepository;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AiService aiService;

    public TicketService(TicketRepository ticketRepository,
                         AiService aiService) {
        this.ticketRepository = ticketRepository;
        this.aiService = aiService;
    }

    public Ticket createTicket(String message) {

        Ticket ticket = new Ticket();
        ticket.setMessage(message);
        ticket.setStatus(StatusEnum.OPEN);

        try {
            AiResponse aiResult = aiService.detectIntent(message);

            ticket.setIntent(aiResult.getIntent());
            ticket.setConfidence(aiResult.getConfidence());

        } catch (Exception e) {
            // If AI fails, still create ticket
            ticket.setIntent("unknown");
            ticket.setConfidence(0.0);
        }

        return ticketRepository.save(ticket);
    }

    public Ticket replyToTicket(Long id, String reply) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(StatusEnum.CLOSED);
        ticket.setReply(reply);

        return ticketRepository.save(ticket);
    }
}