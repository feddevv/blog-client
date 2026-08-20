import Input from '@/components/Input';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Input component', () => {
  it('should render basic input with the type of text', () => {
    render(<Input type="text" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should react to onChange handler when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const email = 'example@gmail.com';

    render(<Input onChange={onChange} type="email" />);
    const emailInput = screen.getByRole('textbox');
    await user.type(emailInput, email);

    expect(onChange).toHaveBeenCalledTimes(email.length);
  });

  it('should not react to typing when input is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const email = 'example@gmail.com';

    render(<Input onChange={onChange} type="email" disabled />);
    const emailInput = screen.getByRole('textbox');
    await user.type(emailInput, email);

    expect(onChange).not.toHaveBeenCalled();
  });
});
