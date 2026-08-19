import { blogApi } from '@/utils/utils';
import {
  delay,
  http,
  HttpResponse,
  type DefaultBodyType,
  type PathParams,
} from 'msw';
import { mockPosts } from '../data/posts';
import type { GetPostsResponse, Post } from '@/types';

export const postsHandlers = [
  http.get<PathParams, DefaultBodyType, GetPostsResponse>(
    blogApi('/api/posts'),
    async ({ request }) => {
      await delay(100);

      const url = new URL(request.url);
      const searchParam = url.searchParams.get('search')?.toLocaleLowerCase();

      const filtered = searchParam
        ? mockPosts.filter(
            (post) =>
              post.title.toLocaleLowerCase().includes(searchParam) ||
              post.description?.toLocaleLowerCase().includes(searchParam) ||
              post.content?.toLocaleLowerCase().includes(searchParam)
          )
        : mockPosts;

      return HttpResponse.json({
        data: filtered,
        totalCount: mockPosts.length,
        pageSize: 10,
        currentPage: 1,
      });
    }
  ),

  http.get<{ id: string }, DefaultBodyType, Post>(
    blogApi('/api/posts/:id'),
    async ({ params }) => {
      await delay(100);

      const { id } = params;
      const idNumber = Number(id);

      const post = mockPosts.find((post) => post.id === idNumber);

      return HttpResponse.json(post);
    }
  ),
];
