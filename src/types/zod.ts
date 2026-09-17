import z from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment must be at least 1 character')
    .max(400, 'Comment must not exceed 400 characters'),
});
export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
export type CreateCommentRequest = CreateCommentFormValues & { postId: number };

// AUTH SCHEMAS
export const signInSchema = z.object({
  username: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Required' : 'Not a string',
    })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Password is required' : 'Not a string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(120, 'Password must not exceed 120 characters'),
});
export type SignInRequest = z.infer<typeof signInSchema>;

export const registerSchema = signInSchema.extend({
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? 'Email is required'
          : 'Invalid email format',
    })
    .trim()
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(),
});
export type RegisterRequest = z.infer<typeof registerSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const postSchema = z.object({
  title: z
    .string('Not a string')
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title must not exceed 255 characters'),

  description: z
    .string('Not a string')
    .trim()
    .min(1, 'Description is required')
    .max(300, 'Description should not exceed 300 characters'),

  content: z.string().trim().min(1, 'Content should be at least 1 character'),

  state: z.enum(['PUBLISHED', 'HIDDEN', 'DRAFT']),

  postImage: z
    .instanceof(FileList)
    .refine((images) => images.length > 0, 'Image is required')
    .refine(
      (images) => images[0] && ACCEPTED_IMAGE_TYPES.includes(images[0].type),
      'Only JPEG, PNG and WEBP are supported'
    )
    .refine(
      (images) => images[0] && images[0].size <= MAX_FILE_SIZE,
      'Image must not exceed 5MB'
    ),
});

export type PostFormValues = z.infer<typeof postSchema>;
