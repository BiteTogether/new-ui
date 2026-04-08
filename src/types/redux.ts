import { UserInfo } from "./user";

export interface AuthState {
  loading: boolean;
  error: string | null;
  isSignedIn: boolean;
  loadingToken: boolean;
}

export interface UserState {
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | null;
}
