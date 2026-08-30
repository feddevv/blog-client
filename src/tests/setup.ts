import { server } from '@/mocks/node';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { populatePosts } from '@/mocks/data/posts';
import { populateComments } from '@/mocks/data/comments';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

beforeAll(() => {
  server.listen();
  HTMLDialogElement.prototype.close = vi.fn();
});

beforeEach(() => {
  populatePosts();
  populateComments();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
