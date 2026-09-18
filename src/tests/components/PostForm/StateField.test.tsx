import StateField from '@/components/PostForm/StateField';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

describe('StateField component', () => {
  const createMockRegister = (overrides?: Partial<UseFormRegisterReturn>): UseFormRegisterReturn => ({
    name: 'state',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    ...overrides,
  });

  it('should render state select dropdown with PUBLISHED as default', () => {
    const register = createMockRegister();
    render(<StateField register={register} />);

    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: /state/i });
    expect(select).toHaveValue('PUBLISHED');

    expect(
      screen.getByText(
        /immediately live and visible to all readers on the home feed/i
      )
    ).toBeInTheDocument();
  });

  it('should render with initialValue when provided', () => {
    const register = createMockRegister();
    render(<StateField register={register} initialValue="HIDDEN" />);

    const select = screen.getByRole('combobox', { name: /state/i });
    expect(select).toHaveValue('HIDDEN');

    expect(
      screen.getByText(
        /unlisted from the public feed\. accessible only through direct link/i
      )
    ).toBeInTheDocument();
  });

  it('should update visual state and call register.onChange when user selects another option', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    render(<StateField register={register} initialValue="PUBLISHED" />);

    const select = screen.getByRole('combobox', { name: /state/i });
    await user.selectOptions(select, 'HIDDEN');

    expect(select).toHaveValue('HIDDEN');
    expect(register.onChange).toHaveBeenCalled();
  });
});
