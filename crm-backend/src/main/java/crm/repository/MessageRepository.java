package crm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import crm.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    int countByConversationId(Long conversationId);
}

