import PostTableRow from '@/pages/Admin/PostTableRow';
import type { Post } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

describe('PostTableRow component', () => {
  const samplePost: Post = {
    id: 101,
    title: 'Component Design Patterns',
    description: 'A comprehensive review of design patterns in React.',
    content: 'Long content...',
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-15T10:00:00.000Z',
    userId: 1,
    state: 'PUBLISHED',
    imageKey: 'key-101',
    coverImageUrl: 'https://placehold.co/400x300',
    thumbnailUrl: 'https://example.com/thumb.png',
    isLiked: false,
    likesCount: 15,
  };

  const renderRow = (
    post: Post = samplePost,
    onUpdate = vi.fn(),
    onDelete = vi.fn()
  ) => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => (
          <table>
            <tbody>
              <PostTableRow
                post={post}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </tbody>
          </table>
        ),
      },
      {
        path: '/posts/:id/update',
        Component: () => <h1>Update Page</h1>,
      },
    ]);

    return render(<Stub initialEntries={['/']} />);
  };

  it('should render post title, description, status badge, formatted date, and action buttons', () => {
    renderRow();

    expect(screen.getByText('Component Design Patterns')).toBeInTheDocument();
    expect(
      screen.getByText('A comprehensive review of design patterns in React.')
    ).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mar 15, 2026/i).length).toBeGreaterThan(0);

    const updateLink = screen.getByRole('link', {
      name: 'Update post: Component Design Patterns',
    });
    expect(updateLink).toBeInTheDocument();
    expect(updateLink).toHaveAttribute('href', '/posts/101/update');

    const deleteBtn = screen.getByRole('button', {
      name: 'Delete post: Component Design Patterns',
    });
    expect(deleteBtn).toBeInTheDocument();
  });

  it('should render fallback icon when post has no thumbnailUrl', () => {
    const postWithoutThumb: Post = {
      ...samplePost,
      thumbnailUrl: undefined,
    };

    const { container } = renderRow(postWithoutThumb);

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('should call onUpdate when clicking Update link', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    renderRow(samplePost, onUpdate);

    const updateLink = screen.getByRole('link', {
      name: 'Update post: Component Design Patterns',
    });
    await user.click(updateLink);

    expect(onUpdate).toHaveBeenCalledWith(samplePost);
    expect(
      await screen.findByRole('heading', { name: /update page/i })
    ).toBeInTheDocument();
  });

  it('should call onDelete when clicking Delete button', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderRow(samplePost, vi.fn(), onDelete);

    const deleteBtn = screen.getByRole('button', {
      name: 'Delete post: Component Design Patterns',
    });
    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(samplePost);
  });
});
