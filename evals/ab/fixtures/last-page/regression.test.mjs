import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPages } from './module.mjs';
test('previously passing contract', async () => {
  assert.equal(formatPages([]), '');
});
