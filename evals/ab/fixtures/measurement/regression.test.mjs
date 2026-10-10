import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize } from './module.mjs';
test('previously passing contract', async () => {
  assert.deepEqual(summarize([1, 3]), { count: 2, sum: 4, mean: 2 });
});
