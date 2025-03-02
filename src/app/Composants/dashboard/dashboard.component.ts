import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
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

      // Trouver l'utilisateur dans la liste des utilisateurs
      const receiver = this.users.find(user => user.email === receiverEmail);

      if (receiver) {
        // Si l'utilisateur est trouvé, utiliser son nom
        this.receiverEmail = receiverEmail;

        // Demander un message personnalisé dès le début
        this.message = `Hello, ${receiver.firstName || receiver.name || 'utilisateur'}!`; // Message personnalisé avec le nom du destinataire
      } else {
        console.error('Utilisateur non trouvé');
      }
    }
  }

  onSendMessage(): void {
    if (this.message.trim() && this.receiverEmail) {
      const message: IMessage = {
        senderId: this.currentUser.id,
        receiverId: this.receiverEmail, // Si tu veux envoyer l'email ou un autre identifiant, ajuste cela
        content: this.message,  // Le message saisi par l'utilisateur
        timestamp: new Date().toISOString()
      };
      console.log('Message à envoyer:', message);  // Affiche le message à envoyer
      this.chatService.sendMessage(message);  // Envoie le message via le service
      this.message = '';  // Réinitialiser le champ de saisie après envoi
    } else {
      console.log('Erreur: message vide ou destinataire non sélectionné');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  logout(): void {
    // Supprimer le token d'authentification
    this.authService.logout();

    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
    console.log('Utilisateur déconnecté');
  }


}
