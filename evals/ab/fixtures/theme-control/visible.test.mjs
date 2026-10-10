import assert from 'node:assert/strict';
import test from 'node:test';
import { renderThemeControl } from './module.mjs';
test('requested behavior', async () => {
  assert.match(renderThemeControl(false, 'Dark mode'), /<button\b/);
  assert.match(renderThemeControl(false, 'Dark mode'), /aria-pressed=["']false["']/);
});
