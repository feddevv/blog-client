import type { Comment } from '@/types';

export async function getCommentsByPostId(id: number): Promise<Comment[]> {
  const url = `https://blog-api-65st.onrender.com/api/posts/${id}/comments`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
}

export async function createComment({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) {
  const url = `https://blog-api-65st.onrender.com/api/posts/${postId}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg1Nzc1MjY4LCJleHAiOjE3ODU4NjE2Njh9.akLdwIH6ZSzNDQ4i0Zh0W37Sjcz5834vRH9gHAaAJXk',
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
}
