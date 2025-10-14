import axios from 'axios';
import { Post } from '../utils/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPostsApi = async (page = 1, limit = 10): Promise<Post[]> => {
  const res = await axios.get<Post[]>(
    `${BASE_URL}/posts?_limit=${limit}&_page=${page}`
  );
  // jsonplaceholder returns array in body so we only  rely on length to stop it
  return res.data;
};
