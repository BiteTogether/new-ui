import { createSlice } from "@reduxjs/toolkit";
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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

export default userSlice.reducer;
