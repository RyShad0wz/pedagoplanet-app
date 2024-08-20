package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Message;
import com.cda.pedagoplanet.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public Optional<Message> getMessage(Long id) {
        return messageRepository.findById(id);
    }

    public List<Message> getMessagesBySender(Long senderId) {
        return messageRepository.findAllBySenderId(senderId);
    }

    public List<Message> getMessagesByReceiver(Long receiverId) {
        return messageRepository.findAllByReceiverId(receiverId);
    }

    public List<Message> getMessagesBetweenUsers(Long senderId, Long receiverId) {
        return messageRepository.findAllBySenderIdAndReceiverIdOrReceiverIdAndSenderId(senderId, receiverId, senderId, receiverId);
    }
}
