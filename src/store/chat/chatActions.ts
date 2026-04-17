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
} from "../../services/api/chatApi";
import {
  SendMessageRequest,
  CreateConversationRequest,
  UserConversationRequest,
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
      if (response.status === 200) {
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
    {
      conversationId,
      name,
      avatarUrl,
    }: { conversationId: string; name: string; avatarUrl?: string },

    { rejectWithValue },
  ) => {
    try {
      const response = await updateConversation(
        conversationId,
        name,
        avatarUrl,
      );
      if (response.status === 200) {
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

export const userUpdateRoleInConversation = createAsyncThunk(
  "chat/updateUserRoleInConversation",
  async (data: UserConversationRequest, { rejectWithValue }) => {
    try {
      const response = await updateUserRoleInConversation(data);
      if (response.status === 200) {
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
