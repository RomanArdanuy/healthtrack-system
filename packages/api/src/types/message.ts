export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
    attachments?: string[]; // URLs o identificadores de archivos adjuntos
  }
  
  export interface Conversation {
    id: string;
    participantIds: string[]; // Los dos IDs de usuarios en la conversación
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
  }