import { blogApi } from '@/utils/utils';
import { delay, http, HttpResponse } from 'msw';
import { mockPosts } from '../data/posts';

export const postsHandlers = [
  http.get(blogApi('/api/posts'), async ({ request }) => {
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

    return HttpResponse.json(filtered);
  }),
];
