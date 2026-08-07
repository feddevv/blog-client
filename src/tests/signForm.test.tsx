import AuthForm from '@/pages/Auth/AuthForm';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('SignForm component', () => {
  describe('UI & Switching', () => {
    it('renders the sign-in state', () => {
      render(<AuthForm open />);

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      expect(
        ui.getByRole('heading', { name: /welcome back/i })
      ).toBeInTheDocument();
      expect(
        ui.getByText(/sign in to continue reading and save articles/i)
      ).toBeInTheDocument();

      expect(ui.getByRole('button', { name: /close/i }));

      expect(
        switchUi.getByRole('button', { name: /^sign up$/i })
      ).toBeInTheDocument();
      expect(ui.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(ui.getByRole('button', { name: /github/i })).toBeInTheDocument();

      expect(ui.queryByLabelText(/username/i)).not.toBeInTheDocument();
      expect(ui.getByLabelText(/email/i)).toBeInTheDocument();
      expect(ui.getByLabelText(/password/i)).toBeInTheDocument();
      expect(ui.getByRole('link', { name: /forgot\?/i })).toBeInTheDocument();

      const form = ui.getByRole('form', { name: /sign form/i });
      expect(
        within(form).getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();

      expect(
        ui.getByRole('button', { name: /sign up for free/i })
      ).toBeInTheDocument();
    });

    it('switches to the sign-up state', async () => {
      const user = userEvent.setup();

      render(<AuthForm open />);

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      await user.click(switchUi.getByRole('button', { name: /^sign up$/i }));

      expect(
        ui.getByRole('heading', { name: /create an account/i })
      ).toBeInTheDocument();
      expect(
        ui.queryByRole('heading', { name: /welcome back/i })
      ).not.toBeInTheDocument();

      expect(
        ui.getByText(/join thousands of curious readers and practitioners/i)
      ).toBeInTheDocument();
      expect(
        ui.queryByText(/sign in to continue reading and save articles/i)
      ).not.toBeInTheDocument();

      expect(ui.getByLabelText(/username/i)).toBeInTheDocument();
      expect(
        ui.queryByRole('link', { name: /forgot\?/i })
      ).not.toBeInTheDocument();

      expect(
        ui.getByRole('button', { name: /create account/i })
      ).toBeInTheDocument();
    });

    it('should switch back to sing in form correctly', async () => {
      const user = userEvent.setup();

      render(<AuthForm open />);

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      await user.click(switchUi.getByRole('button', { name: /^sign up$/i }));
      await user.click(switchUi.getByRole('button', { name: /^sign in$/i }));

      expect(
        ui.queryByRole('heading', { name: /create an account/i })
      ).not.toBeInTheDocument();
      expect(
        ui.getByRole('heading', { name: /welcome back/i })
      ).toBeInTheDocument();

      expect(
        ui.queryByText(/join thousands of curious readers and practitioners/i)
      ).not.toBeInTheDocument();
      expect(
        ui.getByText(/sign in to continue reading and save articles/i)
      ).toBeInTheDocument();

      expect(ui.queryByLabelText(/username/i)).not.toBeInTheDocument();
      expect(ui.getByRole('link', { name: /forgot\?/i })).toBeInTheDocument();

      expect(
        ui.queryByRole('button', { name: /create account/i })
      ).not.toBeInTheDocument();

      const form = ui.getByRole('form', { name: /sign form/i });
      expect(
        within(form).getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
    });
  });

  describe('Inputs and labels', () => {
    it('should focus on inputs when labels are clicked', async () => {
      const user = userEvent.setup();

      render(<AuthForm open />);
      const email = screen.getByText(/email/i);
      const password = screen.getByText(/password/i);

      await user.click(email);
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.click(password);
      expect(screen.getByLabelText(/password/i)).toHaveFocus();

      await user.click(screen.getByRole('button', { name: 'Sign Up' }));
      const username = screen.getByText(/username/i);
      await user.click(username);
      expect(screen.getByLabelText(/username/i)).toHaveFocus();
    });

    it('should type into inputs', async () => {
      const user = userEvent.setup();

      render(<AuthForm open />);
      const email = screen.getByText(/email/i);
      const password = screen.getByText(/password/i);

      await user.type(email, 'you@example.com');
      expect(screen.getByLabelText(/email/i)).toHaveValue('you@example.com');

      await user.type(password, 'secret_password');
      expect(screen.getByLabelText(/password/i)).toHaveValue('secret_password');

      await user.click(screen.getByRole('button', { name: 'Sign Up' }));
      const username = screen.getByText(/username/i);
      await user.type(username, 'johndoe');
      expect(screen.getByLabelText(/username/i)).toHaveValue('johndoe');
    });
  });
});
