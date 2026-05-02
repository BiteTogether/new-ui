import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../services/api/notificationApi";
import { NotificationItem } from "../../types/notification";
import { NotificationState } from "../../types/redux";

const initialState: NotificationState = {
  loading: false,
  error: null,
  items: [],
  unreadCount: 0,
  currentPage: 0,
  totalPages: 0,
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (
    { page, size = 20 }: { page: number; size?: number },
    { rejectWithValue },
  ) => {
    const response = await getNotifications({ page, size });
    if (response.status >= 400) {
      return rejectWithValue(response.message);
    }
    return response;
  },
);

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    const response = await getUnreadCount();
    if (response.status >= 400) {
      return rejectWithValue(response.message);
    }
    return response.data;
  },
);

export const markNotificationRead = createAsyncThunk(
  "notification/markRead",
  async (id: string, { rejectWithValue }) => {
    const response = await markAsRead(id);
    if (response.status >= 400) {
      return rejectWithValue(response.message);
    }
    return id;
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    const response = await markAllAsRead();
    if (response.status >= 400) {
      return rejectWithValue(response.message);
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      const exists = state.items.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (action.payload.status === "UNREAD") {
          state.unreadCount += 1;
        }
      }
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const response = action.payload;
        if (action.meta.arg.page === 0) {
          state.items = response.data || [];
        } else {
          const existingIds = new Set(state.items.map((n) => n.id));
          const newItems = (response.data || []).filter(
            (n) => !existingIds.has(n.id),
          );
          state.items = [...state.items, ...newItems];
        }
        state.currentPage = response.currentPage || 0;
        state.totalPages = response.totalPages || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload?.count || 0;
    });

    builder.addCase(markNotificationRead.fulfilled, (state, action) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && item.status === "UNREAD") {
        item.status = "READ";
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    builder.addCase(markAllNotificationsRead.fulfilled, (state) => {
      state.items.forEach((n) => (n.status = "READ"));
      state.unreadCount = 0;
    });
  },
});

export const { addNotification, incrementUnreadCount, resetNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
