export type AuthStackParamList = {
  Login: undefined;
  Input: undefined;
  OTP: { phoneNumber: string };
  Register: { idToken: string };
};

export type MainStackParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  SystemSettings: undefined;
};
