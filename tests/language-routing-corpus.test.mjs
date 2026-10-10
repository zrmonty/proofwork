import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { route } from '../scripts/routing.mjs';

const corpus = JSON.parse(readFileSync(new URL('./language-routing-corpus.json', import.meta.url)));
test('language routing corpus contains fifty distinct prompts with positive and negative controls', () => {
  assert.equal(corpus.length, 50);
  assert.equal(new Set(corpus.map(item => item.task)).size, 50);
  for (const [group, count] of [['ordinary-go', 12], ['ordinary-c', 12], ['technology-choice', 20], ['focused-work', 6]]) {
    assert.equal(corpus.filter(item => item.group === group).length, count);
  }
});
for (const scenario of corpus) {
  test(`language routing: ${scenario.task}`, () => {
    const result = route(scenario.task, scenario.files ?? []);
    assert.equal(result.playbook, scenario.playbook);
    assert.equal(result.skills.includes('language-fit'), scenario.languageChoice, 'language-choice skill');
    assert.equal(result.skills.includes('architecture-fit'), scenario.languageChoice, 'architecture-choice skill');
  });
}
