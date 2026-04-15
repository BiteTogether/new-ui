import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyInfo,
  updateMyInfo,
  deleteMyInfo,
} from "../../services/api/userApi";
import { userLogout } from "../auth/authActions";

export const userGetInfo = createAsyncThunk(
  "user/getInfo",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await getMyInfo();
      if (response.status === 200 && response.data) {
        return response.data;
      } else if ([403, 404, 410].includes(response.status)) {
        dispatch(userLogout());
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

export const userUpdateInfo = createAsyncThunk(
  "user/updateInfo",
  async (
    {
      id,
      username,
      fullName,
    }: { id: number; username: string; fullName: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateMyInfo(id, username, fullName);
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

export const userDeleteInfo = createAsyncThunk(
  "user/deleteInfo",
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteMyInfo(id);
      if (response.status === 200) {
        dispatch(userLogout());
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
