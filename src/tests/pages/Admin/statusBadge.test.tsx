import StatusBadge from '@/pages/Admin/StatusBadge';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('StatusBadge component', () => {
  it('should render Published status badge correctly', () => {
    const { container } = render(<StatusBadge status="PUBLISHED" />);

    expect(screen.getByText(/published/i)).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render Hidden status badge correctly', () => {
    render(<StatusBadge status="HIDDEN" />);

    expect(screen.getByText(/hidden/i)).toBeInTheDocument();
  });

  it('should render Draft status badge correctly', () => {
    render(<StatusBadge status="DRAFT" />);

    expect(screen.getByText(/draft/i)).toBeInTheDocument();
  });

  it('should normalize lowercase or mixed case status strings', () => {
    render(<StatusBadge status="Published" />);

    expect(screen.getByText(/published/i)).toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <StatusBadge status="PUBLISHED" className="custom-badge-class" />
    );

    expect(container.firstChild).toHaveClass('custom-badge-class');
  });
});
