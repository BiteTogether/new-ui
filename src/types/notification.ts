export type NotificationType = "IN_APP_NOTIFICATION" | "CHAT_MESSAGE";
export type NotificationStatus = "UNREAD" | "READ";

export interface UpdateDeviceTokenRequest {
  deviceToken: string;
}

export interface NotificationSettings {
  userId: number;
  deviceToken: string;
  pushNotificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PushEnabledRequest {
  pushNotificationEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  eventId: string;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  sourceService: string;
  status: NotificationStatus;
  timestamp: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface FCMDataPayload {
  eventId?: string;
  userId?: string;
  title?: string;
  message?: string;
  type?: NotificationType;
  sourceService?: string;
  timestamp?: string;
  status?: string;
  conversationId?: string;
  conversationName?: string;
}
