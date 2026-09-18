import DescriptionField from '@/components/PostForm/DescriptionField';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

describe('DescriptionField component', () => {
  const createMockRegister = (overrides?: Partial<UseFormRegisterReturn>): UseFormRegisterReturn => ({
    name: 'description',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    ...overrides,
  });

  it('should render label, textarea with placeholder, and helper texts', () => {
    const register = createMockRegister();
    render(<DescriptionField register={register} />);

    expect(
      screen.getByLabelText(/description \/ excerpt/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /Provide a compelling summary that will entice readers to read the full article\.\.\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Recommended: 120-160 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This excerpt appears in post cards, search result listings, and social media previews\./i
      )
    ).toBeInTheDocument();
  });

  it('should trigger register.onChange when user types', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    render(<DescriptionField register={register} />);

    const textarea = screen.getByLabelText(/description \/ excerpt/i);
    await user.type(textarea, 'Summary of the article.');

    expect(register.onChange).toHaveBeenCalled();
  });
});
