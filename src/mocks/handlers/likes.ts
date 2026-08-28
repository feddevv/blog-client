import { blogApi } from '@/utils/utils';
import { http, HttpResponse } from 'msw';
import { mockPosts } from '../data/posts';
import { mockComments } from '../data/comments';

export const likesHandlers = [
  http.post<{ id: string }>(blogApi('/api/posts/:id/likes'), ({ params }) => {
    const postId = Number(params.id);
    const post = mockPosts.find((post) => post.id === postId);

    if (!post) return new HttpResponse(null, { status: 404 });

    const nextIsLikedState = !post.isLiked;
    post.isLiked = nextIsLikedState;
    post.likesCount = nextIsLikedState
      ? post.likesCount + 1
      : post.likesCount - 1;

    return HttpResponse.json({
      message: nextIsLikedState ? 'Liked' : 'Unliked',
    });
  }),

  http.post<{ id: string }>(
    blogApi('/api/comments/:id/likes'),
    ({ params }) => {
      const commentId = Number(params.id);
      const comment = mockComments.find((comment) => comment.id === commentId);

      if (!comment) return new HttpResponse(null, { status: 404 });

      const nextIsLikedState = !comment.isLiked;
      comment.isLiked = nextIsLikedState;
      comment.likesCount = nextIsLikedState
        ? comment.likesCount + 1
        : comment.likesCount - 1;

      return HttpResponse.json({
        message: nextIsLikedState ? 'Liked' : 'Unliked',
      });
    }
  ),
];
