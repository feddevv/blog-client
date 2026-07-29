import Header from '@/layout/Header';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub, Outlet } from 'react-router';
import { describe, expect, it } from 'vitest';

describe('Header component', () => {
  const RouterStub = createRoutesStub([
    {
      path: '/',
      Component: () => {
        return (
          <>
            <Header />
            <main>
              <Outlet />
            </main>
          </>
        );
      },
      children: [
        {
          index: true,
          Component: () => <h2>Home page</h2>,
        },
        {
          path: '/about',
          Component: () => <h2>About page</h2>,
        },
      ],
    },
  ]);

  it('should redirect to another page when click the link', async () => {
    const user = userEvent.setup();

    render(<RouterStub initialEntries={['/']} />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    expect(
      screen.getByRole('heading', { name: /about page/i })
    ).toBeInTheDocument();
  });

  it('should open mobile menu when click on hamburger button', async () => {
    const user = userEvent.setup();

    render(<RouterStub />);
    const hamburger = screen.getByRole('button', { name: 'Menu' });

    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });
});
