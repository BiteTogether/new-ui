import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import {
  Conversation,
  ConversationsList,
  CreateConversationRequest,
  UserConversationRequest,
  AddUserToConversationResponse,
  Message,
  SendMessageRequest,
  MessagesList,
} from "../../types/chat";

// Conversation
export const getConversation = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.GET.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<Conversation>(endpoint);
};

export const updateConversation = (
  conversationId: string,
  name: string,
  avatarUrl?: string,
) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.UPDATE.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.put<Conversation>(endpoint, { name, avatarUrl });
};

export const deleteConversation = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.DELETE.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.delete(endpoint);
};

export const getConversationsList = (cursor?: string, limit?: number) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.GET_LIST;
  return apiService.get<ConversationsList>(endpoint, {
    params: { cursor, limit },
  });
};

export const createConversation = (data: CreateConversationRequest) => {
  return apiService.post<Conversation>(
    API_ENDPOINTS.CHAT.CONVERSATIONS.CREATE,
    data,
  );
};

export const addUserToConversation = (data: UserConversationRequest) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.ADD_USER.replace(
    "{conversationId}",
    data.conversationId,
  ).replace("{userId}", data.userId.toString());
  return apiService.post<AddUserToConversationResponse>(endpoint);
};

export const removeUserFromConversation = (data: UserConversationRequest) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.REMOVE_USER.replace(
    "{conversationId}",
    data.conversationId,
  ).replace("{userId}", data.userId.toString());
  return apiService.delete(endpoint);
};

export const updateUserRoleInConversation = (data: UserConversationRequest) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.UPDATE_ROLE.replace(
    "{conversationId}",
    data.conversationId,
  ).replace("{userId}", data.userId.toString());
  return apiService.put(endpoint, {
    role: data.role,
  });
};

// Message
export const updateMessage = (messageId: string, content: string) => {
  const endpoint = API_ENDPOINTS.CHAT.MESSAGES.UPDATE.replace(
    "{messageId}",
    messageId,
  );
  return apiService.put<Message>(endpoint, { content });
};

export const deleteMessage = (messageId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.MESSAGES.DELETE.replace(
    "{messageId}",
    messageId,
  );
  return apiService.delete(endpoint);
};

export const sendMessage = (data: SendMessageRequest) => {
  return apiService.post<Message>(API_ENDPOINTS.CHAT.MESSAGES.SEND, data);
};

export const getMessagesList = (
  conversationId: string,
  cursor?: number,
  limit?: number,
) => {
  const endpoint = API_ENDPOINTS.CHAT.MESSAGES.GET_LIST.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<MessagesList>(endpoint, {
    params: { cursor, limit },
  });
};
