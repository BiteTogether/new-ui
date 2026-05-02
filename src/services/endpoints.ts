export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH: "/api/v1/auth/tokens/refresh",
    LOGOUT: "/api/v1/auth/logout",
  },
  USER: {
    VALIDATE: "/api/v1/users/validate",
    MY_INFO: {
      GET: "/api/v1/users/me",
      UPDATE: "/api/v1/users/{id}",
      DELETE: "/api/v1/users/{id}",
      UPLOAD_AVATAR: "/api/v1/users/{id}/avatar",
      DELETE_AVATAR: "/api/v1/users/{id}/avatar",
      SEARCH: "/api/v1/users/search",
    },
    INFO: "/api/v1/users/{id}",
    LIST: "/api/v1/users",
  },
  FRIENDS: {
    GET_LIST: "/api/v1/friends",
    REMOVE: "/api/v1/friends/{id}",
    REQUEST: {
      SEND: "/api/v1/friend-requests/{receiverId}",
      ACCEPT: "/api/v1/friend-requests/{id}/accept",
      GET: "/api/v1/friend-requests/received",
      REJECT: "/api/v1/friend-requests/{id}",
    },
  },
  CHAT: {
    CONVERSATIONS: {
      GET: "/api/v1/conversations/{conversationId}",
      UPDATE: "/api/v1/conversations/{conversationId}",
      DELETE: "/api/v1/conversations/{conversationId}",
      GET_LIST: "/api/v1/conversations",
      CREATE: "/api/v1/conversations",
      ADD_USER: "/api/v1/conversations/{conversationId}/participants/{userId}",
      REMOVE_USER:
        "/api/v1/conversations/{conversationId}/participants/{userId}",
      UPDATE_ROLE:
        "/api/v1/conversations/{conversationId}/participants/{userId}/role",
      GET_BY_ID: "/api/v1/conversations/{conversationId}",
    },
    MESSAGES: {
      UPDATE: "/api/v1/messages/{messageId}",
      DELETE: "/api/v1/messages/{messageId}",
      SEND: "/api/v1/messages",
      GET_LIST: "/api/v1/messages/conversation/{conversationId}",
    },
  },
  FEED: {
    POST: {
      CREATE: "/api/v1/feeds",
      GET: "/api/v1/feeds/new-feeds",
      DELETE: "/api/v1/feeds/{id}",
      GET_BY_ID: "/api/v1/feeds/{id}",
      GET_BY_USERID: "/api/v1/feeds/user/{userId}",
      UPLOAD_IMAGE: "/api/v1/feeds/upload-image",
    },
    LIKE: {
      LIKE: "/api/v1/feeds/likes",
    },
    SAVE: {
      SAVE: "/api/v1/feeds/saved-posts/{postId}",
      GET: "/api/v1/feeds/saved-posts",
      DELETE: "/api/v1/feeds/saved-posts/{postId}",
    },
  },
  NOTIFICATIONS: {
    LIST: "/api/v1/notifications",
    UNREAD_COUNT: "/api/v1/notifications/unread-count",
    MARK_READ: "/api/v1/notifications/{id}/read",
    MARK_ALL_READ: "/api/v1/notifications/read-all",
    DELETE: "/api/v1/notifications/{id}",
    CLEAR_ALL: "/api/v1/notifications",
    SETTINGS: {
      GET: "/api/v1/notifications/settings",
      DEVICE_TOKEN: "/api/v1/notifications/settings/device-token",
      PUSH_ENABLED: "/api/v1/notifications/settings/push-enabled",
    },
  },
};
