package com.example.MessengerApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MessengerApp.model.User;
import com.example.MessengerApp.service.UserService;
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200") // Autoriser les requêtes depuis localhost:4200

public class UserController {
 @Autowired
    private UserService userService;

@GetMapping
public List<User> getAllUsers() {
    return userService.getAllUsers();
}
@GetMapping("/currentUser")
public User getCurrentUser(@RequestParam String username) {
    return userService.getCurrentUser(username);  // Appel de la méthode dans le service
}
}