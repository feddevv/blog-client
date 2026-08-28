import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createWrapper } from '@/tests/testUtils';
import { populateComments } from '@/mocks/data/comments';
import { createRoutesStub } from 'react-router';
import Post from '@/pages/Post/Post';
import ErrorPage from '@/components/ErrorPage';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/node';
import {
  delay,
  http,
  HttpResponse,
  type DefaultBodyType,
  type PathParams,
} from 'msw';
import { blogApi } from '@/utils/utils';
import type { GetCommentsResponse } from '@/types';

describe('Comments section component', () => {
  beforeEach(() => {
    populateComments();
  });

  const Stub = createRoutesStub([
    {
      path: '/posts/:id',
      Component: Post,
      ErrorBoundary: ErrorPage,
    },
  ]);

  it("should render the post's comments", async () => {
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    const spinner = screen.getByTestId('comments-spinner');
    expect(spinner).toBeInTheDocument();

    expect(await screen.findAllByRole('article')).toHaveLength(2);

    expect(screen.getByText('alex_dev')).toBeInTheDocument();
  });

  it('should create a comment', async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    const postButton = await screen.findByRole('button', { name: /post/i });
    const input = screen.getByRole('textbox');

    await user.type(input, 'New comment');
    await user.click(postButton);

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    expect(screen.getByText(/new comment/i)).toBeInTheDocument();
  });

  it('should clear the form after comment is created', async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    const postButton = await screen.findByRole('button', { name: /post/i });
    const input = screen.getByRole('textbox');

    await user.type(input, 'Some content');
    await user.click(postButton);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('show an error when the textarea is empty', async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    const postButton = await screen.findByRole('button', { name: /post/i });
    await user.click(postButton);

    expect(
      screen.getByText(/comment must be at least 1 character/i)
    ).toBeInTheDocument();
  });

  it('should hide an empty textarea error when user type in something', async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    const postButton = await screen.findByRole('button', { name: /post/i });
    const input = screen.getByRole('textbox');

    await user.click(postButton);
    await user.type(input, 'hi');
    expect(
      screen.queryByText(/comment must be at least 1 character/i)
    ).not.toBeInTheDocument();
  });

  it('should show an error with refetch button when error happens', async () => {
    server.use(
      http.get(
        blogApi('/api/posts/:id/comments'),
        () => new HttpResponse(null, { status: 500 })
      )
    );
    render(<Stub initialEntries={['/posts/1']} />, {
      wrapper: createWrapper(),
    });

    expect(
      await screen.findByText(/failed to load comments/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  describe('Comment Optimistic UI', () => {
    it('should instantly show the comment without waiting for the response', async () => {
      const user = userEvent.setup();

      render(<Stub initialEntries={['/posts/1']} />, {
        wrapper: createWrapper(),
      });

      const input = await screen.findByRole('textbox');
      const postButton = screen.getByRole('button', { name: /post/i });
      await user.type(input, 'new comment');
      await user.click(postButton);

      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('should rollback when error occurs', async () => {
      server.use(
        http.post(blogApi('/api/posts/:id/comments'), async () => {
          await delay(100);
          return new HttpResponse(null, { status: 500 });
        })
      );
      const user = userEvent.setup();
      render(<Stub initialEntries={['/posts/1']} />, {
        wrapper: createWrapper(),
      });

      const input = await screen.findByRole('textbox');
      const postButton = screen.getByRole('button', { name: /post/i });
      await user.type(input, 'new comment');
      await user.click(postButton);

      expect(screen.getAllByRole('article')).toHaveLength(3);

      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(2);
      });
    });
  });

  describe('Pagination', () => {
    it('should properly render pagination and do navigation', async () => {
      server.use(
        http.get<PathParams, DefaultBodyType, GetCommentsResponse>(
          blogApi('/api/posts/:id/comments'),
          async ({ request }) => {
            await delay(100);

            const url = new URL(request.url);
            const pageParam = url.searchParams.get('page') || '1';

            if (pageParam === '2') {
              return HttpResponse.json({
                data: [
                  {
                    id: 2,
                    content: 'Comment 2',
                    createdAt: '2026-06-18T09:00:00.000Z',
                    updatedAt: '2026-06-18T09:00:00.000Z',
                    postId: 1,
                    user: {
                      username: 'user 2',
                    },
                    userId: 2,
                    isLiked: true,
                    likesCount: 40,
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
                  id: 1,
                  content: 'Comment 1',
                  createdAt: '2026-06-18T09:00:00.000Z',
                  updatedAt: '2026-06-18T09:00:00.000Z',
                  postId: 1,
                  user: {
                    username: 'user 1',
                  },
                  userId: 1,
                  isLiked: false,
                  likesCount: 13,
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
      render(<Stub initialEntries={['/posts/1']} />, {
        wrapper: createWrapper(),
      });

      expect(await screen.findByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByText(/comment 1/i)).toBeInTheDocument();

      const nextPage = screen.getByRole('button', { name: /next page/i });
      await user.click(nextPage);
      expect(await screen.findByText(/comment 2/i)).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });
  });
});
