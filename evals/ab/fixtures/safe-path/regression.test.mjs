import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAsset } from './module.mjs';
import path from 'node:path';
const root = path.resolve('assets');
test('previously passing contract', async () => {
  assert.equal(resolveAsset(root, 'images/icon.svg'), path.join(root, 'images/icon.svg'));
});
