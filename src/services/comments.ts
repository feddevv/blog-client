import type { Comment } from '@/types';

export async function getCommentsByPostId(id: number): Promise<Comment[]> {
  const url = `https://blog-api-65st.onrender.com/api/posts/${id}/comments`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
}
