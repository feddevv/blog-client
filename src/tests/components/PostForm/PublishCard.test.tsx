import PublishCard from '@/components/PostForm/PublishCard';
import type { UpdatePostForm } from '@/types/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FieldErrors } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

describe('PublishCard component', () => {
  it('should render publish and save draft buttons with initial checklist state', () => {
    render(
      <PublishCard
        isPending={false}
        errors={{}}
        isSubmitted={false}
        handleSaveDraft={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: /publish actions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /publish/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save draft/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/awaiting form submission\.\.\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ready to save/i)).toBeInTheDocument();
  });

  it('should call handleSaveDraft when save draft button is clicked', async () => {
    const user = userEvent.setup();
    const handleSaveDraft = vi.fn();

    render(
      <PublishCard
        isPending={false}
        errors={{}}
        isSubmitted={false}
        handleSaveDraft={handleSaveDraft}
      />
    );

    const draftButton = screen.getByRole('button', { name: /save draft/i });
    await user.click(draftButton);

    expect(handleSaveDraft).toHaveBeenCalledTimes(1);
  });

  it('should render disabled state with spinners when isPending is true', async () => {
    const user = userEvent.setup();
    const handleSaveDraft = vi.fn();

    const { container } = render(
      <PublishCard
        isPending={true}
        errors={{}}
        isSubmitted={false}
        handleSaveDraft={handleSaveDraft}
      />
    );

    const submitButton = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const draftButton = container.querySelector(
      'button[type="button"]'
    ) as HTMLButtonElement;

    expect(submitButton).toBeDisabled();
    expect(draftButton).toBeDisabled();

    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBe(2);

    await user.click(draftButton);
    expect(handleSaveDraft).not.toHaveBeenCalled();
  });

  it('should render success checklist items when form is submitted without errors', () => {
    render(
      <PublishCard
        isPending={false}
        errors={{}}
        isSubmitted={true}
      />
    );

    expect(screen.getByText('Title provided')).toBeInTheDocument();
    expect(screen.getByText('Short excerpt written')).toBeInTheDocument();
    expect(screen.getByText('Cover image selected')).toBeInTheDocument();
    expect(screen.getByText('Article content filled')).toBeInTheDocument();
  });

  it('should render field error messages when form is submitted with validation errors', () => {
    const errors: FieldErrors<UpdatePostForm> = {
      title: { type: 'custom', message: 'Title must be at least 5 characters' },
      description: { type: 'custom', message: 'Description is required' },
      content: { type: 'custom', message: 'Content should be at least 1 character' },
      postImage: { type: 'custom', message: 'Image is required' },
    };

    render(
      <PublishCard
        isPending={false}
        errors={errors}
        isSubmitted={true}
      />
    );

    expect(
      screen.getByText('Title must be at least 5 characters')
    ).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(
      screen.getByText('Content should be at least 1 character')
    ).toBeInTheDocument();
    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });
});
