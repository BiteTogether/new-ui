import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Participant, GetUserLocationsResponse } from "../../types/chat";
import {
  userGetConversations,
  userSendMessage,
  userGetMessages,
  userDeleteMessage,
  userUpdateMessage,
  userCreateConversation,
  userDeleteConversation,
  userGetConversationById,
  userUpdateConversation,
  userRemoveMemberFromConversation,
  userUpdateRoleInConversation,
  userAddMembersToConversation,
  userCreateVoteSession,
  userCloseVoteSession,
  userCastVote,
  userGetVoteSessions,
  userGetVoteSessionById,
  userCreateBillSession,
  userConfirmBillPayment,
  userFinalizeBillSession,
  userGetBillSessions,
  userGetBillSessionById,
  userGetLocations,
} from "./chatActions";
import { ChatState } from "../../types/redux";

const initialState: ChatState = {
  loading: false,
  error: null,
  conversations: null,
  state: "IDLE",
  members: [],
  locations: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<Partial<Participant>[]>) => {
      state.members = action.payload;
    },
    setLocations: (
      state,
      action: PayloadAction<GetUserLocationsResponse[]>,
    ) => {
      action.payload.forEach((incoming) => {
        if (incoming.sharing === false) {
          state.locations = state.locations.filter(
            (loc) => loc.userId !== incoming.userId,
          );
          return;
        }

        const index = state.locations.findIndex(
          (loc) => loc.userId === incoming.userId,
        );

        if (index !== -1) {
          state.locations[index] = {
            ...state.locations[index],
            ...incoming,
          };
        } else {
          state.locations.push(incoming);
        }
      });
    },
  },
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

    // Delete conversations actions
    builder
      .addCase(userDeleteConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDeleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.conversations) {
          state.conversations.conversations =
            state.conversations.conversations.filter(
              (c) => c.id !== action.meta.arg,
            );
          state.conversations.size = state.conversations.conversations.length;
        }
      })
      .addCase(userDeleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get conversation by ID actions
    builder
      .addCase(userGetConversationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetConversationById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetConversationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update conversation
    builder
      .addCase(userUpdateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUpdateConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userUpdateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove member from conversation
    builder
      .addCase(userRemoveMemberFromConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRemoveMemberFromConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userRemoveMemberFromConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add members to conversation
    builder
      .addCase(userAddMembersToConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userAddMembersToConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userAddMembersToConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user role in conversation
    builder
      .addCase(userUpdateRoleInConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUpdateRoleInConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userUpdateRoleInConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get conversation locations actions
    builder
      .addCase(userGetLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.locations = action.payload;
      })
      .addCase(userGetLocations.rejected, (state, action) => {
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

    // Create vote session actions
    builder
      .addCase(userCreateVoteSession.pending, (state) => {
        state.error = null;
      })
      .addCase(userCreateVoteSession.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userCreateVoteSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Close vote session actions
    builder
      .addCase(userCloseVoteSession.pending, (state) => {
        state.error = null;
      })
      .addCase(userCloseVoteSession.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userCloseVoteSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Cast vote actions
    builder
      .addCase(userCastVote.pending, (state) => {
        state.error = null;
      })
      .addCase(userCastVote.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userCastVote.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Get vote sessions actions
    builder
      .addCase(userGetVoteSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetVoteSessions.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetVoteSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get vote session by ID actions
    builder
      .addCase(userGetVoteSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetVoteSessionById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetVoteSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create bill session actions
    builder
      .addCase(userCreateBillSession.pending, (state) => {
        state.error = null;
      })
      .addCase(userCreateBillSession.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userCreateBillSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Confirm bill payment actions
    builder
      .addCase(userConfirmBillPayment.pending, (state) => {
        state.error = null;
      })
      .addCase(userConfirmBillPayment.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userConfirmBillPayment.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Finalize bill session actions
    builder
      .addCase(userFinalizeBillSession.pending, (state) => {
        state.error = null;
      })
      .addCase(userFinalizeBillSession.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(userFinalizeBillSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Get bill sessions actions
    builder
      .addCase(userGetBillSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetBillSessions.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetBillSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get bill session by ID actions
    builder
      .addCase(userGetBillSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetBillSessionById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetBillSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMembers, setLocations } = chatSlice.actions;
export default chatSlice.reducer;
