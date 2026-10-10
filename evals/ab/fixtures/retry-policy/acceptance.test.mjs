import assert from 'node:assert/strict';
import test from 'node:test';
import { runWithRetry } from './module.mjs';
test('independent boundary acceptance', async () => {
  const terminal = new Error('terminal');
  let calls = 0;
  await assert.rejects(runWithRetry(async () => { calls++; throw terminal; }, 3), error => error === terminal);
  assert.equal(calls, 1);
  const transient = Object.assign(new Error('transient'), { retryable: true });
  calls = 0;
  await assert.rejects(runWithRetry(async () => { calls++; throw transient; }, 2), error => error === transient);
  assert.equal(calls, 2);
  for (const limit of [0, -1, 1.5, Infinity]) {
    await assert.rejects(runWithRetry(async () => {
      throw new Error('must not run');
    }, limit), RangeError);
  }
});
