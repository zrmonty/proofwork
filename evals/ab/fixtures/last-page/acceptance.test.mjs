import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPages } from './module.mjs';
test('independent boundary acceptance', async () => {
  assert.equal(formatPages([]), '');
  assert.equal(formatPages(['only']), 'only');
  const pages = ['a', 'b', 'c'];
  assert.equal(formatPages(pages), 'a\nb\nc');
  assert.deepEqual(pages, ['a', 'b', 'c']);
});
