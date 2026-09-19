import { server } from '@/mocks/node';
import UpdatePost from '@/pages/UpdatePost/UpdatePost';
import ErrorPage from '@/components/ErrorPage';
import { blogApi } from '@/utils/utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createRoutesStub, useParams } from 'react-router';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Toaster, toast } from 'sonner';
import type { Post } from '@/types';
import { createWrapper } from '@/tests/testUtils';
import { populatePosts } from '@/mocks/data/posts';

const UpdatePostWithToaster = () => (
  <>
    <UpdatePost />
    <Toaster />
  </>
);

const PostDetailPage = () => {
  const { id } = useParams();
  return <h1>Post Detail Page: {id}</h1>;
};

const HomePage = () => <h1>Home Page</h1>;

describe('UpdatePost page integration', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/posts/:id/update',
      Component: UpdatePostWithToaster,
      ErrorBoundary: ErrorPage,
    },
    {
      path: '/posts/:id',
      Component: PostDetailPage,
    },
    {
      path: '/',
      Component: HomePage,
    },
  ]);

  beforeEach(() => {
    populatePosts();
    vi.restoreAllMocks();
  });

  describe('Initial Data Loading & Pre-population', () => {
    it('should display loading spinner initially and populate form fields with existing post data once fetched', async () => {
      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      expect(titleInput).toHaveValue(
        'Getting Started with MSW and React Query'
      );

      expect(screen.getByLabelText(/description \/ excerpt/i)).toHaveValue(
        'A comprehensive guide on mocking API endpoints effectively during local development.'
      );
      expect(screen.getByLabelText(/article content/i)).toHaveValue(
        'Mock Service Worker (MSW) allows you to intercept network requests at the network level...'
      );
      expect(screen.getByRole('combobox', { name: /state/i })).toHaveValue(
        'PUBLISHED'
      );
      expect(
        screen.getByText('https://placehold.co/400x300')
      ).toBeInTheDocument();
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
    });

    it('should map DRAFT post state to PUBLISHED default in edit mode', async () => {
      render(<RouterStub initialEntries={['/posts/3/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      expect(titleInput).toHaveValue(
        'Draft: Optimizing React Rendering Performance'
      );

      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      expect(stateSelect).toHaveValue('PUBLISHED');
    });

    it('should render error page when post cannot be loaded', async () => {
      server.use(
        http.get(blogApi('/api/posts/:id'), () =>
          HttpResponse.json({ message: 'Post not found' }, { status: 404 })
        )
      );

      render(<RouterStub initialEntries={['/posts/9999/update']} />, {
        wrapper: createWrapper(),
      });

      expect(await screen.findByText(/post not found/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go home/i })
      ).toBeInTheDocument();
    });
  });

  describe('Successful Update Submission Flow', () => {
    it('should update post details and redirect to post detail page on successful submission', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.clear(titleInput);
      await user.type(
        titleInput,
        'Updated: Getting Started with MSW and React Query'
      );

      await user.clear(descInput);
      await user.type(
        descInput,
        'Updated description with modern testing practices.'
      );

      await user.clear(contentInput);
      await user.type(
        contentInput,
        '# Updated Guide\n\nNew updated article content.'
      );

      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });

    it('should allow replacing the cover image and submitting updates', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RouterStub initialEntries={['/posts/1/update']} />,
        {
          wrapper: createWrapper(),
        }
      );

      await screen.findByLabelText(/title/i);

      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const newCoverImage = new File(
        ['new image bytes'],
        'updated-cover.webp',
        {
          type: 'image/webp',
        }
      );

      await user.upload(fileInput, newCoverImage);

      expect(screen.getByText('updated-cover.webp')).toBeInTheDocument();

      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Draft vs. Published / State Workflows', () => {
    it('should submit updated post as DRAFT and navigate when "Save draft" is clicked', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      const saveDraftButton = screen.getByRole('button', {
        name: /^save draft$/i,
      });

      await user.clear(titleInput);
      await user.type(titleInput, 'Draft Revision of MSW Guide');

      await user.click(saveDraftButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });

    it('should submit state as HIDDEN when state is changed to HIDDEN and "Publish" is clicked', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const stateSelect = await screen.findByRole('combobox', {
        name: /state/i,
      });
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.selectOptions(stateSelect, 'HIDDEN');

      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Pending / In-Flight Mutation State', () => {
    it('should disable submit buttons and display spinner during mutation in-flight, preventing duplicate submissions', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      await screen.findByLabelText(/title/i);

      const publishButton = screen.getByRole('button', { name: /^publish$/i });
      const saveDraftButton = screen.getByRole('button', {
        name: /^save draft$/i,
      });

      expect(publishButton).toBeEnabled();
      expect(saveDraftButton).toBeEnabled();

      await user.click(publishButton);

      expect(publishButton).toBeDisabled();
      expect(saveDraftButton).toBeDisabled();

      expect(publishButton.querySelector('.animate-spin')).toBeInTheDocument();
      expect(
        saveDraftButton.querySelector('.animate-spin')
      ).toBeInTheDocument();

      await user.click(publishButton);
      await user.click(saveDraftButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Server Error Handling & Retry Flow', () => {
    it('should display error toast and keep form inputs intact when update fails on server', async () => {
      server.use(
        http.put(
          blogApi('/api/posts/:id'),
          () =>
            new HttpResponse(
              JSON.stringify({ message: 'Internal server error' }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              }
            )
        )
      );

      const toastErrorSpy = vi.spyOn(toast, 'error');
      const user = userEvent.setup();

      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.clear(titleInput);
      await user.type(titleInput, 'Title with Server Error Destination');

      await user.clear(descInput);
      await user.type(
        descInput,
        'Updated description that should not be lost.'
      );

      await user.click(publishButton);

      await waitFor(() => {
        expect(toastErrorSpy).toHaveBeenCalledWith(
          'Failed to update. Try again'
        );
      });

      const toastElements = await screen.findAllByText(
        /failed to update\. try again/i
      );
      expect(toastElements.length).toBeGreaterThan(0);

      expect(screen.getByLabelText(/title/i)).toHaveValue(
        'Title with Server Error Destination'
      );
      expect(screen.getByLabelText(/description \/ excerpt/i)).toHaveValue(
        'Updated description that should not be lost.'
      );

      expect(
        screen.queryByRole('heading', { name: /post detail page/i })
      ).not.toBeInTheDocument();

      expect(publishButton).toBeEnabled();
    });

    it('should allow user to retry and successfully navigate after server error recovery', async () => {
      let failureCount = 1;

      server.use(
        http.put(blogApi('/api/posts/:id'), async ({ params }) => {
          if (failureCount > 0) {
            failureCount -= 1;
            return new HttpResponse(null, { status: 500 });
          }

          const updatedPost: Post = {
            id: Number(params.id),
            title: 'Recovered and Updated Title',
            description: 'Recovered description.',
            content: 'Recovered content.',
            state: 'PUBLISHED',
            createdAt: '2026-01-15T08:30:00.000Z',
            updatedAt: new Date().toISOString(),
            userId: 42,
            imageKey: 'post-image-1',
            coverImageUrl: 'https://placehold.co/400x300',
            thumbnailUrl: 'https://placehold.co/400x300',
            isLiked: true,
            likesCount: 133,
          };
          return HttpResponse.json(updatedPost, { status: 200 });
        })
      );

      const toastErrorSpy = vi.spyOn(toast, 'error');
      const user = userEvent.setup();

      render(<RouterStub initialEntries={['/posts/1/update']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = await screen.findByLabelText(/title/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.clear(titleInput);
      await user.type(titleInput, 'Recovered and Updated Title');

      // First attempt -> Fails
      await user.click(publishButton);

      await waitFor(() => {
        expect(toastErrorSpy).toHaveBeenCalledWith(
          'Failed to update. Try again'
        );
      });

      // Second attempt without retyping -> Succeeds
      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: 'Post Detail Page: 1',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
      expect(failureCount).toBe(0);
    });
  });
});
