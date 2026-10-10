import assert from 'node:assert/strict';
import test from 'node:test';
import { priceTotal, retailTotal, wholesaleTotal } from './module.mjs';
test('independent boundary acceptance', async () => {
  const rows = [{ priceCents: 101, quantity: 3 }];
  assert.equal(retailTotal(rows), 303);
  assert.equal(wholesaleTotal(rows), 273);
  assert.equal(priceTotal(rows, 0), 303);
  assert.equal(priceTotal(rows, 100), 0);
  assert.deepEqual(rows, [{ priceCents: 101, quantity: 3 }]);
  for (const percent of [-1, 101, NaN, Infinity]) assert.throws(() => priceTotal(rows, percent), RangeError);
});
