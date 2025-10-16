import postReducer, { fetchPosts, resetAll, PostsState } from '../postSlice'; 
import { Post } from '../../../utils/types';


jest.mock('../../../api/postApi', () => ({
  fetchPostsApi: jest.fn(),
}));

describe('postSlice', () => {
  const initialState: PostsState = {
    items: [],
    page: 1,
    limit: 10,
    loading: false,
    refreshing: false,
    error: null,
    hasMore: true,
  };

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post 1', body: 'Body 1', userId: 1 },
    { id: 2, title: 'Test Post 2', body: 'Body 2', userId: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(postReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('resetAll action', () => {
    it('should reset state to initial values', () => {
      const stateWithData = {
        ...initialState,
        items: mockPosts,
        page: 3,
        loading: true,
        error: 'Some error',
        hasMore: false,
      };

      const newState = postReducer(stateWithData, resetAll());
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('fetchPosts pending', () => {
    it('should set refreshing true when page is 1', () => {
      const action = { 
        type: fetchPosts.pending.type,
        meta: { arg: { page: 1 } }
      };
      
      const newState = postReducer(initialState, action);
      
      expect(newState.refreshing).toBe(true);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('should set loading true when page is greater than 1', () => {
      const action = { 
        type: fetchPosts.pending.type,
        meta: { arg: { page: 2 } }
      };
      
      const newState = postReducer(initialState, action);
      
      expect(newState.loading).toBe(true);
      expect(newState.refreshing).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('should handle pending without page argument (default to 1)', () => {
      const action = { 
        type: fetchPosts.pending.type,
        meta: { arg: undefined }
      };
      
      const newState = postReducer(initialState, action);
      
      expect(newState.refreshing).toBe(true);
      expect(newState.loading).toBe(false);
    });
  });

  describe('fetchPosts fulfilled', () => {
    it('should replace items and set page to 2 when page is 1 (refresh)', () => {
      const action = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: mockPosts, page: 1 }
      };

      const newState = postReducer(initialState, action);

      expect(newState.items).toEqual(mockPosts);
      expect(newState.page).toBe(2);
      expect(newState.loading).toBe(false);
      expect(newState.refreshing).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.hasMore).toBe(false); // 2 !== 10 (limit)
    });

    it('should append items and increment page when page is greater than 1 (load more)', () => {
      const stateWithInitialPosts = {
        ...initialState,
        items: mockPosts,
        page: 2,
      };

      const morePosts: Post[] = [
        { id: 3, title: 'Test Post 3', body: 'Body 3', userId: 1 },
        { id: 4, title: 'Test Post 4', body: 'Body 4', userId: 1 },
      ];

      const action = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: morePosts, page: 2 }
      };

      const newState = postReducer(stateWithInitialPosts, action);

      expect(newState.items).toEqual([...mockPosts, ...morePosts]);
      expect(newState.page).toBe(3);
      expect(newState.loading).toBe(false);
      expect(newState.refreshing).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.hasMore).toBe(false); 
    });

    it('should set hasMore to false when returned posts length is less than limit', () => {
      const limitedPosts = [mockPosts[0]];
      
      const action = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: limitedPosts, page: 1 }
      };

      const newState = postReducer(initialState, action);

      expect(newState.hasMore).toBe(false); 
      expect(newState.items).toEqual(limitedPosts);
    });

    it('should set hasMore to true when returned posts length equals limit', () => {
      // Create exactly 10 posts to match limit
      const exactLimitPosts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Body ${i + 1}`,
        userId: 1
      }));

      const action = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: exactLimitPosts, page: 1 }
      };

      const newState = postReducer(initialState, action);

      expect(newState.hasMore).toBe(true); // 10 === 10 (limit)
      expect(newState.items).toEqual(exactLimitPosts);
    });
  });

  describe('fetchPosts rejected', () => {
    it('should set error and reset loading states when rejected', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        refreshing: false,
      };

      const errorMessage = 'Network error';
      const action = {
        type: fetchPosts.rejected.type,
        payload: errorMessage
      };

      const newState = postReducer(loadingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.refreshing).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    it('should use default error message when payload is undefined', () => {
      const refreshingState = {
        ...initialState,
        loading: false,
        refreshing: true,
      };

      const action = {
        type: fetchPosts.rejected.type,
        payload: undefined
      };

      const newState = postReducer(refreshingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.refreshing).toBe(false);
      expect(newState.error).toBe('Failed to load posts');
    });
  });

  describe('pagination logic', () => {
    it('should handle consecutive load more operations correctly', () => {
      let state = initialState;

      // First page load (refresh) - create exactly 10 posts for hasMore = true
      const firstPagePosts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Body ${i + 1}`,
        userId: 1
      }));

      const firstAction = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: firstPagePosts, page: 1 }
      };

      state = postReducer(state, firstAction);

      expect(state.page).toBe(2);
      expect(state.items).toEqual(firstPagePosts);
      expect(state.hasMore).toBe(true);

      // Second page load (load more)
      const morePosts: Post[] = [
        { id: 11, title: 'Post 11', body: 'Body 11', userId: 1 },
        { id: 12, title: 'Post 12', body: 'Body 12', userId: 1 },
      ];

      const secondAction = {
        type: fetchPosts.fulfilled.type,
        payload: { posts: morePosts, page: 2 }
      };

      state = postReducer(state, secondAction);

      expect(state.page).toBe(3);
      expect(state.items).toEqual([...firstPagePosts, ...morePosts]);
      expect(state.hasMore).toBe(false); // 2 !== 10 (limit)
    });
  });
});