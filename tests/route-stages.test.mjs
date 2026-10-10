import test from 'node:test';
import assert from 'node:assert/strict';
import { route, transition } from '../scripts/proofwork.mjs';

const stages = [
  ['I want to start a new project: a club website', 'brainstorm', 'brainstorm'],
  ['Build a new app for neighborhood volunteers', 'brainstorm', 'brainstorm'],
  ['Brainstorm options for a reading app', 'brainstorm', 'brainstorm'],
  ['Architect a new project for our club', 'architecture', 'architecture-fit'],
  ['Choose storage for the approved app', 'architecture', 'architecture-fit'],
  ['Implement the approved design for a new project', 'feature', 'tdd-95'],
  ['Fix the new project creation bug', 'bug-fix', 'tdd-95'],
  ['Prepare the app for production', 'production-finish', 'production-finish'],
];
for (const [prompt, playbook, skill] of stages) {
  test(`stage routing: ${prompt}`, () => {
    const result = route(prompt);
    assert.equal(result.playbook, playbook);
    assert.ok(result.skills.includes(skill));
    assert.equal(result.skills.length, new Set(result.skills).size);
  });
}
for (const prompt of ['Plan a new project in Rust', 'Brainstorm a TypeScript website']) {
  test(`planning does not imply executable coverage: ${prompt}`, () => {
    const files = ['src/main.rs'];
    assert.ok(!route(prompt, files).skills.includes('tdd-95'));
    assert.deepEqual(files, ['src/main.rs']);
  });
}
for (const playbook of ['brainstorm', 'architecture', 'production-finish']) {
  test(`checkpoint retains the selected ${playbook} stage`, () => {
    const state = { owner: 'root', phase: 'preparing', tasks: [] };
    assert.equal(transition(state, 'checkpoint', { playbook }, 'root').playbook, playbook);
    assert.equal(state.playbook, undefined);
  });
}
for (const prompt of ['', null, 42]) {
  test(`routing rejects a missing or invalid task: ${prompt}`, () => {
    assert.throws(() => route(prompt), /task must be nonempty text/);
  });
}
test('checkpoint rejects an unsupported stage without changing state', () => {
  const state = { owner: 'root', phase: 'preparing', tasks: [] };
  assert.throws(() => transition(state, 'checkpoint', { playbook: 'automatic-deploy' }, 'root'), /invalid playbook/);
  assert.equal(state.playbook, undefined);
});
