import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import {
  UpdateDeviceTokenRequest,
  NotificationSettings,
  NotificationItem,
  UnreadCountResponse,
  PushEnabledRequest,
} from "../../types/notification";
import { GetListParams } from "../../types";

export const registerDeviceToken = (data: UpdateDeviceTokenRequest) => {
  return apiService.put<NotificationSettings>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS.DEVICE_TOKEN,
    data,
  );
};

export const getDeviceToken = () => {
  return apiService.get<NotificationSettings>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS.DEVICE_TOKEN,
  );
};

export const getNotificationSettings = () => {
  return apiService.get<NotificationSettings>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS.GET,
  );
};

export const updatePushEnabled = (data: PushEnabledRequest) => {
  return apiService.put<NotificationSettings>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS.PUSH_ENABLED,
    data,
  );
};

export const getPushEnabled = () => {
  return apiService.get<{ pushNotificationEnabled: boolean }>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS.PUSH_ENABLED,
  );
};

export const getNotifications = (params: GetListParams) => {
  return apiService.get<NotificationItem[]>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params,
  });
};

export const getUnreadCount = () => {
  return apiService.get<UnreadCountResponse>(
    API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
  );
};

export const markAsRead = (id: string) => {
  return apiService.put(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace("{id}", id),
  );
};

export const markAllAsRead = () => {
  return apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
};

export const deleteNotification = (id: string) => {
  return apiService.delete(
    API_ENDPOINTS.NOTIFICATIONS.DELETE.replace("{id}", id),
  );
};

export const clearAllNotifications = () => {
  return apiService.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL);
};
