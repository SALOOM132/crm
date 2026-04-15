package crm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import crm.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Find existing conversation by sender and platform
    Optional<Conversation> findBySenderIdAndPlatform(String senderId, String platform);

    // Get all sorted by last message
    List<Conversation> findAllByOrderByLastMessageAtDesc();
}
