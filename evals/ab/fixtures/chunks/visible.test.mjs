import assert from 'node:assert/strict';
import test from 'node:test';
import { chunks } from './module.mjs';
test('requested behavior', async () => {
  assert.deepEqual(chunks([1, 2, 3], 2), [[1, 2], [3]]);
});
