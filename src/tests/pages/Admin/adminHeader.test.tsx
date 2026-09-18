import AdminHeader from '@/pages/Admin/AdminHeader';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AdminHeader component', () => {
  it('should render dashboard title, subheadings, and default metrics when props are omitted', () => {
    const { container } = render(<AdminHeader />);

    expect(
      screen.getByRole('heading', { name: /admin dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/administration · content control/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /create, edit, manage publication status, and organize articles/i
      )
    ).toBeInTheDocument();

    const header = container.querySelector('header')!;
    const totalCard =
      within(header).getByText('Total Posts').parentElement?.parentElement;
    const publishedCard =
      within(header).getByText('Published').parentElement?.parentElement;
    const draftsCard =
      within(header).getByText('Drafts').parentElement?.parentElement;
    const hiddenCard =
      within(header).getByText('Hidden').parentElement?.parentElement;

    expect(within(totalCard!).getByText('24')).toBeInTheDocument();
    expect(within(publishedCard!).getByText('16')).toBeInTheDocument();
    expect(within(draftsCard!).getByText('5')).toBeInTheDocument();
    expect(within(hiddenCard!).getByText('3')).toBeInTheDocument();
  });

  it('should render custom metric counts when passed via props', () => {
    const { container } = render(
      <AdminHeader
        totalCount={42}
        publishedCount={30}
        draftCount={8}
        hiddenCount={4}
      />
    );

    const header = container.querySelector('header')!;
    const totalCard =
      within(header).getByText('Total Posts').parentElement?.parentElement;
    const publishedCard =
      within(header).getByText('Published').parentElement?.parentElement;
    const draftsCard =
      within(header).getByText('Drafts').parentElement?.parentElement;
    const hiddenCard =
      within(header).getByText('Hidden').parentElement?.parentElement;

    expect(within(totalCard!).getByText('42')).toBeInTheDocument();
    expect(within(publishedCard!).getByText('30')).toBeInTheDocument();
    expect(within(draftsCard!).getByText('8')).toBeInTheDocument();
    expect(within(hiddenCard!).getByText('4')).toBeInTheDocument();
  });
});
