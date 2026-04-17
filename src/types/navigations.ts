export type AuthStackParamList = {
  Login: undefined;
  Input: undefined;
  OTP: { phoneNumber: string };
  Register: { idToken: string };
};

export type MainStackParamList = {
  Home: undefined;
  Chat: {
    // DIRECT
    id?: number;
    username?: string;
    fullName?: string;
    avatar: string | null;
    conversationId: string | null;

    // GROUP
    name?: string;
    type: "DIRECT" | "GROUP";
  };
  Profile: { id: number };
  Settings: undefined;
  AccountSettings: undefined;
  SystemSettings: undefined;
  CreateGroupChat: undefined;
  GroupDetail: { conversationId: string };
  AddMember: { ids: number[] };
};
