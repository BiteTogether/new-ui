export interface FriendItem {
  id: number;
  username: string;
  fullName: string;
  avatar: string | null;
  conversationId: string | null;
}
export type FriendsListResponse = FriendItem[];

export interface FriendRequestItem {
  id: number;
  user: {
    id: number;
    username: string;
    fullName: string;
    avatar: string | null;
  };
}
export type FriendRequestsResponse = FriendRequestItem[];
