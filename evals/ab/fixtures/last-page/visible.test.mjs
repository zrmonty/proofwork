import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPages } from './module.mjs';
test('requested behavior', async () => {
  assert.equal(formatPages(['first', 'last']), 'first\nlast');
});
