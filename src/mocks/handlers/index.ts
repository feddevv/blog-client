import { postsHandlers } from './posts';
import { commentsHandler } from './comments';

export const handlers = [...postsHandlers, ...commentsHandler];
