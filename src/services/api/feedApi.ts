import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import {
  CreatePostRequest,
  Post,
  Posts,
  GetPostsRequest,
} from "../../types/feed";
import { GetListParams } from "../../types";
import { UploadImage } from "../../types/user";

export const createPost = (data: CreatePostRequest) => {
  return apiService.post<Post>(API_ENDPOINTS.FEED.POST.CREATE, data);
};

export const getPosts = (params: GetPostsRequest) => {
  return apiService.get<Posts>(API_ENDPOINTS.FEED.POST.GET, { params });
};

export const deletePost = (id: string) => {
  const endpoint = API_ENDPOINTS.FEED.POST.DELETE.replace("{id}", id);
  return apiService.delete(endpoint);
};

export const uploadImage = (imageFile: UploadImage) => {
  const endpoint = API_ENDPOINTS.FEED.POST.UPLOAD_IMAGE;
  const formData = new FormData();
  formData.append("file", imageFile as any);
  return apiService.uploadFile(endpoint, formData);
};

export const likePost = (postId: string) => {
  const endpoint = API_ENDPOINTS.FEED.LIKE.LIKE;
  return apiService.post(endpoint, { postId });
};

export const savePost = (postId: string) => {
  const endpoint = API_ENDPOINTS.FEED.SAVE.SAVE.replace("{postId}", postId);
  return apiService.post<Post>(endpoint);
};

export const unsavePost = (postId: string) => {
  const endpoint = API_ENDPOINTS.FEED.SAVE.DELETE.replace("{postId}", postId);
  return apiService.delete(endpoint);
};

export const getSavedPosts = () => {
  const endpoint = API_ENDPOINTS.FEED.SAVE.GET;
  return apiService.get<Posts>(endpoint);
};

export const getPostByUserId = (userId: number, params?: GetListParams) => {
  const endpoint = API_ENDPOINTS.FEED.POST.GET_BY_USERID.replace(
    "{userId}",
    userId.toString(),
  );
  return apiService.get<Posts>(endpoint, { params });
};

export const getPostDetail = (id: string) => {
  const endpoint = API_ENDPOINTS.FEED.POST.GET_BY_ID.replace("{id}", id);
  return apiService.get<Post>(endpoint);
};
