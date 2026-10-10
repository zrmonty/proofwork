import assert from 'node:assert/strict';
import test from 'node:test';
import { runWithRetry } from './module.mjs';
test('requested behavior', async () => {
  let calls = 0;
  const value = await runWithRetry(async () => {
    if (++calls < 2) throw Object.assign(new Error('again'), { retryable: true });
    return 9;
  }, 2);
  assert.equal(value, 9);
  assert.equal(calls, 2);
});
