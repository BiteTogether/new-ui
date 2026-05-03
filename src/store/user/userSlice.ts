import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  userGetInfo,
  userUpdateInfo,
  userDeleteInfo,
  userGetUsersByIds,
} from "./userActions";
import { UserState } from "../../types/redux";

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
  userLocation: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLocation: (
      state,
      action: PayloadAction<UserState["userLocation"]>,
    ) => {
      state.userLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get user info actions
    builder
      .addCase(userGetInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload;
      })
      .addCase(userGetInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user info actions
    builder
      .addCase(userUpdateInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUpdateInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.userInfo) {
          state.userInfo.username = action.payload.username ?? "";
          state.userInfo.fullName = action.payload.fullName ?? "";
          state.userInfo.avatar = action.payload.avatar ?? null;
        }
      })
      .addCase(userUpdateInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete user info actions
    builder
      .addCase(userDeleteInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDeleteInfo.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.userInfo = null;
      })
      .addCase(userDeleteInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get users by IDs actions
    builder
      .addCase(userGetUsersByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetUsersByIds.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetUsersByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserLocation } = userSlice.actions;
export default userSlice.reducer;
