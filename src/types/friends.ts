export interface FriendItem {
  id: number;
  username: string;
  fullName: string;
  avatar: string;
  conversationId: string | null;
}
export type FriendsListResponse = FriendItem[];

export interface FriendRequestItem {
  id: number;
  user: {
    id: number;
    username: string;
    fullName: string;
    avatar: string;
  };
}
export type FriendRequestsResponse = FriendRequestItem[];
