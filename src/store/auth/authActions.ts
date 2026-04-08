import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout } from "../../services/api/authApi";
import {
  saveToken,
  saveRefreshToken,
  deleteToken,
  deleteRefreshToken,
} from "../../utils/secureStore";
import { LoginRequest, RegisterRequest } from "../../types/auth";

export const userLogin = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(data);
      if (
        response.status === 200 &&
        response.data?.access_token &&
        response.data?.refresh_token
      ) {
        // Store tokens securely using SecureStore
        await saveToken(response.data.access_token);
        await saveRefreshToken(response.data.refresh_token);
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

export const userRegister = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await register(data);
      if (
        response.status === 200 &&
        response.data?.access_token &&
        response.data?.refresh_token
      ) {
        // Store tokens securely using SecureStore
        await saveToken(response.data.access_token);
        await saveRefreshToken(response.data.refresh_token);
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

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
      // Always clear tokens, even if API fails
      await deleteToken();
      await deleteRefreshToken();
      if (response.status === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      // Always clear tokens, even if API fails
      await deleteToken();
      await deleteRefreshToken();
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
