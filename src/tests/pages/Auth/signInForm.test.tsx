import { server } from '@/mocks/node';
import SignInForm from '@/pages/Auth/SignInForm';
import { createWrapper } from '@/tests/testUtils';
import { blogApi } from '@/utils/utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';

describe('SignInForm component', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/login',
      Component: SignInForm,
    },
    {
      path: '/',
      Component: () => <h1>Home Page</h1>,
    },
    {
      path: '/register',
      Component: () => <h1>Register Page</h1>,
    },
  ]);

  describe('Rendering', () => {
    it('should render all form elements, labels, buttons, and navigation links', () => {
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      expect(
        screen.getByRole('heading', { name: /welcome back/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/sign in to continue reading and save articles/i)
      ).toBeInTheDocument();

      // Navigation switch links
      expect(
        screen.getByRole('link', { name: /^sign in$/i })
      ).toBeInTheDocument();
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
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^sign in$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /forgot\?/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /sign up for free/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should display validation errors when submitted with empty fields', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const submitButton = screen.getByRole('button', { name: /^sign in$/i });
      await user.click(submitButton);

      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when username is shorter than 3 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'ab');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/password must be at least 8 characters/i)
      ).not.toBeInTheDocument();
    });

    it('should display validation error when username exceeds 50 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'a'.repeat(51));
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByText(/username must not exceed 50 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when username contains invalid characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'user@name!');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByText(
          /username can only contain letters, numbers, underscores, and hyphens/i
        )
      ).toBeInTheDocument();
    });

    it('should display validation error when password is shorter than 8 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'validUser');
      await user.type(passwordInput, 'short');
      await user.click(submitButton);

      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it('should display validation error when password exceeds 120 characters', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'validUser');
      await user.type(passwordInput, 'a'.repeat(121));
      await user.click(submitButton);

      expect(
        screen.getByText(/password must not exceed 120 characters/i)
      ).toBeInTheDocument();
    });
  });

  describe('Happy Path Submission', () => {
    it('should successfully log in with valid credentials, and navigate to home page', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'validUser');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(
        screen.getByRole('heading', { name: /home page/i })
      ).toBeInTheDocument();
    });
  });

  describe('API and Network Errors', () => {
    it('should display API error message when credentials are invalid', async () => {
      server.use(
        http.post(blogApi('/api/auth/login'), () => {
          return HttpResponse.json(
            { message: 'Invalid username or password' },
            { status: 401 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'wrongUser');
      await user.type(passwordInput, 'wrongPassword');
      await user.click(submitButton);

      const errorMessages = await screen.findAllByText(
        /invalid username or password/i
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should display error message when server returns a 500 error', async () => {
      server.use(
        http.post(blogApi('/api/auth/login'), () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'someUser');
      await user.type(passwordInput, 'somePassword');
      await user.click(submitButton);

      const errorMessages = await screen.findAllByText(
        /internal server error/i
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State and Navigation', () => {
    it('should disable the submit button while the login request is pending', async () => {
      server.use(
        http.post(blogApi('/api/auth/login'), async () => {
          await delay(150);
          return HttpResponse.json({ token: 'jwt_mocked_token' });
        })
      );

      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(usernameInput, 'validUser');
      await user.type(passwordInput, 'validPassword123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /home page/i })
        ).toBeInTheDocument();
      });
    });

    it('should navigate to /register when clicking the switch link or sign up link', async () => {
      const user = userEvent.setup();
      render(<RouterStub initialEntries={['/login']} />, {
        wrapper: createWrapper(),
      });

      const signUpLink = screen.getByRole('link', {
        name: /sign up for free/i,
      });
      await user.click(signUpLink);

      expect(
        screen.getByRole('heading', { name: /register page/i })
      ).toBeInTheDocument();
    });
  });
});
