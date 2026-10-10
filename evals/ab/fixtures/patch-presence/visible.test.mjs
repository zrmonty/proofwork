import assert from 'node:assert/strict';
import test from 'node:test';
import { applyProfilePatch } from './module.mjs';
test('requested behavior', async () => {
  assert.deepEqual(applyProfilePatch({ name: 'Sam', bio: 'Hi' }, { bio: null }), { name: 'Sam', bio: null });
});
