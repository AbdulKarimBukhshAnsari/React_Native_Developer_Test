import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../utils/types';
import { fetchPostsApi } from '../../api/postApi';

interface PostsState {
  items: Post[];
  page: number;
  limit: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: PostsState = {
  items: [],
  page: 1,
  limit: 10,
  loading: false,
  refreshing: false,
  error: null,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<
  { posts: Post[]; page: number },
  { page?: number; replace?: boolean } | undefined,
  { rejectValue: string; state: { posts: PostsState } }
>(
  'posts/fetchPosts',
  async (payload = { page: 1 }, { rejectWithValue }) => {
    const page = payload.page ?? 1;
    try {
      const posts = await fetchPostsApi(page, initialState.limit);
      return { posts, page };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch posts');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetAll: (state) => {
      state.items = [];
      state.page = 1;
      state.loading = false;
      state.refreshing = false;
      state.error = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        // if page === 1 and there are existing items, we might be refreshing
        const requestedPage = (action.meta.arg && (action.meta.arg as any).page) || 1;
        if (requestedPage === 1) {
          state.refreshing = true;
          state.error = null;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<{ posts: Post[]; page: number }>) => {
        const { posts, page } = action.payload;
        // if page === 1 -> replace (refresh), else append
        if (page === 1) {
          state.items = posts;
          state.page = 2; // next page to request
        } else {
          state.items = state.items.concat(posts);
          state.page = page + 1;
        }

        // If returned posts less than limit -> no more data
        state.hasMore = posts.length === state.limit;
        state.loading = false;
        state.refreshing = false;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload ?? 'Failed to load posts';
      });
  },
});

export const { resetAll } = postsSlice.actions;
export default postsSlice.reducer;
