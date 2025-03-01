import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { IMessage } from '../models/IMessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: any;
  private messageSubject: Subject<IMessage> = new Subject<IMessage>();  // Ensure the message type is IMessage

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/ws/chat';
    const socket = new SockJS(serverUrl);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        this.onMessageReceived(message.body);
      });
    });
  }

  private onMessageReceived(message: any) {
    const parsedMessage: IMessage = JSON.parse(message);
    this.messageSubject.next(parsedMessage);  // Emit parsed message
  }

  sendMessage(message: IMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        '/app/sendMessage',
        {},
        JSON.stringify(message)
      );
    }
  }

  getMessages() {
    return this.messageSubject.asObservable();  // Return as observable
  }
  connect(userEmail: string) {
    const serverUrl = `http://localhost:8080/ws/chat/${userEmail}`; // Adjust the URL if necessary
    const socket = new SockJS(serverUrl);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log("Connected");
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        this.onMessageReceived(message.body);
      });
    });
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log("Disconnected");
      });
    }
  }

}
