package crm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import crm.dto.AiResponse;
import crm.model.Conversation;
import crm.model.Message;
import crm.model.enumerations.StatusEnum;
import crm.repository.ConversationRepository;
import crm.repository.MessageRepository;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final AiService aiService;
    private final MessageSenderService messageSenderService;

    public ConversationService(ConversationRepository conversationRepository,
                                MessageRepository messageRepository,
                                AiService aiService,
                                MessageSenderService messageSenderService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.aiService = aiService;
        this.messageSenderService = messageSenderService;
    }

    // Called when a new message arrives from webhook or test
    public Conversation handleIncomingMessage(String senderId, String content, String platform) {

        // Find existing conversation or create a new one
        Conversation conversation = conversationRepository
                .findBySenderIdAndPlatform(senderId, platform)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setSenderId(senderId);
                    c.setPlatform(platform);
                    c.setStatus(StatusEnum.OPEN);
                    return c;
                });

        // Detect intent from ML
        try {
            AiResponse aiResult = aiService.detectIntent(content);
            double confidence = aiResult.getConfidence();
            String intent = aiResult.getIntent();
            if (confidence < 0.7) intent = "unknown";
            conversation.setIntent(intent);
            conversation.setConfidence(confidence);
        } catch (Exception e) {
            conversation.setIntent("unknown");
            conversation.setConfidence(0.0);
        }

        // Reopen if was closed
        conversation.setStatus(StatusEnum.OPEN);
        conversation.setLastMessageAt(System.currentTimeMillis());

        conversationRepository.save(conversation);
        if (conversation.getSenderName() == null && !"TEST".equals(platform)) {
            String name = messageSenderService.fetchUserName(senderId, platform);
            if (name != null) {
                    conversation.setSenderName(name);
                    conversationRepository.save(conversation);
            }
        }


        // Add incoming message
        Message message = new Message();
        message.setContent(content);
        message.setDirection("USER");
        message.setCreatedAt(System.currentTimeMillis());
        message.setConversation(conversation);
        messageRepository.save(message);

        return conversation;
    }

    // Agent replies
    public Conversation replyToConversation(Long conversationId, String replyContent) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Save reply as a message
        Message message = new Message();
        message.setContent(replyContent);
        message.setDirection("AGENT");
        message.setCreatedAt(System.currentTimeMillis());
        message.setConversation(conversation);
        messageRepository.save(message);

        conversation.setLastMessageAt(System.currentTimeMillis());

        // Send via Meta API
        try {
            if ("INSTAGRAM".equals(conversation.getPlatform())) {
                messageSenderService.sendInstagramReply(conversation.getSenderId(), replyContent);
            } else if ("MESSENGER".equals(conversation.getPlatform())) {
                messageSenderService.sendMessengerReply(conversation.getSenderId(), replyContent);
            }
        } catch (Exception e) {
            System.err.println("Failed to send reply: " + e.getMessage());
        }

        return conversationRepository.save(conversation);
    }


    // Close conversation
    public Conversation closeConversation(Long id) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversation.setStatus(StatusEnum.CLOSED);
        return conversationRepository.save(conversation);
    }

    public List<Conversation> getAllConversations() {
    List<Conversation> conversations = conversationRepository.findAllByOrderByLastMessageAtDesc();
    conversations.forEach(c -> {
        int count = messageRepository.countByConversationId(c.getId());
        c.setMessageCount(count);
    });
    return conversations;
}


    public Optional<Conversation> findById(Long id) {
        return conversationRepository.findById(id);
    }

    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
