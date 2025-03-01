package com.example.MessengerApp.controller;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MessengerApp.config.JwtUtil;
import com.example.MessengerApp.model.AuthResponse;
import com.example.MessengerApp.model.User;
import com.example.MessengerApp.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200") // Autoriser les requêtes depuis localhost:4200

public class AuthController {
     @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
        private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
@PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }
    
  
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {
    // Récupérer l'utilisateur par son email
    Optional<User> existingUserOptional = userRepository.findByEmail(user.getEmail());
    
    if (!existingUserOptional.isPresent()) {  // Using isPresent() instead of isEmpty()
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
    }

    User existingUser = existingUserOptional.get();
    
    // Vérification du mot de passe
    if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe incorrect");
    }

    // Génération du token JWT
    String token = jwtUtil.generateToken(user.getEmail());
    
    // Retourner l'objet AuthResponse avec l'utilisateur et le token
    return ResponseEntity.ok(new AuthResponse(existingUser, token));  // Returning AuthResponse containing user and token
}

}
