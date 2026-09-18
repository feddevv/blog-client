import AdminToolbar from '@/pages/Admin/AdminToolbar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

describe('AdminToolbar component', () => {
  const renderToolbar = (props: React.ComponentProps<typeof AdminToolbar> = {}) => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => <AdminToolbar {...props} />,
      },
      {
        path: '/posts/create',
        Component: () => <h1>Create Page</h1>,
      },
    ]);

    return render(<Stub initialEntries={['/']} />);
  };

  it('should render search input, status filter buttons, and create post link', () => {
    renderToolbar();

    expect(
      screen.getByRole('searchbox', { name: /search posts/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search posts by title\.\.\./i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^published$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^draft$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^hidden$/i })
    ).toBeInTheDocument();

    const createLink = screen.getByRole('link', { name: /create post/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute('href', '/posts/create');
  });

  it('should trigger onSearchChange callback when user types in search input', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    renderToolbar({ searchTerm: '', onSearchChange });

    const searchInput = screen.getByRole('searchbox', {
      name: /search posts/i,
    });
    await user.type(searchInput, 'React');

    expect(onSearchChange).toHaveBeenCalled();
  });

  it('should trigger onFilterChange callback when a status filter button is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    renderToolbar({ selectedFilter: 'ALL', onFilterChange });

    const publishedBtn = screen.getByRole('button', { name: /^published$/i });
    await user.click(publishedBtn);
    expect(onFilterChange).toHaveBeenCalledWith('PUBLISHED');

    const draftBtn = screen.getByRole('button', { name: /^draft$/i });
    await user.click(draftBtn);
    expect(onFilterChange).toHaveBeenCalledWith('DRAFT');

    const hiddenBtn = screen.getByRole('button', { name: /^hidden$/i });
    await user.click(hiddenBtn);
    expect(onFilterChange).toHaveBeenCalledWith('HIDDEN');

    const allBtn = screen.getByRole('button', { name: /^all$/i });
    await user.click(allBtn);
    expect(onFilterChange).toHaveBeenCalledWith('ALL');
  });

  it('should apply active class to the currently selected filter', () => {
    renderToolbar({ selectedFilter: 'DRAFT' });

    const draftBtn = screen.getByRole('button', { name: /^draft$/i });
    expect(draftBtn).toHaveClass('bg-card');

    const publishedBtn = screen.getByRole('button', { name: /^published$/i });
    expect(publishedBtn).not.toHaveClass('bg-card');
  });

  it('should call onCreatePost when clicking "Create post" button', async () => {
    const user = userEvent.setup();
    const onCreatePost = vi.fn();
    renderToolbar({ onCreatePost });

    const createLink = screen.getByRole('link', { name: /create post/i });
    await user.click(createLink);

    expect(onCreatePost).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('heading', { name: /create page/i })
    ).toBeInTheDocument();
  });
});
