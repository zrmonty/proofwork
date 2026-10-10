import assert from 'node:assert/strict';
import test from 'node:test';
import { priceTotal, retailTotal, wholesaleTotal } from './module.mjs';
test('previously passing contract', async () => {
  assert.equal(retailTotal([{ priceCents: 101, quantity: 3 }]), 303);
  assert.equal(wholesaleTotal([{ priceCents: 101, quantity: 3 }]), 273);
});
