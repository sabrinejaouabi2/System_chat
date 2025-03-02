export interface IMessage {
  senderId: number;  // Utiliser un nombre pour l'ID de l'expéditeur
  receiverId: string; // ID du destinataire sous forme de chaîne
  content: string;    // Contenu du message
  timestamp: string;  // Horodatage du message
}
