import { configureStore } from '@reduxjs/toolkit';
import postReducer, { fetchPosts } from '../../config/redux/postSlice';

test('Redux ++ API testing', async () => {

  const store = configureStore({
    reducer: { posts: postReducer },
  });


  await store.dispatch(fetchPosts({ page: 1 }));


  const state = store.getState().posts;
  
  expect(state.items.length).toBeGreaterThan(0); 
  expect(state.page).toBe(2);                    
  expect(state.loading).toBe(false);             
  expect(state.error).toBeNull();                
});

test('second page is also working', async () => {
  const store = configureStore({
    reducer: { posts: postReducer },
  });

  await store.dispatch(fetchPosts({ page: 1 }));
  
  await store.dispatch(fetchPosts({ page: 2 }));

  const state = store.getState().posts;
  
  expect(state.page).toBe(3);
  expect(state.items.length).toBeGreaterThan(10); 
});

test('error is being handled as well', async () => {
  const store = configureStore({
    reducer: { posts: postReducer },
  });

  await store.dispatch(fetchPosts({ page: -1 }));

  const state = store.getState().posts;

  expect(state.error).not.toBeNull();
  expect(state.loading).toBe(false);
});