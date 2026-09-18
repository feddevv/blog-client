import ImageUploadField from '@/components/PostForm/ImageUploadField';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import type { UpdatePostForm } from '@/types/zod';
import { describe, expect, it, vi } from 'vitest';

describe('ImageUploadField component', () => {
  const createMockRegister = (
    overrides?: Partial<UseFormRegisterReturn>
  ): UseFormRegisterReturn => ({
    name: 'postImage',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    ...overrides,
  });

  const createMockSetValue = (): UseFormSetValue<UpdatePostForm> => vi.fn();

  it('should render empty dropzone with upload prompt and browse button', () => {
    const register = createMockRegister();
    const setValue = createMockSetValue();

    const { container } = render(
      <ImageUploadField register={register} setValue={setValue} />
    );

    expect(screen.getByText(/^cover image/i)).toBeInTheDocument();
    expect(
      screen.getByText(/drag & drop your cover image here/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /browse file/i })
    ).toBeInTheDocument();
    expect(container.querySelector('#post-image-file')).toBeInTheDocument();
  });

  it('should render initialValue with selected status and filename', () => {
    const register = createMockRegister();
    const setValue = createMockSetValue();

    render(
      <ImageUploadField
        register={register}
        setValue={setValue}
        initialValue="existing-header.png"
      />
    );

    expect(screen.getByText('existing-header.png')).toBeInTheDocument();
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /replace file/i })
    ).toBeInTheDocument();
  });

  it('should handle file input change and call register.onChange', async () => {
    const user = userEvent.setup();
    const register = createMockRegister();
    const setValue = createMockSetValue();

    const { container } = render(
      <ImageUploadField register={register} setValue={setValue} />
    );

    const fileInput = container.querySelector(
      '#post-image-file'
    ) as HTMLInputElement;
    const file = new File(['image_bits'], 'uploaded-graphic.jpg', {
      type: 'image/jpeg',
    });

    await user.upload(fileInput, file);

    expect(register.onChange).toHaveBeenCalled();
    expect(screen.getByText('uploaded-graphic.jpg')).toBeInTheDocument();
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
  });

  it('should handle drag enter, drag over, drag leave, and drop events', () => {
    const register = createMockRegister();
    const setValue = createMockSetValue();

    const { container, unmount } = render(
      <ImageUploadField register={register} setValue={setValue} />
    );

    const dropZone = container.querySelector(
      'label[for="post-image-file"]'
    ) as HTMLLabelElement;

    // Drag Enter
    fireEvent.dragEnter(dropZone);
    expect(screen.getByText(/drop image here/i)).toBeInTheDocument();

    // Drag Over with image
    const dataTransfer = {
      items: [{ kind: 'file', type: 'image/png' }],
      files: [new File(['dropped'], 'drag-dropped.png', { type: 'image/png' })],
      dropEffect: '',
    };
    fireEvent.dragOver(dropZone, { dataTransfer });
    expect(dataTransfer.dropEffect).toBe('copy');

    // Drag Over with non-image file
    const nonImageDataTransfer = {
      items: [{ kind: 'file', type: 'application/pdf' }],
      files: [new File(['pdf'], 'doc.pdf', { type: 'application/pdf' })],
      dropEffect: '',
    };
    fireEvent.dragOver(dropZone, { dataTransfer: nonImageDataTransfer });
    expect(nonImageDataTransfer.dropEffect).toBe('none');

    // Drag Leave
    fireEvent.dragLeave(dropZone);
    expect(
      screen.getByText(/drag & drop your cover image here/i)
    ).toBeInTheDocument();

    // Drop
    fireEvent.drop(dropZone, { dataTransfer });

    expect(setValue).toHaveBeenCalledWith('postImage', dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    expect(screen.getByText('drag-dropped.png')).toBeInTheDocument();

    unmount();
  });
});
