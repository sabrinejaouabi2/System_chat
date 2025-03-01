// IMessage.ts
export interface IMessage {
  senderId: string;   // ID de l'expéditeur
  receiverId: string;  // ID du destinataire
  content: string;     // Contenu du message
  timestamp: string;   // Horodatage du message
}
