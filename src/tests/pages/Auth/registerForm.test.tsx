import { server } from '@/mocks/node';
import RegisterForm from '@/pages/Auth/RegisterForm';
import { createWrapper } from '@/tests/testUtils';
import { blogApi } from '@/utils/utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

describe('RegisterForm component', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/register',
      Component: RegisterForm,
    },
    {
      path: '/login',
      Component: () => <h1>Login Page</h1>,
    },
  ]);

  describe('Rendering', () => {
    it('should render all form elements, labels, buttons, and navigation links', () => {
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      expect(
        screen.getByRole('heading', { name: /create an account/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/join thousands of curious readers and practitioners/i)
      ).toBeInTheDocument();

      // Navigation links (switch link + bottom link both point to /login with "Sign In")
      const signInLinks = screen.getAllByRole('link', { name: /^sign in$/i });
      expect(signInLinks).toHaveLength(2);
      expect(
        screen.getByRole('link', { name: /^sign up$/i })
      ).toBeInTheDocument();

      // Social auth buttons
      expect(
        screen.getByRole('button', { name: /google/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /github/i })
      ).toBeInTheDocument();

      // Form inputs and submit button
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create account/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should display validation errors when submitted with empty fields', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when username is invalid', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      // Too short
      await user.type(usernameInput, 'ab');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();

      // Invalid characters
      await user.clear(usernameInput);
      await user.type(usernameInput, 'user name with spaces!');
      await user.click(submitButton);

      expect(
        screen.getByText(
          /username can only contain letters, numbers, underscores, and hyphens/i
        )
      ).toBeInTheDocument();

      // Exceeds 50 chars
      await user.clear(usernameInput);
      await user.type(usernameInput, 'u'.repeat(51));
      await user.click(submitButton);

      expect(
        screen.getByText(/username must not exceed 50 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when email format is invalid', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'validUser');
      await user.type(emailInput, 'invalid@domain');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('should display validation error when email exceeds 255 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      const longEmail = `${'a'.repeat(250)}@example.com`;
      await user.type(usernameInput, 'validUser');
      await user.type(emailInput, longEmail);
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByText(/email must not exceed 255 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when password is shorter than 8 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'validUser');
      await user.type(emailInput, 'valid@example.com');
      await user.type(passwordInput, '1234567');
      await user.click(submitButton);

      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when password exceeds 120 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'validUser');
      await user.type(emailInput, 'valid@example.com');
      await user.type(passwordInput, 'p'.repeat(121));
      await user.click(submitButton);

      expect(
        screen.getByText(/password must not exceed 120 characters/i)
      ).toBeInTheDocument();
    });
  });

  describe('Happy Path Submission', () => {
    it('should register successfully, and navigate to login page', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'newUser123');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'securePassword123');
      await user.click(submitButton);

      expect(
        await screen.findByRole('heading', { name: /login page/i })
      ).toBeInTheDocument();
    });
  });

  describe('API and Network Errors', () => {
    it('should display API error message when registration fails due to server error', async () => {
      server.use(
        http.post(blogApi('/api/auth/register'), () => {
          return HttpResponse.json(
            { message: 'Username or email already exists' },
            { status: 409 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'existingUser');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      const errorMessages = await screen.findAllByText(
        /username or email already exists/i
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should display generic error message when server responds with 500 status', async () => {
      server.use(
        http.post(blogApi('/api/auth/register'), () => {
          return HttpResponse.json(
            { message: 'Internal server error occurred' },
            { status: 500 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'someUser');
      await user.type(emailInput, 'some@example.com');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      const errorMessages = await screen.findAllByText(
        /internal server error occurred/i
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State and Navigation', () => {
    it('should disable submit button while registration request is pending', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      server.use(
        http.post(blogApi('/api/auth/register'), async () => {
          await delay(150);
          return new HttpResponse(null, { status: 201 });
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(usernameInput, 'newUser123');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'securePassword123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /login page/i })
        ).toBeInTheDocument();
      });
    });

    it('should navigate to /login when clicking sign in links', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/register']} />, {
        wrapper: createWrapper(),
      });

      const signInLinks = screen.getAllByRole('link', { name: /^sign in$/i });
      await user.click(signInLinks[0]);

      expect(
        screen.getByRole('heading', { name: /login page/i })
      ).toBeInTheDocument();
    });
  });
});
