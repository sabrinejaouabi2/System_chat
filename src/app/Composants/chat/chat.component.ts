import { Component, OnDestroy, OnInit } from "@angular/core";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { IMessage } from "src/app/models/IMessage";
import { ChatService } from "src/app/Services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  stompClient: any; // Declare stompClient
  newMessage: string = ''; // Binding for input field
  messages: any[] = []; // Array of messages
  isConnected: boolean = false; // Track connection status

  constructor() {}

  ngOnInit() {
    this.connect(); // Automatically connect when the component is initialized
  }

  // Connect to WebSocket server
  connect() {
    const serverUrl = 'http://localhost:8080/ws/chat'; // Modify with your server URL
    const socket = new SockJS(serverUrl); // Create SockJS connection
    this.stompClient = Stomp.over(socket); // Initialize stompClient with SockJS

    this.stompClient.connect({}, () => {
      console.log("Connected");
      this.isConnected = true; // Set to true once connected
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        this.onMessageReceived(message.body);
      });
    }, (error: any) => {
      console.log("Connection error", error);
      this.isConnected = false; // Set to false if there is a connection error
    });
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log("Disconnected");
        this.isConnected = false; // Set to false once disconnected
      });
    }
  }

  // Send a message to the server
  sendMessage(content: string) {
    if (this.stompClient && this.stompClient.connected && content) {
      this.stompClient.send('/app/sendMessage', {}, JSON.stringify({ content: content }));
      this.newMessage = ''; // Clear the input after sending the message
    }
  }

  // Handle received messages
  onMessageReceived(message: string) {
    this.messages.push({ content: message }); // Add received message to the array
  }
}
