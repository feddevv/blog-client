import Pagination from '@/components/Pagination';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Pagination component', async () => {
  it('should render correct page numbers', () => {
    render(
      <Pagination currentPage={1} totalPages={7} handleChangePage={() => {}} />
    );

    expect(screen.getAllByRole('button', { name: /^[0-9]+$/ })).toHaveLength(7);
  });

  it("should properly handle prev and next buttons' state when current page is the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={7} handleChangePage={() => {}} />
    );

    expect(
      screen.getByRole('button', { name: /previous page/i })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeEnabled();
  });

  it("should properly handle prev and next buttons' state when current page is the last page", () => {
    render(
      <Pagination currentPage={7} totalPages={7} handleChangePage={() => {}} />
    );

    expect(
      screen.getByRole('button', { name: /previous page/i })
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('should properly render pagination when the current page is in the middle', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        handleChangePage={() => {}}
      />
    );

    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: /previous page/i })
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeEnabled();
  });

  it('should react to clicking buttons', async () => {
    const user = userEvent.setup();
    const mockedFn = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        handleChangePage={mockedFn}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next page/i });
    const previousButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    await user.click(previousButton);
    await user.click(nextButton);

    expect(mockedFn).toHaveBeenCalledTimes(2);
  });

  it("should not react to clicking the prev button when it's disabled", async () => {
    const user = userEvent.setup();
    const mockedFn = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={20} handleChangePage={mockedFn} />
    );

    const previousButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    await user.click(previousButton);

    expect(mockedFn).not.toHaveBeenCalled();
  });

  it("should not react to clicking the next button when it's disabled", async () => {
    const user = userEvent.setup();
    const mockedFn = vi.fn();
    render(
      <Pagination
        currentPage={20}
        totalPages={20}
        handleChangePage={mockedFn}
      />
    );

    const nextButton = screen.getByRole('button', {
      name: /next page/i,
    });
    await user.click(nextButton);

    expect(mockedFn).not.toHaveBeenCalled();
  });
});
