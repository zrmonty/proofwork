import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize } from './module.mjs';
test('requested behavior', async () => {
  assert.deepEqual(summarize([0, 2, null]), { count: 2, sum: 2, mean: 1 });
});
