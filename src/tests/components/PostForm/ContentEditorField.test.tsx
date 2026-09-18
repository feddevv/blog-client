import ContentEditorField from '@/components/PostForm/ContentEditorField';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

describe('ContentEditorField component', () => {
  const createMockRegister = (overrides?: Partial<UseFormRegisterReturn>): UseFormRegisterReturn => ({
    name: 'content',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    ...overrides,
  });

  it('should render article content label, toolbar buttons, and write mode by default', () => {
    const register = createMockRegister();
    render(<ContentEditorField register={register} />);

    expect(screen.getByLabelText(/article content/i)).toBeInTheDocument();
    expect(
      screen.getByRole('toolbar', { name: /markdown formatting toolbar/i })
    ).toBeInTheDocument();

    // Check all toolbar buttons
    const expectedButtons = [
      'Bold',
      'Italic',
      'Heading',
      'Quote',
      'Code',
      'Bullet List',
      'Numbered List',
      'Link',
      'Image',
    ];
    for (const btnName of expectedButtons) {
      expect(
        screen.getByRole('button', { name: btnName })
      ).toBeInTheDocument();
    }

    expect(screen.getByRole('tab', { name: /write/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: /preview/i })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('should call register.onChange and update statistics when user types', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    render(<ContentEditorField register={register} />);

    const textarea = screen.getByLabelText(/article content/i);
    await user.type(textarea, 'Line one words{enter}Line two words');

    expect(register.onChange).toHaveBeenCalled();
    expect(screen.getByText(/6 words/i)).toBeInTheDocument();
    expect(screen.getByText(/2 lines/i)).toBeInTheDocument();
    expect(screen.getByText(/~1 min read/i)).toBeInTheDocument();
  });

  it('should switch between Write and Preview tabs and render Markdown content', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    render(<ContentEditorField register={register} />);

    const textarea = screen.getByLabelText(/article content/i);
    await user.type(
      textarea,
      '## Subheading Title\n\n- Regular task item\n- Completed item'
    );

    const previewTab = screen.getByRole('tab', { name: /preview/i });
    await user.click(previewTab);

    expect(previewTab).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.queryByLabelText(/article content/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /subheading title/i })
    ).toBeInTheDocument();

    const writeTab = screen.getByRole('tab', { name: /write/i });
    await user.click(writeTab);

    expect(screen.getByLabelText(/article content/i)).toBeInTheDocument();
  });
});
