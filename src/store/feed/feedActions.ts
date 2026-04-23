import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPost,
  getPosts,
  deletePost,
  likePost,
  savePost,
  unsavePost,
  getSavedPosts,
  getPostByUserId,
  getPostDetail,
} from "../../services/api/feedApi";
import { CreatePostRequest, GetPostsRequest } from "../../types/feed";
import { GetListParams } from "../../types";

// Posts
export const userCreatePost = createAsyncThunk(
  "feed/createPost",
  async (data: CreatePostRequest, { rejectWithValue }) => {
    try {
      const response = await createPost(data);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetPosts = createAsyncThunk(
  "feed/getPosts",
  async (params: GetPostsRequest, { rejectWithValue }) => {
    try {
      const response = await getPosts(params);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetPostByUserId = createAsyncThunk(
  "feed/getPostByUserId",
  async (
    { userId, params }: { userId: number; params?: GetListParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPostByUserId(userId, params);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetPostDetail = createAsyncThunk(
  "feed/getPostDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPostDetail(id);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userDeletePost = createAsyncThunk(
  "feed/deletePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deletePost(id);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userLikePost = createAsyncThunk(
  "feed/likePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await likePost(postId);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userSavePost = createAsyncThunk(
  "feed/savePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await savePost(postId);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userUnsavePost = createAsyncThunk(
  "feed/unsavePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await unsavePost(postId);
      if (response.status === 200) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userGetSavedPosts = createAsyncThunk(
  "feed/getSavedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSavedPosts();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
