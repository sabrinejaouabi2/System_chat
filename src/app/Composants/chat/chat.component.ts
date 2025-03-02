import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/Services/chat.service';
import { IMessage } from 'src/app/models/IMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  newMessage: string = ''; // Liaison pour le champ de saisie
  messages: IMessage[] = []; // Tableau des messages reçus
  isConnected: boolean = false; // Statut de la connexion WebSocket

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getMessages().subscribe((message: IMessage) => {
      this.onMessageReceived(message); // Recevoir les messages du service
    });
  }

  ngOnDestroy() {
    this.chatService.disconnectWebSocket(); // Déconnexion lorsque le composant est détruit
  }

  // Envoi d'un message
  sendMessage() {
    if (this.newMessage.trim()) {
      const message: IMessage = {
        senderId: 1,  // Exemple d'ID de l'expéditeur
        receiverId: '2', // Exemple d'ID du destinataire
        content: this.newMessage,
        timestamp: new Date().toISOString(),
      };
      this.chatService.sendMessage(message); // Appel au service pour envoyer le message
      this.newMessage = ''; // Réinitialiser le champ de saisie
    }
  }

  // Gestion de la réception des messages
  onMessageReceived(message: IMessage) {
    this.messages.push(message); // Ajouter le message à la liste des messages
  }
}
