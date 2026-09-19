import { blogApi } from '@/utils/utils';
import {
  delay,
  http,
  HttpResponse,
  type DefaultBodyType,
  type PathParams,
} from 'msw';
import { mockPosts } from '../data/posts';
import type { PaginatedResponse, Post, PostState } from '@/types';

export const postsHandlers = [
  http.get<PathParams, DefaultBodyType, PaginatedResponse<Post>>(
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
        totalCount: filtered.length,
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

  http.post(blogApi('/api/posts'), async ({ request }) => {
    await delay(100);

    let title = 'Untitled Post';
    let description = '';
    let content = '';
    let state: PostState = 'PUBLISHED';

    try {
      const formData = await request.formData();
      title = (formData.get('title') as string) || title;
      description = (formData.get('description') as string) || description;
      content = (formData.get('content') as string) || content;
      state = (formData.get('state') as PostState) || state;
    } catch {
      // Fallback if formData cannot be parsed
    }

    const newPost: Post = {
      id:
        mockPosts.length > 0 ? Math.max(...mockPosts.map((p) => p.id)) + 1 : 1,
      title,
      description,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 42,
      state,
      imageKey: 'post-image-created',
      coverImageUrl: 'https://placehold.co/400x300',
      thumbnailUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 0,
    };

    mockPosts.push(newPost);

    return HttpResponse.json(newPost, { status: 201 });
  }),
];
