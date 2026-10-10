import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAsset } from './module.mjs';
import path from 'node:path';
const root = path.resolve('assets');
test('requested behavior', async () => {
  assert.throws(() => resolveAsset(root, '../private.txt'));
});
