import Button from '@/components/Button';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';

describe('Button component', () => {
  it('should render button correctly', () => {
    render(<Button>Hello World!</Button>);

    expect(
      screen.getByRole('button', { name: /hello world/i })
    ).toBeInTheDocument();
  });

  it('should call passed onClick fn', async () => {
    const user = userEvent.setup();
    const fn = vi.fn();

    render(<Button onClick={fn}>Hello World!</Button>);
    const button = screen.getByRole('button', { name: /hello world/i });
    await user.click(button);

    expect(fn).toHaveBeenCalled();
  });

  it('should not react to a click when disabled', async () => {
    const user = userEvent.setup();
    const fn = vi.fn();

    render(<Button disabled>Hello World!</Button>);
    const button = screen.getByRole('button', { name: /hello world/i });
    await user.click(button);

    expect(fn).not.toHaveBeenCalled();
  });
});
