package com.example.MessengerApp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MessengerApp.model.Message;
import com.example.MessengerApp.repository.MessageRepository;
@Service
public class MessageService {
@Autowired
    private MessageRepository messageRepository;
    // Sauvegarde un message dans la base de données
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    // Récupère l'historique des messages entre deux utilisateurs
    public List<Message> getMessages(Long senderId, Long receiverId) {
        return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }
}
