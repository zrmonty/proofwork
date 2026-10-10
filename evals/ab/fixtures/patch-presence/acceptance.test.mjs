import assert from 'node:assert/strict';
import test from 'node:test';
import { applyProfilePatch } from './module.mjs';
test('independent boundary acceptance', async () => {
  const profile = { name: 'Sam', bio: 'Hi' };
  assert.deepEqual(applyProfilePatch(profile, {}), profile);
  assert.notEqual(applyProfilePatch(profile, {}), profile);
  assert.deepEqual(applyProfilePatch(profile, Object.create({ name: 'Other' })), profile);
  assert.throws(() => applyProfilePatch(profile, { name: '' }), TypeError);
  assert.throws(() => applyProfilePatch(profile, { bio: 4 }), TypeError);
  assert.deepEqual(profile, { name: 'Sam', bio: 'Hi' });
});
