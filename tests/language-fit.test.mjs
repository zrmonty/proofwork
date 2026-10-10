import test from 'node:test';
import assert from 'node:assert/strict';
import { route } from '../scripts/proofwork.mjs';

const choices = [
  '$language-fit Choose the stack by actual requirements',
  '/proofwork:language-fit Evaluate systems, scripting and fullstack options',
  'Which programming language should this project use?',
  'Compare Rust, C++ and C for a high-throughput trading engine',
  'Choose Vue or React for the frontend',
  'Should we use Vue or React for our publication?',
  'Recommend a framework for the application',
  'Architect our app with automations and a systems backend',
];
for (const prompt of choices) {
  test(`language choice routing: ${prompt}`, () => {
    const result = route(prompt);
    assert.equal(result.playbook, 'architecture');
    assert.ok(result.skills.includes('language-fit'));
    assert.equal(result.skills.length, new Set(result.skills).size);
  });
}
for (const prompt of ['Fix the Rust parser', 'Implement the approved Python automation', 'Translate UI labels into another language', 'Which language should the UI labels use?', 'Choose an article headline']) {
  test(`focused work does not reopen language choice: ${prompt}`, () => {
    assert.ok(!route(prompt, ['src/main.ts']).skills.includes('language-fit'));
  });
}
test('framework selection loads experience guidance without choosing a language', () => {
  const result = route('Choose Vue or React for the frontend');
  assert.ok(result.skills.includes('frontend-design'));
  assert.ok(!result.skills.includes('typescript-best-practices'));
  assert.ok(!result.skills.includes('tdd-95'));
});
