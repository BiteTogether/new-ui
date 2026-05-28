// Post
export interface Post {
  createdAt: string;
  updatedAt: string;
  createdBy: "SYSTEM" | "USER";
  updatedBy: "SYSTEM" | "USER";
  id: string;
  placeId: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  content: string;
  rating: number;
  photoUrl: string;
  likeCount: number;
  commentCount: number;
  alreadyLiked: boolean;
  alreadySaved: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    avatar: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
  nearbyCheckins: NearbyCheckIn[] | null;
}

export interface NearbyCheckIn {
  userId: number;
  fullName: string;
  avatar: string;
  postId: string;
  placeName: string;
}

export interface CreatePostRequest {
  placeId: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  content: string;
  rating: number;
  photoUrl: string;
}

export type Posts = Post[];

export interface GetPostsRequest {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
