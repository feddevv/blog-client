import { postsHandlers } from './posts';
import { commentsHandler } from './comments';
import { usersHandler } from './users';
import { likesHandlers } from './likes';

export const handlers = [
  ...postsHandlers,
  ...commentsHandler,
  ...usersHandler,
  ...likesHandlers,
];
