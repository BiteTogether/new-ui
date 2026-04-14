import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import {
  FriendsListResponse,
  FriendRequestsResponse,
  FriendItem,
} from "../../types/friends";
import { GetListParams } from "../../types";

export const getFriendsList = (params?: GetListParams) => {
  return apiService.get<FriendsListResponse>(API_ENDPOINTS.FRIENDS.GET_LIST, {
    params,
  });
};

export const getFriendRequests = (params?: GetListParams) => {
  return apiService.get<FriendRequestsResponse>(
    API_ENDPOINTS.FRIENDS.REQUEST.GET,
    { params },
  );
};

export const sendFriendRequest = (receiverId: number) => {
  const endpoint = API_ENDPOINTS.FRIENDS.REQUEST.SEND.replace(
    "{receiverId}",
    receiverId.toString(),
  );
  return apiService.post(endpoint);
};

export const rejectFriendRequest = (id: number) => {
  const endpoint = API_ENDPOINTS.FRIENDS.REQUEST.REJECT.replace(
    "{id}",
    id.toString(),
  );
  return apiService.delete(endpoint);
};

export const acceptFriendRequest = (id: number) => {
  const endpoint = API_ENDPOINTS.FRIENDS.REQUEST.ACCEPT.replace(
    "{id}",
    id.toString(),
  );
  return apiService.post<FriendItem>(endpoint);
};

export const removeFriend = (id: number) => {
  const endpoint = API_ENDPOINTS.FRIENDS.REMOVE.replace("{id}", id.toString());
  return apiService.delete(endpoint);
};
