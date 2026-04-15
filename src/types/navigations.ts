export type AuthStackParamList = {
  Login: undefined;
  Input: undefined;
  OTP: { phoneNumber: string };
  Register: { idToken: string };
};

export type MainStackParamList = {
  Home: undefined;
  Chat: {
    id: number;
    username: string;
    fullName: string;
    avatar: string | null;
    conversationId: string | null;
  };
  Profile: { id: number };
  Settings: undefined;
  AccountSettings: undefined;
  SystemSettings: undefined;
};
