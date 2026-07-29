import Label, { LabelWrapper } from '@/components/Label';
import Input from '@/components/Input';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Label component', () => {
  it('should render basic label', () => {
    render(<Label>Hello world</Label>);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});

describe('LabelWrapper component', () => {
  it('should render label wrapper with input inside of it with the relation', () => {
    render(
      <LabelWrapper>
        Search
        <Input intent={'unstyled'} type="search" />
      </LabelWrapper>
    );

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('should focus the input when label is clicked', async () => {
    const user = userEvent.setup();

    render(
      <LabelWrapper>
        Search
        <Input intent={'unstyled'} type="search" />
      </LabelWrapper>
    );
    const label = screen.getByText(/search/i);
    await user.click(label);

    expect(screen.getByLabelText(/search/i)).toHaveFocus();
  });
});
