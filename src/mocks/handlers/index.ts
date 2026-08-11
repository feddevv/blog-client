import { postsHandlers } from './posts';
import { commentsHandler } from './comments';
import { usersHandler } from './users';

export const handlers = [
  ...postsHandlers,
  ...commentsHandler,
  ...usersHandler,
];
