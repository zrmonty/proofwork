import test from 'node:test';
import assert from 'node:assert/strict';
import { exportedPages } from './export.ts';

test('export preserves every page including a single final page', () => {
  const pages = ['cover', 'body', 'final'];
  assert.deepEqual(exportedPages(pages), ['cover', 'body', 'final']);
  assert.deepEqual(exportedPages(['only']), ['only']);
  assert.deepEqual(exportedPages([]), []);
  assert.deepEqual(pages, ['cover', 'body', 'final']);
});
