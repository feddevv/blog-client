import { server } from '@/mocks/node';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { populatePosts } from '@/mocks/data/posts';
import { populateComments } from '@/mocks/data/comments';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

beforeAll(() => {
  if (
    typeof File !== 'undefined' &&
    typeof File.prototype.stream !== 'function'
  ) {
    File.prototype.stream = function () {
      return new ReadableStream({
        start: async (controller) => {
          const buf = await this.arrayBuffer();
          controller.enqueue(new Uint8Array(buf));
          controller.close();
        },
      });
    };
  }

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
