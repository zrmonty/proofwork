import assert from 'node:assert/strict';
import test from 'node:test';
import { chunks } from './module.mjs';
test('independent boundary acceptance', async () => {
  assert.deepEqual(chunks([], 2), []);
  assert.deepEqual(chunks([1, 2], 9), [[1, 2]]);
  const values = [1, 2, 3];
  assert.deepEqual(chunks(values, 1), [[1], [2], [3]]);
  assert.deepEqual(values, [1, 2, 3]);
  for (const size of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => chunks(values, size), RangeError);
});
