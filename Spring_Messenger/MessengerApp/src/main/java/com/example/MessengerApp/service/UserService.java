package com.example.MessengerApp.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MessengerApp.config.JwtUtil;
import com.example.MessengerApp.model.User;
import com.example.MessengerApp.repository.UserRepository;
@Service

public class UserService {
        private final UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    private Set<String> connectedUsers = new HashSet<>();

        
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
 // Ajouter un utilisateur à la liste des connectés
    public void addConnectedUser(String email) {
        connectedUsers.add(email);
    }

    // Retirer un utilisateur de la liste des connectés
    public void removeConnectedUser(String email) {
        connectedUsers.remove(email);
    }

    // Retourne la liste des utilisateurs connectés
    public List<String> getConnectedUsers() {
        return new ArrayList<>(connectedUsers);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

 
   // Méthode pour récupérer un utilisateur par son nom d'utilisateur
public User getCurrentUser(String name) {
    // Utilisation de la méthode findByUsername du repository
    Optional<User> user = userRepository.findByName(name);
    return user.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
}

    
}
