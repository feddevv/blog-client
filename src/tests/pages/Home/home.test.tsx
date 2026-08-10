import { server } from '@/mocks/node';
import Home from '@/pages/Home/Home';
import { blogApi } from '@/utils/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { type ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

const createWrapper = () => {
  const client = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('Home component', () => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Home,
    },
  ]);

  it('should correctly render the spinner and then posts', async () => {
    render(<Stub />, { wrapper: createWrapper() });

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();

    const posts = await screen.findAllByRole('article');
    expect(posts).toHaveLength(7);

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

  // it('should show an error message with refetch button when error happens', async () => {
  //   server.use(
  //     http.get(
  //       blogApi('/api/posts'),
  //       () => new HttpResponse(null, { status: 500 })
  //     )
  //   );
  //   render(<Stub />, { wrapper: createWrapper() });

  //   expect(
  //     await screen.findByRole('heading', { name: /failed to load posts/i })
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByRole('button', { name: /try again/i })
  //   ).toBeInTheDocument();
  // });

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
});
