export interface ValidateRequest {
  criteriaType: "PHONE" | "USERNAME";
  criteriaValue: string;
}

export interface ValidateResponse {
  validationMessage: string;
  valid: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  foodPreferences: string;
  friendsCount: number;
  pushNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  conversationId: string | null;
}

export interface FriendInfo {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  friendItem: {
    hasFriendRequestSent: boolean;
    hasFriendRequestReceived: boolean;
    friendRequestId: number;
    isFriend: boolean;
    isUserOnline: boolean;
    lastSeenUser: string;
  };
}

export interface SearchFriendResponse {
  id: number;
  username: string;
  fullName: string;
  avatar: string | null;
  hasFriendRequestSent: boolean;
  hasFriendRequestReceived: boolean;
  friendRequestId: number;
  isFriend: boolean;
  conversationId: string | null;
}

export interface UploadImage {
  uri: string;
  name: string;
  type: string;
}
