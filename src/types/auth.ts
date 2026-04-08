export interface LoginRequest {
  idToken: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  session_state: string;
}

export interface RegisterRequest {
  idToken: string;
  username: string;
  fullName: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  session_state: string;
}
