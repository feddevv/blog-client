import z, { object, string } from 'zod';

export const commentSchema = object({
  content: string()
    .min(1, 'Comment must be at least 1 character')
    .max(400, 'Comment must not exceed 400 characters'),
});
export type CommentType = z.infer<typeof commentSchema>;

// AUTH SCHEMAS
export const signInSchema = object({
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

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Password is required' : 'Not a string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(120, 'Password must not exceed 120 characters'),
});
export type SignInType = z.infer<typeof signInSchema>;

export const registerSchema = signInSchema.extend({
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
});
export type RegisterType = z.infer<typeof registerSchema>;
