import type { Post } from '@/types';

export const getPosts = async (search?: string): Promise<Post[]> => {
  let url = 'https://blog-api-65st.onrender.com/api/posts';

  if (search && search.trim()) url += `?search=${search}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
};
