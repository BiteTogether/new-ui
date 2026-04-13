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
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  foodPreferences: string;
  friendsCount: number;
  pushNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
}

export interface FriendInfo {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
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
  avatar: string;
  hasFriendRequestSent: boolean;
  hasFriendRequestReceived: boolean;
  friendRequestId: number;
  isFriend: boolean;
}
