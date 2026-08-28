import { describe, expect, it } from 'vitest';
import { createWrapper } from '@/tests/testUtils';
import { createRoutesStub } from 'react-router';
import Post from '@/pages/Post/Post';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from '@/components/ErrorPage';
import { server } from '@/mocks/node';
import { blogApi } from '@/utils/utils';
import { http, HttpResponse } from 'msw';

describe('Post component', () => {
  const Stub = createRoutesStub([
    {
      path: '/posts/:id',
      Component: Post,
      ErrorBoundary: ErrorPage,
    },
    {
      path: '/login',
      Component: () => <h1>Login Page</h1>,
    },
  ]);

  describe('PostMain component', () => {
    it('should render the post by id', async () => {
      render(<Stub initialEntries={['/posts/2']} />, {
        wrapper: createWrapper(),
      });

      const spinner = screen.getByTestId('post-spinner');
      expect(spinner).toBeInTheDocument();

      expect(
        await screen.findByRole('heading', {
          name: /Mastering TypeScript Type Definitions/i,
        })
      );

      expect(screen.getByText(/feb 1, 2026/i)).toBeInTheDocument();

      expect(
        screen.getByText(
          'Learn how to leverage strict types for cleaner and safer frontend codebases.'
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'TypeScript brings type safety to JavaScript, reducing runtime errors and improving DX...'
        )
      ).toBeInTheDocument();
    });

    it('should show a 404 error when post does not exist', async () => {
      server.use(
        http.get(blogApi('/api/posts/:id'), () =>
          HttpResponse.json({ message: 'Post not found' }, { status: 404 })
        )
      );

      render(<Stub initialEntries={['/posts/10000']} />, {
        wrapper: createWrapper(),
      });

      expect(await screen.findByText(/post not found/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go home/i })
      ).toBeInTheDocument();
    });
  });

  describe('Likes', () => {
    it('should render the post like count', async () => {
      render(<Stub initialEntries={['/posts/2']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', {
        name: /Mastering TypeScript Type Definitions/i,
      });

      const likeButtons = screen.getAllByRole('button', {
        name: /like/i,
      });
      expect(likeButtons[0]).toHaveTextContent('20');
    });

    it('should allow authenticated user to like an unliked post', async () => {
      const user = userEvent.setup();
      render(<Stub initialEntries={['/posts/2']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', {
        name: /Mastering TypeScript Type Definitions/i,
      });

      const likeButtons = screen.getAllByRole('button', {
        name: /like/i,
      });
      const postLikeButton = likeButtons[0];
      expect(postLikeButton).toHaveTextContent('20');

      await user.click(postLikeButton);

      await waitFor(() => {
        expect(postLikeButton).toHaveTextContent('21');
      });
    });

    it('should allow authenticated user to unlike an already liked post', async () => {
      const user = userEvent.setup();
      render(<Stub initialEntries={['/posts/1']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', {
        name: /Getting Started with MSW and React Query/i,
      });

      const likeButtons = screen.getAllByRole('button', {
        name: /like/i,
      });
      const postLikeButton = likeButtons[0];
      expect(postLikeButton).toHaveTextContent('133');

      await user.click(postLikeButton);

      await waitFor(() => {
        expect(postLikeButton).toHaveTextContent('132');
      });
    });

    it('should redirect unauthenticated user to login page when clicking like button', async () => {
      server.use(
        http.get(blogApi('/api/auth/me'), () => {
          return new HttpResponse(null, { status: 401 });
        })
      );
      const user = userEvent.setup();
      render(<Stub initialEntries={['/posts/2']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', {
        name: /Mastering TypeScript Type Definitions/i,
      });

      const likeButtons = screen.getAllByRole('button', {
        name: /like/i,
      });
      const postLikeButton = likeButtons[0];

      await user.click(postLikeButton);

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
      render(<Stub initialEntries={['/posts/2']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', {
        name: /Mastering TypeScript Type Definitions/i,
      });

      const likeButtons = screen.getAllByRole('button', {
        name: /like/i,
      });
      const postLikeButton = likeButtons[0];
      expect(postLikeButton).toHaveTextContent('20');

      await user.click(postLikeButton);

      expect(postLikeButton).toHaveTextContent('20');
    });
  });
});
