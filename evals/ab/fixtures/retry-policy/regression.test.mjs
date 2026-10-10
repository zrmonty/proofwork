import assert from 'node:assert/strict';
import test from 'node:test';
import { runWithRetry } from './module.mjs';
test('previously passing contract', async () => {
  assert.equal(await runWithRetry(async () => 9, 2), 9);
});
