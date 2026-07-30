import type { Post } from '@/types';

export const getPosts = async (): Promise<Post[]> => {
  const res = await fetch('https://blog-api-65st.onrender.com/api/posts');

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
};
