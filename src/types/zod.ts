import z, { object, string } from 'zod';

export const commentSchema = object({
  content: string()
    .min(1, 'Comment must be at least 1 character')
    .max(400, 'Comment must not exceed 400 characters'),
});
export type CommentType = z.infer<typeof commentSchema>;
