import { describe, expect, it } from 'vitest';
import { createWrapper } from '@/tests/testUtils';
import { createRoutesStub } from 'react-router';
import Post from '@/pages/Post/Post';
import { render, screen } from '@testing-library/react';
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
});
