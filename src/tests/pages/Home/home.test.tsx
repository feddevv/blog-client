import { server } from '@/mocks/node';
import Home from '@/pages/Home/Home';
import { blogApi } from '@/utils/utils';
import { render, screen, waitFor, within } from '@testing-library/react';
import {
  delay,
  http,
  HttpResponse,
  type DefaultBodyType,
  type PathParams,
} from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/tests/testUtils';
import { mockPosts } from '@/mocks/data/posts';
import type { GetPostsResponse } from '@/types';

describe('Home component', () => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Home,
    },
    {
      path: '/login',
      Component: () => <h1>Login Page</h1>,
    },
    {
      path: '/post/:id',
      Component: () => <h1>Post Detail Page</h1>,
    },
  ]);

  it('should correctly render the spinner and then posts', async () => {
    render(<Stub />, { wrapper: createWrapper() });

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();

    const posts = await screen.findAllByRole('article');
    expect(posts).toHaveLength(mockPosts.length);

    expect(spinner).not.toBeInTheDocument();
  });

  it('should show a message when no posts yet', async () => {
    server.use(http.get(blogApi('/api/posts'), () => HttpResponse.json([])));
    render(<Stub />, { wrapper: createWrapper() });

    expect(
      await screen.findByRole('heading', { name: /no posts yet/i })
    ).toBeInTheDocument();

    const posts = screen.queryAllByRole('article');
    expect(posts).toHaveLength(0);
  });

  it('should show an error message with refetch button when error happens', async () => {
    server.use(
      http.get(
        blogApi('/api/posts'),
        () => new HttpResponse(null, { status: 500 })
      )
    );
    render(<Stub />, { wrapper: createWrapper() });

    expect(
      await screen.findByRole('heading', { name: /failed to load posts/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('should search for posts', async () => {
    const user = userEvent.setup();
    render(<Stub />, { wrapper: createWrapper() });

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'msw');

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });
  });

  it('should show a message when no posts yet when searching', async () => {
    const user = userEvent.setup();
    render(<Stub />, { wrapper: createWrapper() });

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'some text that does not exist in posts');

    await waitFor(() => {
      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });
  });

  describe('Pagination', () => {
    it('should properly render pagination and do navigation', async () => {
      server.use(
        http.get<PathParams, DefaultBodyType, GetPostsResponse>(
          blogApi('/api/posts'),
          async ({ request }) => {
            await delay(100);

            const url = new URL(request.url);
            const pageParam = url.searchParams.get('page') || '1';

            if (pageParam === '2') {
              return HttpResponse.json({
                data: [
                  {
                    id: 1,
                    title: 'Title 2',
                    description: 'Description 2',
                    content: 'Content 2',
                    createdAt: '2026-06-18T09:00:00.000Z',
                    updatedAt: '2026-06-18T09:00:00.000Z',
                    userId: 42,
                    state: 'PUBLISHED',
                    imageKey: 'post-image-1',
                    imageUrl: 'https://placehold.co/400x300',
                    isLiked: false,
                    likesCount: 0,
                  },
                ],
                totalCount: 2,
                pageSize: 1,
                currentPage: 2,
              });
            }

            return HttpResponse.json({
              data: [
                {
                  id: 2,
                  title: 'Title 1',
                  description: 'Description 1',
                  content: 'Content 1',
                  createdAt: '2026-06-18T09:00:00.000Z',
                  updatedAt: '2026-06-18T09:00:00.000Z',
                  userId: 42,
                  state: 'PUBLISHED',
                  imageKey: 'post-image-2',
                  imageUrl: 'https://placehold.co/400x300',
                  isLiked: false,
                  likesCount: 0,
                },
              ],
              totalCount: 2,
              pageSize: 1,
              currentPage: 1,
            });
          }
        )
      );
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      expect(await screen.findByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(
        screen.getByRole('heading', { name: /title 1/i })
      ).toBeInTheDocument();

      const nextPage = screen.getByRole('button', { name: /next page/i });
      await user.click(nextPage);
      expect(
        await screen.findByRole('heading', { name: /title 2/i })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });
  });

  describe('Likes', () => {
    it('should render like count for posts', async () => {
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      expect(posts).toHaveLength(mockPosts.length);

      const firstPostLikeButton = within(posts[0]).getByRole('button', {
        name: /like/i,
      });
      expect(firstPostLikeButton).toHaveTextContent(
        `${mockPosts[0].likesCount}`
      );
    });

    it('should allow authenticated user to like an unliked post', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      const secondPostArticle = posts[1];
      const likeButton = within(secondPostArticle).getByRole('button', {
        name: /like/i,
      });
      expect(likeButton).toHaveTextContent('20');

      await user.click(likeButton);

      await waitFor(() => {
        expect(likeButton).toHaveTextContent('21');
      });
    });

    it('should allow authenticated user to unlike an already liked post', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      const firstPostArticle = posts[0];
      const likeButton = within(firstPostArticle).getByRole('button', {
        name: /like/i,
      });
      expect(likeButton).toHaveTextContent('133');

      await user.click(likeButton);

      await waitFor(() => {
        expect(likeButton).toHaveTextContent('132');
      });
    });

    it('should prevent post card link navigation when clicking like button', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      const likeButton = within(posts[0]).getByRole('button', {
        name: /like/i,
      });

      await user.click(likeButton);

      expect(
        screen.queryByRole('heading', { name: /post detail page/i })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /writing worth your attention/i })
      ).toBeInTheDocument();
    });

    it('should redirect unauthenticated user to login page when clicking like button', async () => {
      server.use(
        http.get(blogApi('/api/auth/me'), () => {
          return new HttpResponse(null, { status: 401 });
        })
      );
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      const likeButton = within(posts[0]).getByRole('button', {
        name: /like/i,
      });

      await user.click(likeButton);

      expect(
        await screen.findByRole('heading', { name: /login page/i })
      ).toBeInTheDocument();
    });

    it('should not change like count when server returns an error', async () => {
      server.use(
        http.post(blogApi('/api/posts/:id/likes'), () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const posts = await screen.findAllByRole('article');
      const likeButton = within(posts[1]).getByRole('button', {
        name: /like/i,
      });
      expect(likeButton).toHaveTextContent('20');

      await user.click(likeButton);

      expect(likeButton).toHaveTextContent('20');
    });
  });
});
