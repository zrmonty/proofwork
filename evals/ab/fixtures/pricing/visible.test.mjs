import assert from 'node:assert/strict';
import test from 'node:test';
import { priceTotal, retailTotal, wholesaleTotal } from './module.mjs';
test('requested behavior', async () => {
  assert.equal(priceTotal([{ priceCents: 100, quantity: 3 }], 10), 270);
});
