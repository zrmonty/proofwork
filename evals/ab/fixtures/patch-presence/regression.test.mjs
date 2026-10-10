import assert from 'node:assert/strict';
import test from 'node:test';
import { applyProfilePatch } from './module.mjs';
test('previously passing contract', async () => {
  assert.deepEqual(
    applyProfilePatch({ name: 'Sam', bio: 'Hi' }, { name: 'Lee', bio: 'New' }),
    { name: 'Lee', bio: 'New' },
  );
});
