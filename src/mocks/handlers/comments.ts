import { blogApi } from '@/utils/utils';
import { http, HttpResponse } from 'msw';
import { mockComments } from '../data/comments';
import type { CommentType } from '@/types/zod';

export const commentsHandler = [
  http.get<{ id: string }>(blogApi('/api/posts/:id/comments'), ({ params }) => {
    const { id } = params;
    const idNumber = Number(id);

    const postComments = mockComments.filter(
      (comment) => comment.postId === idNumber
    );

    return HttpResponse.json(postComments);
  }),

  http.post<{ id: string }, CommentType>(
    blogApi('/api/posts/:id/comments'),
    async ({ request }) => {
      const body = await request.json();

      mockComments.push({
        content: body.content,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        id: 6,
        postId: 1,
        userId: 222,
        user: {
          username: 'feddev',
        },
      });

      return new HttpResponse(null, { status: 201 });
    }
  ),
];
