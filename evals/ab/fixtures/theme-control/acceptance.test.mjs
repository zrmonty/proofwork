import assert from 'node:assert/strict';
import test from 'node:test';
import { renderThemeControl } from './module.mjs';
test('independent boundary acceptance', async () => {
  const enabled = renderThemeControl(true, 'Dark mode');
  assert.match(enabled, /type=["']button["']/);
  assert.match(enabled, /aria-pressed=["']true["']/);
  const hostile = renderThemeControl(false, '<img src=x onerror=alert(1)> & \"quote\"');
  assert.ok(!hostile.includes('<img'));
  assert.ok(hostile.includes('&lt;img'));
  assert.ok(hostile.includes('&amp;'));
});
