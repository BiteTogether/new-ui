// Conversation
export interface Conversation {
  createdAt: string;
  updatedAt: string;
  createdBy: "SYSTEM" | "USER";
  updatedBy: "SYSTEM" | "USER";
  id: string;
  type: "DIRECT" | "GROUP";
  name: string;
  avatarUrl: string;
  latestMessage: {
    createdAt: string;
    updatedAt: string;
    createdBy: "SYSTEM" | "USER";
    updatedBy: "SYSTEM" | "USER";
    id: string;
    conversationId: string;
    seq: number;
    senderId: number;
    type: "TEXT" | "IMAGE" | "FILE" | "EMOJI";
    content: string;
  };
  participants: [
    {
      createdAt: string;
      updatedAt: string;
      createdBy: "SYSTEM" | "USER";
      updatedBy: "SYSTEM" | "USER";
      id: string;
      userId: number;
      username: string;
      avatarUrl: string;
      role: "ADMIN" | "USER";
      lastReadMessageSequence: number;
      joinedAt: string;
    },
  ];
  unreadCount: number;
}

export interface ConversationsList {
  conversations: Conversation[];
  nextCursor: string | null;
  hasMore: boolean;
  size: number;
}

export interface CreateConversationRequest {
  type: "DIRECT" | "GROUP";
  name?: string;
  avatarUrl?: string;
  participantIds: number[];
}

export interface UserConversationRequest {
  conversationId: string;
  userId: number;
  role?: "ADMIN" | "MEMBER";
}

export interface AddUserToConversationResponse {
  createdAt: string;
  updatedAt: string;
  createdBy: "SYSTEM" | "USER";
  updatedBy: "SYSTEM" | "USER";
  id: string;
  userId: number;
  username: string;
  avatarUrl: string;
  role: "ADMIN" | "USER";
  lastReadMessageSequence: number;
  joinedAt: string;
}

// Message
export interface Message {
  createdAt: string;
  updatedAt: string;
  createdBy: "SYSTEM" | "USER";
  updatedBy: "SYSTEM" | "USER";
  id: string;
  conversationId: string;
  seq: number;
  senderId: number;
  type: "TEXT" | "IMAGE" | "FILE" | "EMOJI";
  content: string;
}

export interface SendMessageRequest {
  conversationId: string;
  action: "SEND";
  messageType: "TEXT" | "IMAGE" | "FILE" | "EMOJI";
  content: string;
}

export interface MessagesList {
  messages: Message[];
  nextCursor: number | null;
  hasMore: boolean;
  size: number;
}
