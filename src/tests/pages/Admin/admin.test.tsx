import { server } from '@/mocks/node';
import Admin from '@/pages/Admin/Admin';
import { blogApi } from '@/utils/utils';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, type DefaultBodyType, type PathParams } from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createWrapper } from '@/tests/testUtils';
import { mockPosts } from '@/mocks/data/posts';
import { Toaster, toast } from 'sonner';
import type { PaginatedResponse, Post } from '@/types';

describe('Admin page component', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/admin',
      Component: () => (
        <>
          <Admin />
          <Toaster />
        </>
      ),
    },
    {
      path: '/posts/create',
      Component: () => <h1>Create Post Page</h1>,
    },
    {
      path: '/posts/:id/update',
      Component: () => <h1>Update Post Page</h1>,
    },
  ]);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Load & Data Rendering', () => {
    it('should display the loading spinner initially and render dashboard header, metrics, toolbar, and post table upon success', async () => {
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('admin-spinner')).toBeInTheDocument();

      expect(
        await screen.findByRole('heading', { name: /admin dashboard/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/administration · content control/i)
      ).toBeInTheDocument();

      const publishedPosts = mockPosts.filter((p) => p.state === 'PUBLISHED');
      const draftPosts = mockPosts.filter((p) => p.state === 'DRAFT');
      const hiddenPosts = mockPosts.filter((p) => p.state === 'HIDDEN');

      const header = screen
        .getByRole('heading', { name: /admin dashboard/i })
        .closest('header')!;
      const totalCard =
        within(header).getByText('Total Posts').parentElement?.parentElement;
      const publishedCard =
        within(header).getByText('Published').parentElement?.parentElement;
      const draftsCard =
        within(header).getByText('Drafts').parentElement?.parentElement;
      const hiddenCard =
        within(header).getByText('Hidden').parentElement?.parentElement;

      expect(
        within(totalCard!).getByText(`${mockPosts.length}`)
      ).toBeInTheDocument();
      expect(
        within(publishedCard!).getByText(`${publishedPosts.length}`)
      ).toBeInTheDocument();
      expect(
        within(draftsCard!).getByText(`${draftPosts.length}`)
      ).toBeInTheDocument();
      expect(
        within(hiddenCard!).getByText(`${hiddenPosts.length}`)
      ).toBeInTheDocument();

      expect(
        screen.getByRole('searchbox', { name: /search posts/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('group', { name: /filter posts by status/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /create post/i })
      ).toBeInTheDocument();

      const table = screen.getByRole('table', { name: /admin posts table/i });
      expect(table).toBeInTheDocument();

      const rows = within(table).getAllByRole('row');
      expect(rows).toHaveLength(mockPosts.length + 1);

      expect(
        screen.getByText('Getting Started with MSW and React Query')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Mastering TypeScript Type Definitions')
      ).toBeInTheDocument();

      expect(
        screen.getByText((_, element) => {
          return (
            element?.tagName.toLowerCase() === 'p' &&
            element.textContent?.replace(/\s+/g, ' ').trim() ===
              `Showing ${mockPosts.length} of ${mockPosts.length} posts`
          );
        })
      ).toBeInTheDocument();

      expect(screen.queryByTestId('admin-spinner')).not.toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    it('should filter posts by status and update URL search parameters', async () => {
      server.use(
        http.get<PathParams, DefaultBodyType, PaginatedResponse<Post>>(
          blogApi('/api/posts'),
          async ({ request }) => {
            const url = new URL(request.url);
            const stateParam = url.searchParams.get('state');

            const filtered = stateParam
              ? mockPosts.filter((p) => p.state === stateParam)
              : mockPosts;

            return HttpResponse.json({
              data: filtered,
              totalCount: filtered.length,
              pageSize: 10,
              currentPage: 1,
            });
          }
        )
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const publishedFilterButton = screen.getByRole('button', {
        name: /^published$/i,
      });
      await user.click(publishedFilterButton);

      await waitFor(() => {
        const publishedCount = mockPosts.filter(
          (p) => p.state === 'PUBLISHED'
        ).length;
        const rows = within(
          screen.getByRole('table', { name: /admin posts table/i })
        ).getAllByRole('row');
        expect(rows).toHaveLength(publishedCount + 1);
      });

      expect(
        screen.queryByText('Draft: Optimizing React Rendering Performance')
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('Getting Started with MSW and React Query')
      ).toBeInTheDocument();

      const draftFilterButton = screen.getByRole('button', {
        name: /^draft$/i,
      });
      await user.click(draftFilterButton);

      await waitFor(() => {
        expect(
          screen.getByText('Draft: Optimizing React Rendering Performance')
        ).toBeInTheDocument();
      });
      expect(
        screen.queryByText('Getting Started with MSW and React Query')
      ).not.toBeInTheDocument();

      const hiddenFilterButton = screen.getByRole('button', {
        name: /^hidden$/i,
      });
      await user.click(hiddenFilterButton);

      await waitFor(() => {
        expect(screen.getByText('Archived Feature Specs')).toBeInTheDocument();
      });

      const allFilterButton = screen.getByRole('button', {
        name: /^all$/i,
      });
      await user.click(allFilterButton);

      await waitFor(() => {
        const rows = within(
          screen.getByRole('table', { name: /admin posts table/i })
        ).getAllByRole('row');
        expect(rows).toHaveLength(mockPosts.length + 1);
      });
    });
  });

  describe('Search with Debounce', () => {
    it('should filter posts based on debounced search input', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const searchInput = screen.getByRole('searchbox', {
        name: /search posts/i,
      });
      await user.type(searchInput, 'TypeScript');

      await waitFor(
        () => {
          expect(
            screen.getByText('Mastering TypeScript Type Definitions')
          ).toBeInTheDocument();
          expect(
            screen.queryByText('Getting Started with MSW and React Query')
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      await user.clear(searchInput);

      await waitFor(
        () => {
          expect(
            screen.getByText('Getting Started with MSW and React Query')
          ).toBeInTheDocument();
          expect(
            screen.getByText('Mastering TypeScript Type Definitions')
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Pagination Workflow', () => {
    it('should render pagination controls and navigate through pages', async () => {
      server.use(
        http.get<PathParams, DefaultBodyType, PaginatedResponse<Post>>(
          blogApi('/api/posts'),
          async ({ request }) => {
            const url = new URL(request.url);
            const pageParam = url.searchParams.get('page') || '1';

            if (pageParam === '2') {
              return HttpResponse.json({
                data: [
                  {
                    id: 20,
                    title: 'Page 2 Exclusive Post',
                    description: 'This post is on page 2.',
                    content: 'Page 2 content...',
                    createdAt: '2026-08-01T10:00:00.000Z',
                    updatedAt: '2026-08-01T10:00:00.000Z',
                    userId: 42,
                    state: 'PUBLISHED',
                    imageKey: 'p2',
                    coverImageUrl: 'https://placehold.co/400x300',
                    thumbnailUrl: 'https://placehold.co/400x300',
                    isLiked: false,
                    likesCount: 0,
                  },
                ],
                totalCount: 20,
                pageSize: 10,
                currentPage: 2,
              });
            }

            return HttpResponse.json({
              data: [
                {
                  id: 10,
                  title: 'Page 1 Exclusive Post',
                  description: 'This post is on page 1.',
                  content: 'Page 1 content...',
                  createdAt: '2026-07-01T10:00:00.000Z',
                  updatedAt: '2026-07-01T10:00:00.000Z',
                  userId: 42,
                  state: 'PUBLISHED',
                  imageKey: 'p1',
                  coverImageUrl: 'https://placehold.co/400x300',
                  thumbnailUrl: 'https://placehold.co/400x300',
                  isLiked: false,
                  likesCount: 0,
                },
              ],
              totalCount: 20,
              pageSize: 10,
              currentPage: 1,
            });
          }
        )
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      expect(
        await screen.findByRole('heading', { name: /admin dashboard/i })
      ).toBeInTheDocument();

      expect(screen.getByText('Page 1 Exclusive Post')).toBeInTheDocument();

      const paginationNav = screen.getByRole('navigation', {
        name: /pagination/i,
      });
      expect(paginationNav).toBeInTheDocument();

      const page2Button = screen.getByRole('button', { name: /^page 2$/i });
      await user.click(page2Button);

      expect(
        await screen.findByText('Page 2 Exclusive Post')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Page 1 Exclusive Post')
      ).not.toBeInTheDocument();

      const prevButton = screen.getByRole('button', { name: /previous page/i });
      await user.click(prevButton);

      expect(
        await screen.findByText('Page 1 Exclusive Post')
      ).toBeInTheDocument();
    });
  });

  describe('Delete Post Workflow', () => {
    it('should delete post when user confirms dialog and display success toast notification', async () => {
      let deleteCalledWithId: string | null = null;

      server.use(
        http.delete(blogApi('/api/posts/:id'), async ({ params }) => {
          deleteCalledWithId = params.id as string;
          return HttpResponse.json({
            message: 'Post was successfully deleted',
          });
        })
      );

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const toastSpy = vi.spyOn(toast, 'success');

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const firstPost = mockPosts[0];
      const deleteButton = screen.getByRole('button', {
        name: `Delete post: ${firstPost.title}`,
      });

      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
      expect(deleteCalledWithId).toBe(`${firstPost.id}`);

      await waitFor(() => {
        expect(toastSpy).toHaveBeenCalledWith('Post was successfully deleted');
      });

      expect(
        await screen.findByText('Post was successfully deleted')
      ).toBeInTheDocument();
    });

    it('should not delete post when user cancels the confirmation dialog', async () => {
      let deleteCalled = false;

      server.use(
        http.delete(blogApi('/api/posts/:id'), async () => {
          deleteCalled = true;
          return HttpResponse.json({
            message: 'Post was successfully deleted',
          });
        })
      );

      vi.spyOn(window, 'confirm').mockReturnValue(false);
      const toastSpy = vi.spyOn(toast, 'success');

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const firstPost = mockPosts[0];
      const deleteButton = screen.getByRole('button', {
        name: `Delete post: ${firstPost.title}`,
      });

      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
      expect(deleteCalled).toBe(false);
      expect(toastSpy).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Triggers', () => {
    it('should navigate to /posts/create when clicking "Create post" button', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const createPostLink = screen.getByRole('link', {
        name: /create post/i,
      });
      await user.click(createPostLink);

      expect(
        await screen.findByRole('heading', { name: /create post page/i })
      ).toBeInTheDocument();
    });

    it('should navigate to /posts/:id/update when clicking "Update" button on a post row', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByRole('heading', { name: /admin dashboard/i });

      const firstPost = mockPosts[0];
      const updateLink = screen.getByRole('link', {
        name: `Update post: ${firstPost.title}`,
      });
      await user.click(updateLink);

      expect(
        await screen.findByRole('heading', { name: /update post page/i })
      ).toBeInTheDocument();
    });
  });

  describe('Empty and Error States', () => {
    it('should display "No posts found" message when API returns an empty list', async () => {
      server.use(
        http.get(blogApi('/api/posts'), () =>
          HttpResponse.json({
            data: [],
            totalCount: 0,
            pageSize: 10,
            currentPage: 1,
          })
        )
      );

      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      expect(await screen.findByText(/no posts found/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /no posts match the current filter or search criteria\./i
        )
      ).toBeInTheDocument();

      const header = screen
        .getByRole('heading', { name: /admin dashboard/i })
        .closest('header')!;
      const totalPostsCard =
        within(header).getByText('Total Posts').parentElement?.parentElement;
      expect(within(totalPostsCard!).getByText('0')).toBeInTheDocument();

      expect(
        screen.queryByRole('navigation', { name: /pagination/i })
      ).not.toBeInTheDocument();
    });

    it('should handle 500 server error gracefully without unhandled exceptions', async () => {
      server.use(
        http.get(
          blogApi('/api/posts'),
          () => new HttpResponse(null, { status: 500 })
        )
      );

      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('admin-spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('admin-spinner')).not.toBeInTheDocument();
      });
    });

    it('should handle 403 forbidden error gracefully without unhandled exceptions', async () => {
      server.use(
        http.get(
          blogApi('/api/posts'),
          () => new HttpResponse(null, { status: 403 })
        )
      );

      render(<RouterStub initialEntries={['/admin']} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByTestId('admin-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('URL Search Params Initialization', () => {
    it('should initialize search input and filter state from initial URL search params', async () => {
      render(
        <RouterStub initialEntries={['/admin?search=MSW&state=PUBLISHED']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const searchInput = await screen.findByRole('searchbox', {
        name: /search posts/i,
      });
      expect(searchInput).toHaveValue('MSW');

      const publishedFilterButton = screen.getByRole('button', {
        name: /^published$/i,
      });
      expect(publishedFilterButton).toHaveClass('bg-card');
    });
  });
});
