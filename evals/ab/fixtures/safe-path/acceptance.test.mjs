import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAsset } from './module.mjs';
import path from 'node:path';
const root = path.resolve('assets');
test('independent boundary acceptance', async () => {
  assert.equal(resolveAsset(root, 'images/icon.svg'), path.join(root, 'images/icon.svg'));
  assert.throws(() => resolveAsset(root, '.'));
  assert.throws(() => resolveAsset(root, root));
  assert.throws(() => resolveAsset(root, '../assets-evil/secret'));
  assert.throws(() => resolveAsset(root, path.parse(root).root + 'private.txt'));
});
