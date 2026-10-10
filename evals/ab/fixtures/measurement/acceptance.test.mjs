import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize } from './module.mjs';
test('independent boundary acceptance', async () => {
  assert.deepEqual(summarize([]), { count: 0, sum: 0, mean: null });
  assert.deepEqual(summarize([undefined, null, -2, 2]), { count: 2, sum: 0, mean: 0 });
  for (const value of [NaN, Infinity, '3', false]) assert.throws(() => summarize([value]), TypeError);
  const values = [0, null, 2];
  summarize(values);
  assert.deepEqual(values, [0, null, 2]);
});
