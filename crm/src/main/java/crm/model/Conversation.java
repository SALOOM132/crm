
package crm.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import crm.model.enumerations.StatusEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;

@Entity

public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String senderName;
    private String senderId;
    private String platform;


    @Enumerated(EnumType.STRING)
    private StatusEnum status = StatusEnum.OPEN;

    // Last detected intent from ML
    private String intent;
    private Double confidence;

    // Timestamp of last message (for sorting)
    private Long lastMessageAt;
    

    @JsonIgnoreProperties({"conversation"})
@OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
@OrderBy("createdAt ASC")
private List<Message> messages = new ArrayList<>();

    public Conversation() {}

    public Long getId() { return id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public StatusEnum getStatus() { return status; }
    public void setStatus(StatusEnum status) { this.status = status; }

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Long getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Long lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }



    @Transient
    private int messageCount;
    public int getMessageCount() { return messageCount; }
    public void setMessageCount(int messageCount) { this.messageCount = messageCount; }
}


