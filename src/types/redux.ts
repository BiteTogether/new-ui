import { UserInfo } from "./user";
import { ConversationsList } from "./chat";
import { Posts } from "./feed";
import { NotificationItem } from "./notification";

export interface AuthState {
  loading: boolean;
  error: string | null;
  isSignedIn: boolean;
  loadingToken: boolean;
  token: string | null;
}

export interface UserState {
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | null;
}

export interface ChatState {
  loading: boolean;
  error: string | null;
  state: "IDLE" | "SENDING" | "SUCCESS" | "ERROR";
  conversations: ConversationsList | null;
}

export interface FeedState {
  loading: boolean;
  error: string | null;
  posts: Posts;
  savedPosts: Posts;
}

export interface NotificationState {
  loading: boolean;
  error: string | null;
  items: NotificationItem[];
  unreadCount: number;
  currentPage: number;
  totalPages: number;
}
