package com.cda.pedagoplanet.entity.dto;

import java.time.LocalDateTime;

public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private Long receiverId;
    private String message;
    private LocalDateTime sentAt;

    public MessageResponse() {
    }

    public MessageResponse(Long id, Long id1, String firstName, String lastName, Long id2, String message, LocalDateTime sentAt) {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderId() {
        return senderId;
    }
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderFirstName() {
        return senderFirstName;
    }
    public void setSenderFirstName(String senderFirstName) {
        this.senderFirstName = senderFirstName;
    }

    public String getSenderLastName() {
        return senderLastName;
    }
    public void setSenderLastName(String senderLastName) {
        this.senderLastName = senderLastName;
    }

    public Long getReceiverId() {
        return receiverId;
    }
    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}

