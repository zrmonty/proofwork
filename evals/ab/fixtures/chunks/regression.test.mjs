import assert from 'node:assert/strict';
import test from 'node:test';
import { chunks } from './module.mjs';
test('previously passing contract', async () => {
  assert.deepEqual(chunks([], 2), []);
});
