import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getConversationsList,
  sendMessage,
  getMessagesList,
  deleteMessage,
  updateMessage,
  createConversation,
  deleteConversation,
  getConversationById,
  updateConversation,
  removeUserFromConversation,
  updateUserRoleInConversation,
  addUserToConversation,
  createVoteSession,
  closeVoteSession,
  castVote,
  getVoteSessions,
  getVoteSessionById,
  createBillSession,
  confirmBillPayment,
  finalizeBillSession,
  getBillSessions,
  getBillSessionById,
  getConversationLocations,
} from "../../services/api/chatApi";
import {
  SendMessageRequest,
  CreateConversationRequest,
  UserConversationRequest,
  CreateVoteRequest,
  CreateBillRequest,
} from "../../types/chat";

// Conversations
export const userGetConversations = createAsyncThunk(
  "chat/getConversations",
  async (
    { cursor, limit }: { cursor?: string; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await getConversationsList(cursor, limit);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userCreateConversation = createAsyncThunk(
  "chat/createConversation",
  async (data: CreateConversationRequest, { rejectWithValue }) => {
    try {
      const response = await createConversation(data);
      if (
        (response.status === 201 || response.status === 200) &&
        response.data
      ) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userDeleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await deleteConversation(conversationId);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetConversationById = createAsyncThunk(
  "chat/getConversationById",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await getConversationById(conversationId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userUpdateConversation = createAsyncThunk(
  "chat/updateConversation",
  async (
    { conversationId, name }: { conversationId: string; name: string },

    { rejectWithValue },
  ) => {
    try {
      const response = await updateConversation(conversationId, name);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userRemoveMemberFromConversation = createAsyncThunk(
  "chat/removeUserFromConversation",
  async (data: UserConversationRequest, { rejectWithValue }) => {
    try {
      const response = await removeUserFromConversation(data);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userAddMembersToConversation = createAsyncThunk(
  "chat/addMembersToConversation",
  async (
    { conversationId, userIds }: { conversationId: string; userIds: number[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await addUserToConversation(conversationId, userIds);
      if (response.status === 201 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userUpdateRoleInConversation = createAsyncThunk(
  "chat/updateUserRoleInConversation",
  async (data: UserConversationRequest, { rejectWithValue }) => {
    try {
      const response = await updateUserRoleInConversation(data);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetLocations = createAsyncThunk(
  "chat/getLocations",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await getConversationLocations(conversationId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

// Messages
export const userSendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: SendMessageRequest, { rejectWithValue }) => {
    try {
      const response = await sendMessage(data);
      if (response.status === 201 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetMessages = createAsyncThunk(
  "chat/getMessages",
  async (
    {
      conversationId,
      cursor,
      limit,
    }: { conversationId: string; cursor?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await getMessagesList(conversationId, cursor, limit);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userDeleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async ({ messageId }: { messageId: string }, { rejectWithValue }) => {
    try {
      const response = await deleteMessage(messageId);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userUpdateMessage = createAsyncThunk(
  "chat/updateMessage",
  async (
    { messageId, content }: { messageId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateMessage(messageId, content);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

// Vote
export const userCreateVoteSession = createAsyncThunk(
  "chat/createVoteSession",
  async (data: CreateVoteRequest, { rejectWithValue }) => {
    try {
      const response = await createVoteSession(data);
      if (response.status === 201 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userCloseVoteSession = createAsyncThunk(
  "chat/closeVoteSession",
  async (voteSessionId: string, { rejectWithValue }) => {
    try {
      const response = await closeVoteSession(voteSessionId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userCastVote = createAsyncThunk(
  "chat/castVote",
  async (
    { voteSessionId, optionId }: { voteSessionId: string; optionId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await castVote(voteSessionId, optionId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetVoteSessions = createAsyncThunk(
  "chat/getVoteSession",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await getVoteSessions(conversationId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetVoteSessionById = createAsyncThunk(
  "chat/getVoteSessionById",
  async (voteSessionId: string, { rejectWithValue }) => {
    try {
      const response = await getVoteSessionById(voteSessionId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

// Bill
export const userCreateBillSession = createAsyncThunk(
  "chat/createBillSession",
  async (data: CreateBillRequest, { rejectWithValue }) => {
    try {
      const response = await createBillSession(data);
      if (response.status === 201 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userConfirmBillPayment = createAsyncThunk(
  "chat/confirmBillPayment",
  async (
    { billSessionId, userId }: { billSessionId: string; userId: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await confirmBillPayment(billSessionId, userId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userFinalizeBillSession = createAsyncThunk(
  "chat/finalizeBillSession",
  async (billSessionId: string, { rejectWithValue }) => {
    try {
      const response = await finalizeBillSession(billSessionId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetBillSessions = createAsyncThunk(
  "chat/getBillSessions",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await getBillSessions(conversationId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetBillSessionById = createAsyncThunk(
  "chat/getBillSessionById",
  async (billSessionId: string, { rejectWithValue }) => {
    try {
      const response = await getBillSessionById(billSessionId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
