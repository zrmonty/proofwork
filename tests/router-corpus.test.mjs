import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { route } from '../scripts/routing.mjs';

const corpus = JSON.parse(readFileSync(new URL('./router-corpus.json', import.meta.url)));
test('routing corpus preserves at least fifty distinct realistic scenarios', () => {
  assert.ok(corpus.length >= 50);
  assert.equal(new Set(corpus.map(scenario => scenario.task)).size, corpus.length);
});
for (const scenario of corpus) {
  test(`router corpus: ${scenario.task}`, () => {
    const result = route(scenario.task, scenario.files);
    assert.equal(result.tier, scenario.tier);
    assert.equal(result.playbook, scenario.playbook);
    assert.deepEqual([...result.skills].sort(), [...scenario.skills].sort());
    assert.equal(result.skills.length, new Set(result.skills).size);
  });
}

test('routing rejects malformed file inventories before selecting skills', () => {
  for (const files of [null, 'src/main.rs', [42], ['src/main.rs', undefined]]) {
    assert.throws(() => route('Fix parser', files), /files must be text paths/);
  }
});
