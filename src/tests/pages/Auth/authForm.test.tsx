import { server } from '@/mocks/node';
import AuthForm from '@/pages/Auth/AuthForm';
import { createWrapper } from '@/tests/testUtils';
import { blogApi } from '@/utils/utils';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';

describe('AuthForm component', () => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <AuthForm open />,
    },
  ]);

  describe('UI & Switching', () => {
    it('renders the sign-in state', () => {
      render(<Stub />, { wrapper: createWrapper() });

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

      expect(ui.queryByLabelText(/email/i)).not.toBeInTheDocument();
      expect(ui.getByLabelText(/username/i)).toBeInTheDocument();
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

      render(<Stub />, { wrapper: createWrapper() });

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

      render(<Stub />, { wrapper: createWrapper() });

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

      expect(ui.queryByLabelText(/email/i)).not.toBeInTheDocument();
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

      render(<Stub />, { wrapper: createWrapper() });
      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.click(username);
      expect(screen.getByLabelText(/username/i)).toHaveFocus();

      await user.click(password);
      expect(screen.getByLabelText(/password/i)).toHaveFocus();

      await user.click(screen.getByRole('button', { name: 'Sign Up' }));
      const email = screen.getByText(/email/i);
      await user.click(email);
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
    });

    it('should type into inputs', async () => {
      const user = userEvent.setup();

      render(<Stub />, { wrapper: createWrapper() });
      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'your_username');
      expect(screen.getByLabelText(/username/i)).toHaveValue('your_username');

      await user.type(password, 'secret_password');
      expect(screen.getByLabelText(/password/i)).toHaveValue('secret_password');

      await user.click(screen.getByRole('button', { name: 'Sign Up' }));
      const email = screen.getByText(/email/i);
      await user.type(email, 'you@example');
      expect(screen.getByLabelText(/email/i)).toHaveValue('you@example');
    });
  });

  describe('Register flow', () => {
    it('should register a user', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      await user.click(switchUi.getByRole('button', { name: /^sign up$/i }));

      const username = screen.getByText(/username/i);
      const email = screen.getByText(/email/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'new_user');
      await user.type(email, 'new_email@gmail.com');
      await user.type(password, 'new_password');

      const registerButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(registerButton);

      expect(email).not.toBeInTheDocument();
    });

    it('should show an error when email is in invalid format', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      await user.click(switchUi.getByRole('button', { name: /^sign up$/i }));

      const registerButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(registerButton);

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should show errors when username or email is already taken', async () => {
      server.use(
        http.post(blogApi('/api/auth/register'), () =>
          HttpResponse.json(
            { message: 'Username or email is already taken' },
            { status: 409 }
          )
        )
      );
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const dialog = screen.getByRole('dialog');
      const ui = within(dialog);
      const switchUi = within(ui.getByTestId('switch-container'));

      await user.click(switchUi.getByRole('button', { name: /^sign up$/i }));

      const username = screen.getByText(/username/i);
      const email = screen.getByText(/email/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'taken_user');
      await user.type(email, 'taken_email@gmail.com');
      await user.type(password, 'new_password');

      const registerButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(registerButton);

      expect(
        screen.getAllByText('Username or email is already taken')[0]
      ).toBeInTheDocument();
    });
  });

  describe('Login flow', () => {
    it('should log a user in', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'alex_dev');
      await user.type(password, 'alex_dev_password');

      const form = screen.getByRole('form');
      await user.click(within(form).getByRole('button', { name: /sign in/i }));

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it('should show errors when username or password is incorrect', async () => {
      server.use(
        http.post(blogApi('/api/auth/login'), () =>
          HttpResponse.json(
            { message: 'Username or password is incorrect' },
            { status: 401 }
          )
        )
      );
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'alex_dev_incorrect');
      await user.type(password, 'alex_dev_password_incorrect');

      const form = screen.getByRole('form');
      await user.click(within(form).getByRole('button', { name: /sign in/i }));

      expect(
        screen.getAllByText('Username or password is incorrect')[0]
      ).toBeInTheDocument();
    });

    it('should show errors when username or password is too short', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.type(username, 'a');
      await user.type(password, 'a');

      const form = screen.getByRole('form');
      await user.click(within(form).getByRole('button', { name: /sign in/i }));

      expect(
        screen.getByText('Username must be at least 3 characters')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Password must be at least 8 characters')
      ).toBeInTheDocument();
    });

    it('should show errors when username or password is too long', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const username = screen.getByText(/username/i);
      const password = screen.getByText(/password/i);

      await user.type(
        username,
        '123456789012345678901234567890123456789012345678901'
      );
      await user.type(
        password,
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'
      );

      const form = screen.getByRole('form');
      await user.click(within(form).getByRole('button', { name: /sign in/i }));

      expect(
        screen.getByText('Username must not exceed 50 characters')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Password must not exceed 120 characters')
      ).toBeInTheDocument();
    });

    it('should show an error when username consists of special characters', async () => {
      const user = userEvent.setup();
      render(<Stub />, { wrapper: createWrapper() });

      const username = screen.getByText(/username/i);

      await user.type(username, 'alex_dev*$');

      const form = screen.getByRole('form');
      await user.click(within(form).getByRole('button', { name: /sign in/i }));

      expect(
        screen.getByText(
          'Username can only contain letters, numbers, underscores, and hyphens'
        )
      ).toBeInTheDocument();
    });
  });
});
