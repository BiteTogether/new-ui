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
    },
    MESSAGES: {
      UPDATE: "/api/v1/messages/{messageId}",
      DELETE: "/api/v1/messages/{messageId}",
      SEND: "/api/v1/messages",
      GET_LIST: "/api/v1/messages/conversation/{conversationId}",
    },
  },
};
