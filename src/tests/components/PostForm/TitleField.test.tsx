import TitleField from '@/components/PostForm/TitleField';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

describe('TitleField component', () => {
  const createMockRegister = (overrides?: Partial<UseFormRegisterReturn>): UseFormRegisterReturn => ({
    name: 'title',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    ...overrides,
  });

  it('should render label, input with placeholder, and helper text', () => {
    const register = createMockRegister();
    render(<TitleField register={register} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /e.g., The Architecture of High-Scale Web Applications/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Recommended: 40-70 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A clear, engaging headline that captures the essence of your story\./i)
    ).toBeInTheDocument();
  });

  it('should trigger register.onChange when user types', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    render(<TitleField register={register} />);

    const input = screen.getByLabelText(/title/i);
    await user.type(input, 'New Article');

    expect(register.onChange).toHaveBeenCalled();
  });
});
