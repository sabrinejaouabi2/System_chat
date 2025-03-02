import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IMessage } from "src/app/models/IMessage";
import { AuthService } from "src/app/Services/auth.service";
import { ChatService } from "src/app/Services/chat.service";
import { UserService } from "src/app/Services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  users: any[] = [];
  message: string = '';
  messages: IMessage[] = [];
  errorMessage: string = '';
  private unsubscribe$ = new Subject<void>();
  receiverEmail: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userEmail = this.authService.getUserEmail();
    console.log('Email récupéré:', userEmail);  // Affiche l'email récupéré

    if (userEmail) {
      // Récupérer les données utilisateur
      this.userService.getCurrentUser(userEmail).subscribe(
        (response) => {
          this.currentUser = response;
          console.log('Utilisateur récupéré:', this.currentUser);  // Affiche l'utilisateur récupéré
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération de l\'utilisateur';
          console.error('Erreur:', error);
        }
      );

      // Récupérer tous les utilisateurs
      this.userService.getAllUsers().subscribe(
        (users) => {
          this.users = users;
          console.log('Utilisateurs récupérés:', this.users);  // Affiche la liste des utilisateurs récupérés
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des utilisateurs';
          console.error('Erreur:', error);
        }
      );

      // Souscription aux messages
      this.chatService.getMessages().subscribe(
        (message: IMessage) => {
          this.messages.push(message); // Ajouter le message reçu
          console.log('Message reçu:', message);  // Affiche le message reçu
        },
        (error) => {
          console.error('Erreur lors de la réception des messages:', error);
        }
      );
    }
}

startChat(receiverEmail: string): void {
    if (this.currentUser) {
      console.log(`Démarrage du chat avec ${receiverEmail}`);  // Affiche quand le chat démarre avec un destinataire
      this.receiverEmail = receiverEmail;
      this.chatService.sendMessage({ // Envoi du message
        senderId: this.currentUser.id,
        receiverId: receiverEmail,
        content: 'Hello!',
        timestamp: new Date().toISOString()
      });
    }
}

onSendMessage(): void {
    if (this.message.trim() && this.receiverEmail) {
      const message: IMessage = {
        senderId: this.currentUser.id,
        receiverId: this.receiverEmail,
        content: this.message,
        timestamp: new Date().toISOString()
      };
      console.log('Message à envoyer:', message);  // Affiche le message à envoyer
      this.chatService.sendMessage(message);
      this.message = '';
    } else {
      console.log('Erreur: message vide ou destinataire non sélectionné');
    }
}


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
