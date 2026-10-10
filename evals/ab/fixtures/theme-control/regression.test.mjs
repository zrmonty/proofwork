import assert from 'node:assert/strict';
import test from 'node:test';
import { renderThemeControl } from './module.mjs';
test('previously passing contract', async () => {
  assert.equal(typeof renderThemeControl(false, 'Theme'), 'string');
  assert.ok(renderThemeControl(false, 'Theme').length > 0);
});
