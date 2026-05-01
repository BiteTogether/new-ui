// Conversation
export interface Conversation {
  createdAt: string;
  updatedAt: string;
  createdBy: "SYSTEM" | "USER";
  updatedBy: "SYSTEM" | "USER";
  id: string;
  type: "DIRECT" | "GROUP";
  name: string;
  avatarUrl: string | null;
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
      chatUserSnapshot: {
        userId: number;
        username: string;
        fullName: string;
        phoneNumber: string;
        avatar: string | null;
      };
      role: "ADMIN" | "MEMBER";
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
  avatarUrl: string | null;
  role: "ADMIN" | "MEMBER";
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

// Vote
export interface VoteOption {
  placeId: string;
  name: string;
  address: string;
}

export interface CreateVoteRequest {
  conversationId: string;
  name: string;
  options: VoteOption[];
}

export interface VoteSession {
  id: string;
  conversationId: string;
  createdBy: number;
  name: string;
  status: "OPEN" | "CLOSED";
  options: [
    {
      id: string;
      placeId: string;
      name: string;
      address: string;
    },
  ];
  votes: Record<string, string>; // userId: optionId
  winnerOptionId: string;
  closedAt: string;
}

export type VoteList = VoteSession[];

// Bill
export interface CreateBillRequest {
  conversationId: string;
  voteSessionId: string;
  currency: string;
  totalAmount: number;
  splitType: "EQUAL" | "CUSTOM";
  customSplits?: {
    userId: number;
    amount: number;
  }[];
}

export interface BillSession {
  id: string;
  conversationId: string;
  voteSessionId: string;
  createdBy: number;
  currency: string;
  totalAmount: number;
  status: "DRAFT" | "FINALIZED" | "SETTLED";
  splitType: "EQUAL" | "CUSTOM";
  shares: [
    {
      userId: number;
      amount: number;
      paidAmount: number;
      paid: boolean;
      status: "UNPAID" | "PARTIAL" | "PAID";
    },
  ];
}

export type BillList = BillSession[];
