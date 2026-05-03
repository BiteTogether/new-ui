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
  CreateVoteRequest,
  VoteSession,
  CreateBillRequest,
  BillSession,
  VoteList,
  BillList,
  GetUserLocationsResponse,
} from "../../types/chat";
import { UploadImage } from "../../types/user";

// Conversation
export const getConversation = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.GET.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<Conversation>(endpoint);
};

export const updateConversation = (conversationId: string, name: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.UPDATE.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.put<Conversation>(endpoint, { name });
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

export const addUserToConversation = (
  conversationId: string,
  userIds: number[],
) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.ADD_USER.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.post<AddUserToConversationResponse>(endpoint, { userIds });
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
  return apiService.patch(endpoint, null, { params: { role: data.role } });
};

export const getConversationById = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.GET_BY_ID.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<Conversation>(endpoint);
};

export const getConversationLocations = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.GET_LOCATIONS.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<GetUserLocationsResponse[]>(endpoint);
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

export const uploadConversationAvatar = (
  conversationId: string,
  avatarFile: UploadImage,
) => {
  const endpoint = API_ENDPOINTS.CHAT.CONVERSATIONS.UPLOAD_AVATAR.replace(
    "{conversationId}",
    conversationId.toString(),
  );
  const formData = new FormData();
  formData.append("file", avatarFile as any);
  return apiService.uploadFile(endpoint, formData);
};

// Vote
export const createVoteSession = (data: CreateVoteRequest) => {
  return apiService.post<VoteSession>(API_ENDPOINTS.CHAT.VOTE.CREATE, data);
};

export const closeVoteSession = (voteSessionId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.VOTE.CLOSE.replace(
    "{voteSessionId}",
    voteSessionId,
  );
  return apiService.post<VoteSession>(endpoint);
};

export const castVote = (voteSessionId: string, optionId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.VOTE.CAST.replace(
    "{voteSessionId}",
    voteSessionId,
  );
  return apiService.post(endpoint, { optionId });
};

export const getVoteSessions = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.VOTE.GET.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<VoteList>(endpoint);
};

export const getVoteSessionById = (voteSessionId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.VOTE.GET_BY_ID.replace(
    "{voteSessionId}",
    voteSessionId,
  );
  return apiService.get<VoteSession>(endpoint);
};

// Bill
export const createBillSession = (data: CreateBillRequest) => {
  return apiService.post<BillSession>(API_ENDPOINTS.CHAT.BILL.CREATE, data);
};

export const confirmBillPayment = (billSessionId: string, userId: number) => {
  const endpoint = API_ENDPOINTS.CHAT.BILL.CONFIRM_PAYMENT.replace(
    "{billSessionId}",
    billSessionId,
  );
  return apiService.post<BillSession>(endpoint, { userId });
};

export const finalizeBillSession = (billSessionId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.BILL.FINALIZE.replace(
    "{billSessionId}",
    billSessionId,
  );
  return apiService.post<BillSession>(endpoint);
};

export const getBillSessions = (conversationId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.BILL.GET.replace(
    "{conversationId}",
    conversationId,
  );
  return apiService.get<BillList>(endpoint);
};

export const getBillSessionById = (billSessionId: string) => {
  const endpoint = API_ENDPOINTS.CHAT.BILL.GET_BY_ID.replace(
    "{billSessionId}",
    billSessionId,
  );
  return apiService.get<BillSession>(endpoint);
};
