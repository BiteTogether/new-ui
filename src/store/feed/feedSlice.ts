import { createSlice } from "@reduxjs/toolkit";
import {
  userCreatePost,
  userGetPosts,
  userDeletePost,
  userLikePost,
  userSavePost,
  userUnsavePost,
  userGetSavedPosts,
  userGetPostByUserId,
  userGetPostDetail,
} from "./feedActions";
import { FeedState } from "../../types/redux";

const initialState: FeedState = {
  loading: false,
  error: null,
  posts: [],
  savedPosts: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get posts actions
    builder
      .addCase(userGetPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (!state.posts) {
          state.posts = action.payload;
        } else {
          // Get new posts that are not already in the state
          const newPosts = action.payload.filter(
            (post) => !state.posts!.some((p) => p.id === post.id),
          );
          // Add new posts to the beginning of the list, keeping existing posts
          state.posts = [...newPosts, ...state.posts];
        }
      })
      .addCase(userGetPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get post by user ID actions
    builder
      .addCase(userGetPostByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetPostByUserId.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetPostByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get post detail actions
    builder
      .addCase(userGetPostDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetPostDetail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userGetPostDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create post actions
    builder
      .addCase(userCreatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userCreatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // If posts is null, initialize it with the new post
        if (!state.posts) {
          state.posts = [action.payload];
        } else {
          // If id doesn't exist, add to the beginning of the array
          const exists = state.posts.some(
            (post) => post.id === action.payload.id,
          );
          if (!exists) {
            state.posts = [action.payload, ...state.posts];
          }
        }
      })
      .addCase(userCreatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete post actions
    builder
      .addCase(userDeletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDeletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.posts) {
          state.posts = state.posts.filter(
            (post) => post.id !== action.meta.arg,
          );
        }
      })
      .addCase(userDeletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Like post actions
    builder
      .addCase(userLikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.posts) {
          const index = state.posts.findIndex(
            (post) => post.id === action.meta.arg,
          );
          if (index !== -1) {
            state.posts[index].alreadyLiked = true;
            state.posts[index].likeCount += 1;
          }
        }
      })
      .addCase(userLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save post actions
    builder
      .addCase(userSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.posts) {
          const index = state.posts.findIndex(
            (post) => post.id === action.meta.arg,
          );
          if (index !== -1) {
            state.posts[index].alreadySaved = true;
            state.savedPosts = state.savedPosts
              ? [state.posts[index], ...state.savedPosts]
              : [state.posts[index]];
          }
        }
      })
      .addCase(userSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Unsave post actions
    builder
      .addCase(userUnsavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUnsavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.posts) {
          const index = state.posts.findIndex(
            (post) => post.id === action.meta.arg,
          );
          if (index !== -1) {
            state.posts[index].alreadySaved = false;
            state.savedPosts = state.savedPosts
              ? state.savedPosts.filter((p) => p.id !== action.meta.arg)
              : [];
          }
        }
      })
      .addCase(userUnsavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get saved posts actions
    builder
      .addCase(userGetSavedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.savedPosts = action.payload;
      })
      .addCase(userGetSavedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default feedSlice.reducer;
