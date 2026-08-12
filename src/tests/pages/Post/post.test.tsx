import { describe, expect, it } from 'vitest';
import { createWrapper } from '@/tests/testUtils';
import { createRoutesStub } from 'react-router';
import Post from '@/pages/Post/Post';
import { render, screen, waitFor } from '@testing-library/react';
import ErrorPage from '@/components/ErrorPage';
import { server } from '@/mocks/node';
import { blogApi } from '@/utils/utils';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';

describe('Post component', () => {
  const Stub = createRoutesStub([
    {
      path: '/posts/:id',
      Component: Post,
      ErrorBoundary: ErrorPage,
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

  describe('Comments component', () => {
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
  });
});
