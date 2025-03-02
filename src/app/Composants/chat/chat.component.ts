import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/Services/chat.service';
import { UserService } from 'src/app/Services/user.service';
import { IMessage } from 'src/app/models/IMessage';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  newMessage: string = ''; // Liaison pour le champ de saisie
  messages: IMessage[] = []; // Tableau des messages reçus
  isConnected: boolean = false; // Statut de la connexion WebSocket
  selectedReceiverId: string | null = null;  // Dynamique selon la sélection du destinataire
  users: User[] = []; // Liste des utilisateurs disponibles

  constructor(private chatService: ChatService, private userService: UserService) {}

  ngOnInit() {
    // Récupérer les utilisateurs (par exemple, depuis un service ou une API)
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });

    // Récupérer les messages via le service Chat
    this.chatService.getMessages().subscribe((message: IMessage) => {
      this.onMessageReceived(message);
    });
  }

  ngOnDestroy() {
    this.chatService.disconnectWebSocket(); // Déconnexion lorsque le composant est détruit
  }

  // Envoi d'un message
  sendMessage() {
    if (this.newMessage.trim() && this.selectedReceiverId) {
      const senderId = this.userService.getCurrentUserId();  // Récupérer dynamiquement l'ID de l'expéditeur
      const receiverId = this.selectedReceiverId;  // Utilisation du receiverId en tant que string

      const message: IMessage = {
        senderId: senderId,  // Utilisation du number pour senderId
        receiverId: receiverId,  // Utilisation du string pour receiverId
        content: this.newMessage,
        timestamp: new Date().toISOString(),  // Format ISO 8601
      };

      this.chatService.sendMessage(message); // Envoi du message via le service
      this.newMessage = ''; // Réinitialiser le champ de saisie
    } else {
      console.error('Impossible d\'envoyer le message, veuillez sélectionner un destinataire et renseigner le message.');
    }
  }

  // Gestion de la réception des messages
  onMessageReceived(message: IMessage) {
    this.messages.push(message); // Ajouter le message à la liste des messages
  }

  // Sélection d'un destinataire
  selectReceiver(receiverId: string) {
    this.selectedReceiverId = receiverId;
  }
}
