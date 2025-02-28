package com.example.MessengerApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MessengerApp.model.Message;
import com.example.MessengerApp.service.MessageService;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:4200") // Autoriser les requêtes depuis localhost:4200

public class ChatController {
    @Autowired private MessageService messageService;
@MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message) {
        return messageService.saveMessage(message);
    }
      @GetMapping("/history/{senderId}/{receiverId}")
    public List<Message> getChatHistory(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return messageService.getMessages(senderId, receiverId);
    }
}
