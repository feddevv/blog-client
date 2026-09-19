import { server } from '@/mocks/node';
import CreatePost from '@/pages/CreatePost/CreatePost';
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

const CreatePostWithToaster = () => (
  <>
    <CreatePost />
    <Toaster />
  </>
);

const PostDetailPage = () => {
  const { id } = useParams();
  return <h1>Post Detail Page: {id}</h1>;
};

describe('CreatePost page integration', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/posts/create',
      Component: CreatePostWithToaster,
    },
    {
      path: '/posts/:id',
      Component: PostDetailPage,
    },
  ]);

  beforeEach(() => {
    populatePosts();
    vi.restoreAllMocks();
  });

  describe('Successful Submission Flow', () => {
    it('should submit valid form data to POST /api/posts, and navigate to post detail page', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RouterStub initialEntries={['/posts/create']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const coverFile = new File(['sample image content'], 'react-guide.png', {
        type: 'image/png',
      });

      await user.type(
        titleInput,
        'Complete Guide to React Integration Testing'
      );
      await user.type(
        descInput,
        'Learn how to write resilient end-to-end integration tests in React.'
      );
      await user.type(
        contentInput,
        '# React Testing\n\nTesting React applications from the user perspective...'
      );
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.selectOptions(stateSelect, 'PUBLISHED');
      await user.upload(fileInput, coverFile);

      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: `Post Detail Page: ${8}`,
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Draft vs. Published Workflows', () => {
    it('should submit state as DRAFT and navigate when "Save draft" button is clicked', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/posts/create']} />, {
        wrapper: createWrapper(),
      });

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const saveDraftButton = screen.getByRole('button', {
        name: /^save draft$/i,
      });

      await user.type(titleInput, 'WIP: Advanced Architecture Patterns');
      await user.type(descInput, 'Notes on clean architecture.');
      await user.type(contentInput, '# Draft Section\n\nContent in progress.');

      await user.click(saveDraftButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: `Post Detail Page: 8`,
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });

    it('should submit state as HIDDEN when HIDDEN is selected and "Publish" is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RouterStub initialEntries={['/posts/create']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const imageFile = new File(['image'], 'unlisted-cover.webp', {
        type: 'image/webp',
      });

      await user.type(titleInput, 'Internal Documentation for Engineering');
      await user.type(descInput, 'Unlisted internal guidelines.');
      await user.type(contentInput, '# Internal Specs\n\nConfidential notes.');
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.upload(fileInput, imageFile);

      await user.click(publishButton);

      expect(
        await screen.findByRole(
          'heading',
          {
            name: `Post Detail Page: 8`,
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Pending / Submitting UI States', () => {
    it('should disable submit buttons and render loading spinner while mutation is in-flight, preventing duplicate submissions', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RouterStub initialEntries={['/posts/create']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;

      const imageFile = new File(['bytes'], 'cover.png', {
        type: 'image/png',
      });

      await user.type(titleInput, 'Testing In-flight Mutation States');
      await user.type(descInput, 'Checking button disables and spinners.');
      await user.type(contentInput, 'Some valid markdown content for testing.');
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.selectOptions(stateSelect, 'PUBLISHED');
      await user.upload(fileInput, imageFile);

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
            name: 'Post Detail Page: 8',
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe('Server Error Handling', () => {
    it('should display error toast notification and preserve form inputs on error', async () => {
      server.use(
        http.post(
          blogApi('/api/posts'),
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
      const { container } = render(
        <RouterStub initialEntries={['/posts/create']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const imageFile = new File(['img-content'], 'failed-cover.png', {
        type: 'image/png',
      });

      await user.type(titleInput, 'Post destined to fail on server');
      await user.type(descInput, 'Description that should not be lost.');
      await user.type(contentInput, 'Content that should remain intact.');
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.selectOptions(stateSelect, 'PUBLISHED');
      await user.upload(fileInput, imageFile);

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
        'Post destined to fail on server'
      );
      expect(screen.getByLabelText(/description \/ excerpt/i)).toHaveValue(
        'Description that should not be lost.'
      );
      expect(screen.getByLabelText(/article content/i)).toHaveValue(
        'Content that should remain intact.'
      );
      expect(
        screen.queryByRole('heading', { name: /post detail page/i })
      ).not.toBeInTheDocument();

      expect(publishButton).toBeEnabled();
    });

    it('should allow user to retry and succeed after recovering from a server error', async () => {
      let failureCount = 1;
      const recoveredPostId = 555;

      server.use(
        http.post(blogApi('/api/posts'), async () => {
          if (failureCount > 0) {
            failureCount -= 1;
            return new HttpResponse(null, { status: 500 });
          }

          const post: Post = {
            id: recoveredPostId,
            title: 'Resilient Post Submission',
            description: 'Testing submission retry after failure.',
            content: 'Content is safe and ready to resubmit.',
            state: 'PUBLISHED',
            createdAt: '2026-09-18T10:00:00.000Z',
            updatedAt: '2026-09-18T10:00:00.000Z',
            userId: 42,
            imageKey: 'img-recovered',
            coverImageUrl: 'https://placehold.co/400x300',
            thumbnailUrl: 'https://placehold.co/400x300',
            isLiked: false,
            likesCount: 0,
          };
          return HttpResponse.json(post, { status: 201 });
        })
      );

      const toastErrorSpy = vi.spyOn(toast, 'error');
      const user = userEvent.setup();
      const { container } = render(
        <RouterStub initialEntries={['/posts/create']} />,
        {
          wrapper: createWrapper(),
        }
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const imageFile = new File(['img'], 'retry.png', { type: 'image/png' });

      await user.type(titleInput, 'Resilient Post Submission');
      await user.type(descInput, 'Testing submission retry after failure.');
      await user.type(contentInput, 'Content is safe and ready to resubmit.');
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.selectOptions(stateSelect, 'PUBLISHED');
      await user.upload(fileInput, imageFile);

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
            name: `Post Detail Page: ${recoveredPostId}`,
          },
          { timeout: 4000 }
        )
      ).toBeInTheDocument();
      expect(failureCount).toBe(0);
    });
  });
});
