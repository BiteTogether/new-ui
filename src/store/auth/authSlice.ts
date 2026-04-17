import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userLogin, userRegister, userLogout } from "./authActions";
import { getToken } from "../../utils/secureStore";
import { AuthState } from "../../types/redux";

// initialize userToken from secure storage
export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  const token = await getToken();
  return token;
});

const initialState: AuthState = {
  loading: false,
  error: null,
  isSignedIn: false,
  loadingToken: true,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load token on app startup
    builder.addCase(loadToken.fulfilled, (state, action) => {
      state.isSignedIn = !!action.payload; // If token exists, user is signed in
      state.loadingToken = false;
      state.token = action.payload;
    });

    // Login actions
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isSignedIn = true;
        state.token = action.payload.access_token;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register actions
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isSignedIn = true;
        state.token = action.payload.access_token;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout actions
    builder
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isSignedIn = false;
        state.token = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isSignedIn = false; // Even if logout fails, we consider the user signed out
      });
  },
});

export default authSlice.reducer;
