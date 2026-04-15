import { createSlice } from "@reduxjs/toolkit";
import {
  userGetConversations,
  userSendMessage,
  userGetMessages,
  userDeleteMessage,
  userUpdateMessage,
  userCreateConversation,
} from "./chatActions";
import { ChatState } from "../../types/redux";

const initialState: ChatState = {
  loading: false,
  error: null,
  conversations: null,
  state: "IDLE",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get conversations actions
    builder
      .addCase(userGetConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.conversations = action.payload;
      })
      .addCase(userGetConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create conversations actions
    builder
      .addCase(userCreateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userCreateConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (
          state.conversations &&
          !state.conversations.conversations.some(
            (c) => c.id === action.payload.id,
          )
        ) {
          state.conversations.conversations.unshift(action.payload);
        } else {
          state.conversations = {
            conversations: [action.payload],
            nextCursor: null,
            hasMore: false,
            size: 1,
          };
        }
      })
      .addCase(userCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send message actions
    builder
      .addCase(userSendMessage.pending, (state) => {
        state.error = null;
        state.state = "SENDING";
      })
      .addCase(userSendMessage.fulfilled, (state) => {
        state.error = null;
        state.state = "IDLE";
      })
      .addCase(userSendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.state = "IDLE";
      });

    // Get messages actions
    builder
      .addCase(userGetMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetMessages.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete message actions
    builder
      .addCase(userDeleteMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(userDeleteMessage.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userDeleteMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update message actions
    builder
      .addCase(userUpdateMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(userUpdateMessage.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userUpdateMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default chatSlice.reducer;
