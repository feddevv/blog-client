import { blogApi } from '@/utils/utils';
import { http, HttpResponse, type DefaultBodyType } from 'msw';
import { mockComments } from '../data/comments';
import type { CommentType } from '@/types/zod';
import type { GetCommentsResponse } from '@/types';

export const commentsHandler = [
  http.get<{ id: string }, DefaultBodyType, GetCommentsResponse>(
    blogApi('/api/posts/:id/comments'),
    ({ params }) => {
      const { id } = params;
      const idNumber = Number(id);

      const postComments = mockComments.filter(
        (comment) => comment.postId === idNumber
      );

      return HttpResponse.json({
        data: postComments,
        totalCount: postComments.length,
        currentPage: 1,
        pageSize: 10,
      });
    }
  ),

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
        isLiked: false,
        likesCount: 0,
      });

      return new HttpResponse(null, { status: 201 });
    }
  ),
];
