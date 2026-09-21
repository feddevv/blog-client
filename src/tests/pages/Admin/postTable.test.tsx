import PostTable from '@/pages/Admin/PostTable';
import type { Post } from '@/types';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

describe('PostTable component', () => {
  const mockPostList: Post[] = [
    {
      id: 1,
      title: 'First Admin Post',
      description: 'First description',
      content: 'Content 1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      userId: 1,
      state: 'PUBLISHED',
      imageKey: 'img-1',
      coverImageUrl: 'https://placehold.co/400x300',
      thumbnailUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 5,
    },
    {
      id: 2,
      title: 'Second Admin Post',
      description: 'Second description',
      content: 'Content 2',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
      userId: 1,
      state: 'DRAFT',
      imageKey: 'img-2',
      coverImageUrl: 'https://placehold.co/400x300',
      thumbnailUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 0,
    },
  ];

  const renderTable = (
    posts: Post[] = mockPostList,
    onUpdate = vi.fn(),
    onDelete = vi.fn()
  ) => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => (
          <PostTable posts={posts} onUpdate={onUpdate} onDelete={onDelete} />
        ),
      },
    ]);

    return render(<Stub initialEntries={['/']} />);
  };

  it('should render table headers and list of posts', () => {
    renderTable();

    const table = screen.getByRole('table', { name: /admin posts table/i });
    expect(table).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: /title/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /status/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /actions/i })
    ).toBeInTheDocument();

    expect(screen.getByText('First Admin Post')).toBeInTheDocument();
    expect(screen.getByText('Second Admin Post')).toBeInTheDocument();

    // 1 header row + 2 data rows
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  it('should render empty state message when posts array is empty', () => {
    renderTable([]);

    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /no posts match the current filter or search criteria\./i
      )
    ).toBeInTheDocument();
  });

  it('should delegate onDelete callbacks when delete button in a row is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderTable(mockPostList, vi.fn(), onDelete);

    const deleteBtn = screen.getByRole('button', {
      name: `Delete post: ${mockPostList[0].title}`,
    });
    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(mockPostList[0]);
  });
});
