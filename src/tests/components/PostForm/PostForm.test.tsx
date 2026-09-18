import PostForm from '@/components/PostForm/PostForm';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('PostForm component', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isPending: false,
  };

  describe('Rendering', () => {
    it('should render all form fields, labels, helper texts, and buttons in create mode', () => {
      const { container } = render(<PostForm {...defaultProps} />);

      // Title field
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          /e.g., The Architecture of High-Scale Web Applications/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Recommended: 40-70 characters/i)
      ).toBeInTheDocument();

      // Description field
      expect(
        screen.getByLabelText(/description \/ excerpt/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          /Provide a compelling summary that will entice readers/i
        )
      ).toBeInTheDocument();

      // Content editor field
      expect(screen.getByLabelText(/article content/i)).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /write/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
      expect(
        screen.getByRole('toolbar', { name: /markdown formatting toolbar/i })
      ).toBeInTheDocument();

      // State field
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /state/i })).toHaveValue(
        'PUBLISHED'
      );

      // Cover image field
      expect(screen.getByText(/^cover image/i)).toBeInTheDocument();
      expect(
        screen.getByText(/drag & drop your cover image here/i)
      ).toBeInTheDocument();
      expect(container.querySelector('#post-image-file')).toBeInTheDocument();

      // Publish actions
      expect(
        screen.getByRole('heading', { name: /publish actions/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^publish$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^save draft$/i })
      ).toBeInTheDocument();

      // Initial submission status
      expect(
        screen.getByText(/awaiting form submission\.\.\./i)
      ).toBeInTheDocument();
    });

    it('should pre-populate form with initialValues when provided in edit mode', () => {
      const initialValues = {
        title: 'Mastering Advanced React Patterns',
        description: 'A deep dive into compound components and hooks.',
        content: '# Introduction to Patterns\n\nHere is the content.',
        state: 'HIDDEN' as const,
        postImage: 'https://example.com/uploads/react-cover.png',
      };

      render(
        <PostForm
          {...defaultProps}
          isEdit={true}
          initialValues={initialValues}
        />
      );

      expect(screen.getByLabelText(/title/i)).toHaveValue(
        'Mastering Advanced React Patterns'
      );
      expect(screen.getByLabelText(/description \/ excerpt/i)).toHaveValue(
        'A deep dive into compound components and hooks.'
      );
      expect(screen.getByLabelText(/article content/i)).toHaveValue(
        '# Introduction to Patterns\n\nHere is the content.'
      );
      expect(screen.getByRole('combobox', { name: /state/i })).toHaveValue(
        'HIDDEN'
      );
      expect(
        screen.getByText('https://example.com/uploads/react-cover.png')
      ).toBeInTheDocument();
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /replace file/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation - Create Mode (createPostSchema)', () => {
    it('should show validation errors when submitted with empty fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<PostForm {...defaultProps} onSubmit={onSubmit} />);

      const publishButton = screen.getByRole('button', { name: /^publish$/i });
      await user.click(publishButton);

      expect(
        await screen.findByText(/title must be at least 5 characters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/content should be at least 1 character/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/image is required/i)).toBeInTheDocument();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should validate title constraints (min 5 and max 255 chars)', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/title/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      // Title too short (< 5 chars)
      await user.type(titleInput, 'Abc');
      await user.click(publishButton);

      expect(
        await screen.findByText(/title must be at least 5 characters/i)
      ).toBeInTheDocument();

      // Title exceeding 255 chars
      await user.clear(titleInput);
      await user.type(titleInput, 'a'.repeat(256));
      await user.click(publishButton);

      expect(
        await screen.findByText(/title must not exceed 255 characters/i)
      ).toBeInTheDocument();
    });

    it('should validate description constraints (max 300 chars)', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/description \/ excerpt/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      // Description exceeding 300 chars
      await user.type(descriptionInput, 'd'.repeat(301));
      await user.click(publishButton);

      expect(
        await screen.findByText(/description should not exceed 300 characters/i)
      ).toBeInTheDocument();
    });

    it('should validate image file size exceeding 5MB', async () => {
      const user = userEvent.setup();
      const { container } = render(<PostForm {...defaultProps} />);

      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      // Create a file larger than 5MB (5 * 1024 * 1024 + 1 bytes)
      const largeFile = new File(
        [new Uint8Array(5 * 1024 * 1024 + 10)],
        'large-image.png',
        { type: 'image/png' }
      );

      await user.upload(fileInput, largeFile);
      await user.click(publishButton);

      expect(
        await screen.findByText(/image must not exceed 5MB/i)
      ).toBeInTheDocument();
    });

    it('should validate image file type not accepted by schema', async () => {
      const user = userEvent.setup();
      const { container } = render(<PostForm {...defaultProps} />);

      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const invalidFile = new File(['dummy content'], 'document.gif', {
        type: 'image/gif',
      });

      await user.upload(fileInput, invalidFile);
      await user.click(publishButton);

      expect(
        await screen.findByText(/only jpeg, png and webp allowed/i)
      ).toBeInTheDocument();
    });

    it('should validate empty or whitespace content', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.type(titleInput, 'Valid Post Title');
      await user.type(descInput, 'Valid Post Description');
      await user.type(contentInput, '   ');
      await user.click(publishButton);

      expect(
        await screen.findByText(/content should be at least 1 character/i)
      ).toBeInTheDocument();
    });

    it('should display checklist error items with error messages after submission fails', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const publishButton = screen.getByRole('button', { name: /^publish$/i });
      await user.click(publishButton);

      // Checklist switches from "Awaiting form submission..." to error list
      expect(
        screen.queryByText(/awaiting form submission\.\.\./i)
      ).not.toBeInTheDocument();

      expect(
        await screen.findByText(/title must be at least 5 characters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/content should be at least 1 character/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/image is required/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation & Submission - Edit Mode (updatePostSchema)', () => {
    it('should allow submitting without a new image in edit mode', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <PostForm
          {...defaultProps}
          isEdit={true}
          onSubmit={onSubmit}
          initialValues={{
            title: 'Existing Post Title',
            description: 'Existing Post Description',
            content: 'Existing Post Content',
            state: 'PUBLISHED',
          }}
        />
      );

      const publishButton = screen.getByRole('button', { name: /^publish$/i });
      await user.click(publishButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Existing Post Title',
          description: 'Existing Post Description',
          content: 'Existing Post Content',
          state: 'PUBLISHED',
        })
      );
    });

    it('should validate image size and format when a new file is uploaded in edit mode', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const { container } = render(
        <PostForm
          {...defaultProps}
          isEdit={true}
          onSubmit={onSubmit}
          initialValues={{
            title: 'Valid Post Title',
            description: 'Valid Post Description',
            content: 'Valid Post Content',
            state: 'PUBLISHED',
          }}
        />
      );

      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const largeFile = new File(
        [new Uint8Array(6 * 1024 * 1024)],
        'too-large.png',
        { type: 'image/png' }
      );
      await user.upload(fileInput, largeFile);
      await user.click(publishButton);

      expect(
        await screen.findByText(/image must not exceed 5MB/i)
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Happy Path Submission (Create Mode)', () => {
    it('should successfully submit valid data with an uploaded image', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const { container } = render(
        <PostForm {...defaultProps} onSubmit={onSubmit} />
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      const imageFile = new File(['valid image data'], 'cover.webp', {
        type: 'image/webp',
      });

      await user.type(titleInput, 'A Guide to Clean Architecture');
      await user.type(
        descInput,
        'Learn how to build scalable and maintainable applications.'
      );
      await user.type(
        contentInput,
        '# Clean Architecture\n\nHere are the core principles.'
      );
      await user.selectOptions(stateSelect, 'HIDDEN');
      await user.upload(fileInput, imageFile);

      await user.click(publishButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.title).toBe('A Guide to Clean Architecture');
      expect(submittedData.description).toBe(
        'Learn how to build scalable and maintainable applications.'
      );
      expect(submittedData.content).toBe(
        '# Clean Architecture\n\nHere are the core principles.'
      );
      expect(submittedData.state).toBe('HIDDEN');
      expect(submittedData.postImage[0]).toBe(imageFile);

      // Checklist shows success state
      expect(screen.getByText(/title provided/i)).toBeInTheDocument();
      expect(screen.getByText(/short excerpt written/i)).toBeInTheDocument();
      expect(screen.getByText(/cover image selected/i)).toBeInTheDocument();
      expect(screen.getByText(/article content filled/i)).toBeInTheDocument();
    });
  });

  describe('Save Draft Functionality', () => {
    it('should call onSubmit with current values and isDraft=true when "Save draft" is clicked', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<PostForm {...defaultProps} onSubmit={onSubmit} />);

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const draftButton = screen.getByRole('button', {
        name: /^save draft$/i,
      });

      await user.type(titleInput, 'Draft Post Title');
      await user.type(descInput, 'Incomplete excerpt...');

      await user.click(draftButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Draft Post Title',
          description: 'Incomplete excerpt...',
        }),
        true
      );
    });
  });

  describe('Loading / Pending State', () => {
    it('should disable submit and save draft buttons and render spinners when isPending is true', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<PostForm onSubmit={onSubmit} isPending={true} />);

      const publishHeading = screen.getByRole('heading', {
        name: /publish actions/i,
      });
      const publishCard = publishHeading.closest('div')?.parentElement;
      const submitButton = publishCard?.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      const draftButton = publishCard?.querySelector(
        'button[type="button"]'
      ) as HTMLButtonElement;

      expect(submitButton).toBeInTheDocument();
      expect(draftButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(draftButton).toBeDisabled();

      // Check for spinner inside buttons
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument();
      expect(draftButton.querySelector('.animate-spin')).toBeInTheDocument();

      await user.click(submitButton);
      await user.click(draftButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Content Editor Field Interactions', () => {
    it('should switch between Write and Preview tabs', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const writeTab = screen.getByRole('tab', { name: /write/i });
      const previewTab = screen.getByRole('tab', { name: /preview/i });
      const contentTextarea = screen.getByLabelText(/article content/i);

      await user.type(
        contentTextarea,
        '### Heading 3 Content\n\n**Bold text here**'
      );

      // Switch to preview tab
      await user.click(previewTab);

      expect(previewTab).toHaveAttribute('aria-selected', 'true');
      expect(writeTab).toHaveAttribute('aria-selected', 'false');
      expect(
        screen.queryByLabelText(/article content/i)
      ).not.toBeInTheDocument();

      // Heading 3 is rendered via ReactMarkdown
      expect(
        screen.getByRole('heading', { level: 3, name: /heading 3 content/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/bold text here/i)).toBeInTheDocument();

      // Switch back to write tab
      await user.click(writeTab);
      expect(screen.getByLabelText(/article content/i)).toHaveValue(
        '### Heading 3 Content\n\n**Bold text here**'
      );
    });

    it('should compute and update word count, line count, and reading time statistics', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const contentTextarea = screen.getByLabelText(/article content/i);

      expect(screen.getByText(/0 words/i)).toBeInTheDocument();
      expect(screen.getByText(/0 lines/i)).toBeInTheDocument();

      // Type 6 words on 2 lines
      await user.type(
        contentTextarea,
        'First line word{enter}Second line word'
      );

      expect(screen.getByText(/6 words/i)).toBeInTheDocument();
      expect(screen.getByText(/2 lines/i)).toBeInTheDocument();
      expect(screen.getByText(/~1 min read/i)).toBeInTheDocument();
    });
  });

  describe('State Field Interactions', () => {
    it('should update state and visibility feedback description when selection changes', async () => {
      const user = userEvent.setup();
      render(<PostForm {...defaultProps} />);

      const stateSelect = screen.getByRole('combobox', { name: /state/i });

      // Initially PUBLISHED
      expect(stateSelect).toHaveValue('PUBLISHED');
      expect(
        screen.getByText(
          /immediately live and visible to all readers on the home feed/i
        )
      ).toBeInTheDocument();

      // Switch to HIDDEN
      await user.selectOptions(stateSelect, 'HIDDEN');
      expect(stateSelect).toHaveValue('HIDDEN');

      expect(
        screen.getByText(
          /unlisted from the public feed\. accessible only through direct link/i
        )
      ).toBeInTheDocument();
    });
  });

  describe('Image Upload Field Interactions', () => {
    it('should display selected file name and status when user uploads a file', async () => {
      const user = userEvent.setup();
      const { container } = render(<PostForm {...defaultProps} />);

      const fileInput = container.querySelector(
        '#post-image-file'
      ) as HTMLInputElement;

      const file = new File(['image_bytes'], 'my-awesome-photo.jpeg', {
        type: 'image/jpeg',
      });

      await user.upload(fileInput, file);

      expect(screen.getByText('my-awesome-photo.jpeg')).toBeInTheDocument();
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /replace file/i })
      ).toBeInTheDocument();
    });

    it('should handle image upload via drag and drop and submit successfully', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const { container } = render(
        <PostForm {...defaultProps} onSubmit={onSubmit} />
      );

      const titleInput = screen.getByLabelText(/title/i);
      const descInput = screen.getByLabelText(/description \/ excerpt/i);
      const contentInput = screen.getByLabelText(/article content/i);
      const dropZone = container.querySelector(
        'label[for="post-image-file"]'
      ) as HTMLLabelElement;
      const publishButton = screen.getByRole('button', { name: /^publish$/i });

      await user.type(titleInput, 'Article with Dragged Image');
      await user.type(descInput, 'Description for dragged image article.');
      await user.type(contentInput, 'Some valid post content here.');

      const droppedFile = new File(['dragged_bytes'], 'dropped-cover.png', {
        type: 'image/png',
      });

      // Drag enter, drag over, and drop
      fireEvent.dragEnter(dropZone);
      expect(screen.getByText(/drop image here/i)).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(
        screen.getByText(/drag & drop your cover image here/i)
      ).toBeInTheDocument();

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [droppedFile],
          items: [{ kind: 'file', type: 'image/png' }],
        },
      });

      expect(screen.getByText('dropped-cover.png')).toBeInTheDocument();
      expect(screen.getByText(/selected/i)).toBeInTheDocument();

      await user.click(publishButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.title).toBe('Article with Dragged Image');
      expect(submittedData.postImage[0]).toBe(droppedFile);
    });
  });
});
