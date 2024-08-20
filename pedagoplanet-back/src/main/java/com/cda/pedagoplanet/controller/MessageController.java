package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.Message;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.MessageRequest;
import com.cda.pedagoplanet.entity.dto.MessageResponse;
import com.cda.pedagoplanet.service.MessageService;
import com.cda.pedagoplanet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @PostMapping("/sendMessage")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest messageRequest) {
        User sender = userService.findById(messageRequest.getSenderId()).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userService.findById(messageRequest.getReceiverId()).orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, messageRequest.getMessage());
        Message savedMessage = messageService.saveMessage(message);

        MessageResponse response = new MessageResponse();
        response.setId(savedMessage.getId());
        response.setSenderId(savedMessage.getSender().getId());
        response.setSenderFirstName(savedMessage.getSender().getFirstName());
        response.setSenderLastName(savedMessage.getSender().getLastName());
        response.setReceiverId(savedMessage.getReceiver().getId());
        response.setMessage(savedMessage.getMessage());
        response.setSentAt(savedMessage.getSentAt());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<MessageResponse>> getMessagesBetweenUsers(@PathVariable Long senderId, @PathVariable Long receiverId) {
        List<Message> messages = messageService.getMessagesBetweenUsers(senderId, receiverId);

        List<MessageResponse> response = messages.stream().map(message -> {
            MessageResponse res = new MessageResponse();
            res.setId(message.getId());
            res.setSenderId(message.getSender().getId());
            res.setSenderFirstName(message.getSender().getFirstName());
            res.setSenderLastName(message.getSender().getLastName());
            res.setReceiverId(message.getReceiver().getId());
            res.setMessage(message.getMessage());
            res.setSentAt(message.getSentAt());
            return res;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
