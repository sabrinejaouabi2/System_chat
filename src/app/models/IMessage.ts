export interface IMessage {
  senderId: number | null;  // senderId peut être null
  receiverId: string; // Correspond au String dans Spring
  content: string;    // Contenu du message
  timestamp: string;  // Horodatage du message (en ISO 8601, similaire à LocalDateTime)
}
