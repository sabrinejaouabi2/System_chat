import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;
  private connectedSubject: Subject<boolean> = new Subject();
  private messageSubject: Subject<Message> = new Subject();
  constructor() {
    // Initialisation du client WebSocket
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws/chat'),
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Connecté au WebSocket');
        this.connectedSubject.next(true); // Indique que la connexion est réussie
      },
      onDisconnect: () => {
        console.log('❌ Déconnecté du WebSocket');
        this.connectedSubject.next(false); // Indique que la connexion a été perdue
        this.reconnect(); // Tente de se reconnecter après une déconnexion
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP:', frame);
        this.reconnect(); // Reconnexion en cas d'erreur STOMP
      },
      onWebSocketError: (event) => {
        console.error('Erreur WebSocket:', event);
      }
    });
  }

  // Méthode pour activer la connexion WebSocket
  activate() {
    this.client.activate();
  }

  // Tentative de reconnexion après une perte de connexion
  private reconnect() {
    console.log('🔄 Tentative de reconnexion...');
    setTimeout(() => {
      this.client.activate(); // Réactive la connexion après un délai
    }, 5000);
  }

  // Vérifie si la connexion est établie
  isConnected(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  // Envoie un message seulement si la connexion est établie
  sendMessage(message: any): void {
    this.isConnected().subscribe(isConnected => {
      if (isConnected && this.client.connected) {
        this.client.publish({
          destination: '/app/send-message',
          body: JSON.stringify(message)
        });
        console.log('📩 Message envoyé:', message);
      } else {
        console.log('🔴 WebSocket n\'est pas encore connecté, veuillez réessayer plus tard.');
      }
    });
  }

  // Reçoit des messages via WebSocket
  receiveMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  // Méthode d'abonnement pour recevoir les messages en temps réel
  subscribeToMessages() {
    this.client.subscribe('/topic/chat', (message: Message) => {
      this.messageSubject.next(message);
    });
  }
}
