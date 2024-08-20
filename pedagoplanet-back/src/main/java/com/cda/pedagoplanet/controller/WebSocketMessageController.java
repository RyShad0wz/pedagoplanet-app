package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.Message;
import com.cda.pedagoplanet.entity.Notification;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.MessageRequest;
import com.cda.pedagoplanet.entity.dto.MessageResponse;
import com.cda.pedagoplanet.service.MessageService;
import com.cda.pedagoplanet.service.NotificationService;
import com.cda.pedagoplanet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketMessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MessageRequest messageRequest) {
        User sender = userService.findById(messageRequest.getSenderId()).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userService.findById(messageRequest.getReceiverId()).orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, messageRequest.getMessage());
        Message savedMessage = messageService.saveMessage(message);

        Notification notification = new Notification(receiver, "Nouveau message de " + sender.getFirstName() + " " + sender.getLastName(), sender.getId(), "MESSAGE");
        notificationService.saveNotification(notification);

        MessageResponse response = new MessageResponse(
                savedMessage.getId(),
                savedMessage.getSender().getId(),
                savedMessage.getSender().getFirstName(),
                savedMessage.getSender().getLastName(),
                savedMessage.getReceiver().getId(),
                savedMessage.getMessage(),
                savedMessage.getSentAt()
        );

        messagingTemplate.convertAndSendToUser(receiver.getId().toString(), "/queue/messages", response);
        messagingTemplate.convertAndSendToUser(sender.getId().toString(), "/queue/messages", response);
    }
}
