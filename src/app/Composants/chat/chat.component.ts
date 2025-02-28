import { Component, OnInit } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];   // Liste des messages reçus
  newMessage: string = '';     // Message à envoyer
  isConnected: boolean = false;

  constructor(private websocketService: ChatService) { }

  ngOnInit(): void {
    // Activation de la connexion WebSocket
    this.websocketService.activate();

    // Souscription aux messages reçus
    this.websocketService.subscribeToMessages();

    // Vérification de la connexion
    this.websocketService.isConnected().subscribe(isConnected => {
      this.isConnected = isConnected;
    });

    // Écouter les messages reçus et les afficher
    this.websocketService.receiveMessages().subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  sendMessage(message: string) {
    if (message.trim()) {
      this.websocketService.sendMessage({ content: message });
      this.newMessage = ''; // Réinitialise le champ de message après envoi
    }
  }
}
