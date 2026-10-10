import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { route, explainRoute } from '../scripts/routing.mjs';
import { transition } from '../scripts/proofwork.mjs';

const principle = slug => `pw-principle-${slug}`;
const corpus = JSON.parse(readFileSync(new URL('./router-corpus.json', import.meta.url)));

test('explanation preserves every legacy route and does not mutate file inputs', () => {
  for (const scenario of corpus) {
    const files = [...scenario.files];
    const result = explainRoute(scenario.task, files);
    const { tier, playbook, skills } = result;
    assert.deepEqual({ tier, playbook, skills }, route(scenario.task, files));
    assert.equal(result.recommendedTier, scenario.tier);
    assert.deepEqual(files, scenario.files);
    assert.ok(result.tierReasons.length > 0);
  }
});

test('a promoted typo loads actual full guidance while preserving its original recommendation', () => {
  const result = explainRoute('Fix typo in parser comment', ['src/parser.rs'], 'full');
  assert.equal(result.recommendedTier, 'light');
  assert.equal(result.tier, 'full');
  assert.ok(result.skills.includes('rust-best-practices'));
  assert.ok(result.skills.includes('pw-worker-mode'));
  assert.ok(result.skills.includes('thermo-nuclear-code-quality-review'));
  assert.deepEqual(result.tierOverride, { requested: 'full', applied: 'full', minimum: 'light', constrained: false });
});

test('security, combined audit and concurrency cannot be demoted by a light request', () => {
  for (const task of ['Review auth bypass', 'Run audit-stack', 'Implement concurrent queue']) {
    const result = explainRoute(task, ['src/queue.rs'], 'light');
    assert.equal(result.tier, 'full');
    assert.equal(result.tierOverride.minimum, 'full');
    assert.equal(result.tierOverride.constrained, true);
    assert.ok(result.skills.includes('thermo-nuclear-code-quality-review'));
    assert.ok(result.tierReasons.some(reason => /security|audit|concurren|risk/i.test(reason)));
  }
});

test('behavior changes retain executable verification while mechanical names may use light', () => {
  const change = explainRoute('Add parser validation', ['src/parser.rs'], 'light');
  assert.equal(change.tier, 'standard');
  assert.ok(change.skills.includes('tdd-95'));
  assert.equal(change.tierOverride.constrained, true);
  assert.equal(explainRoute('Rename parser variable', ['src/parser.rs'], 'light').tier, 'light');
  assert.equal(explainRoute('Optimize Rust parser typo handling', ['src/parser.rs'], 'light').tier, 'standard');
});

test('safe requested tiers apply and malformed requests fail explicitly', () => {
  assert.equal(explainRoute('Improve README explanation', ['README.md'], 'standard').tier, 'standard');
  assert.equal(explainRoute('Review module layout', ['src/a.ts', 'src/b.ts', 'src/c.ts'], 'light').tier, 'light');
  for (const invalid of ['fast', '', null, 1, {}]) {
    assert.throws(() => explainRoute('Fix typo', ['README.md'], invalid), /tier/);
  }
});

test('principle selection follows the actual stage without loading the catalog', () => {
  const cases = [
    ['Fix typo', ['README.md'], undefined, ['proportionate-effort']],
    ['Fix parser rejection', ['src/parser.rs'], undefined, ['reproduce-before-fix', 'prove-the-journey']],
    ['Choose database for app', [], undefined, ['earn-the-component', 'smallest-adequate']],
    ['Choose Rust or Python runtime', [], undefined, ['earn-the-component', 'language-fit']],
    ['Prepare production release', [], undefined, ['production-artifact-first', 'boundary-discipline']],
    ['Brainstorm a booking app', [], undefined, ['intent-stays-with-user', 'smallest-adequate']],
    ['Implement parser behavior', ['src/parser.rs'], undefined, ['preserve-contracts', 'prove-the-journey']],
    ['Explain parser', ['src/parser.rs'], 'standard', ['explain-what-is-proved', 'no-concealment-risk']],
    ['Fix concurrent parser', ['src/parser.rs'], undefined,
      ['reproduce-before-fix', 'prove-the-journey', 'sequence-verifiable-units', 'no-concealment-risk']],
  ];
  for (const [task, files, tier, expected] of cases) {
    assert.deepEqual(explainRoute(task, files, tier).principles, expected.map(principle), task);
  }
});

test('bounded candidate exploration selects prototype guidance without forcing parallel work', () => {
  for (const task of ['Prototype a search interaction', 'Explore alternatives for cache eviction',
    'Compare implementations of the parser']) {
    const plan = explainRoute(task, ['src/parser.rs']);
    assert.equal(plan.playbook, 'prototype');
    assert.equal(plan.tier, 'standard');
    assert.ok(plan.skills.includes('explore-options'));
    assert.deepEqual(plan.principles, ['smallest-adequate', 'earn-the-component'].map(principle));
  }
  assert.equal(explainRoute('Prototype concurrent queue', ['src/queue.rs']).tier, 'full');
  const readonly = explainRoute('Explain prototype results', ['notes.md']);
  assert.equal(readonly.playbook, 'investigate');
  assert.ok(!readonly.skills.includes('explore-options'));
});

test('operational preparation automatically selects production guidance and explanations stay read-only', () => {
  for (const task of ['Check staging readiness', 'Plan recovery for service failure', 'Prepare a rollback plan',
    'Set up observability for the service', 'Rotate production secrets', 'Prepare release readiness']) {
    const plan = explainRoute(task);
    assert.equal(plan.playbook, 'production-finish', task);
    assert.ok(plan.skills.includes('production-finish'), task);
  }
  for (const task of ['Explain staging readiness', 'Describe a rollback plan', 'Explain secret rotation',
    'Discuss the staging of a theatre show']) {
    assert.ok(!explainRoute(task).skills.includes('production-finish'), task);
  }
});

test('mixed review-and-change requests cannot shed executable verification', () => {
  const plan = explainRoute('Review and fix parser rejection', ['src/parser.rs'], 'light');
  assert.equal(plan.tier, 'standard');
  assert.equal(plan.tierOverride.constrained, true);
  assert.ok(plan.skills.includes('tdd-95'));
  assert.ok(!route('Review and fix parser rejection', ['src/parser.rs']).skills.includes('tdd-95'));
  assert.ok(!explainRoute('Review parser module', ['src/parser.rs'], 'standard').skills.includes('tdd-95'));
  assert.ok(!explainRoute('Explain fix for parser rejection', ['src/parser.rs'], 'standard').skills.includes('tdd-95'));
});

test('route CLI keeps legacy output and exposes explanations and bounded overrides', () => {
  const cli = fileURLToPath(new URL('../scripts/proofwork.mjs', import.meta.url));
  const run = args => spawnSync(process.execPath, [cli, 'route', ...args], { encoding: 'utf8' });
  const args = ['--task', 'Fix typo', '--files', 'README.md'];
  const legacy = run(args);
  assert.equal(legacy.status, 0, legacy.stderr);
  assert.deepEqual(JSON.parse(legacy.stdout), route('Fix typo', ['README.md']));
  const explained = run([...args, '--explain']);
  assert.equal(explained.status, 0, explained.stderr);
  assert.equal(JSON.parse(explained.stdout).recommendedTier, 'light');
  const promoted = run([...args, '--tier', 'full']);
  assert.equal(promoted.status, 0, promoted.stderr);
  assert.equal(JSON.parse(promoted.stdout).tier, 'full');
  const invalid = run([...args, '--tier', 'invalid']);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /tier/);
  assert.equal(invalid.stdout, '');
});

test('checkpoint accepts the prototype stage without mutating its input', () => {
  const state = { owner: 'root', phase: 'preparing', tasks: [] };
  const next = transition(state, 'checkpoint', { playbook: 'prototype' }, 'root');
  assert.equal(next.playbook, 'prototype');
  assert.equal(state.playbook, undefined);
});

test('plain component-necessity and host-readiness requests select their domain guidance', () => {
  const architecture = explainRoute('Do we need a database service, cache and queue for this invoice tracker?');
  assert.equal(architecture.playbook, 'architecture');
  assert.ok(architecture.skills.includes('architecture-fit'));
  const production = explainRoute('Get this invoice app ready for its image-based host.');
  assert.equal(production.playbook, 'production-finish');
  assert.ok(production.skills.includes('production-finish'));
  const explanation = explainRoute('Explain how to get this app ready for its host.');
  assert.equal(explanation.playbook, 'investigate');
  assert.ok(!explanation.skills.includes('production-finish'));
  assert.ok(!explainRoute('Do we need a better label for the database service?').skills.includes('architecture-fit'));
});

test('explicit light requests preserve read-only concurrency explanations', () => {
  const plan = explainRoute('Explain concurrent queue', ['src/queue.rs'], 'light');
  assert.equal(plan.tier, 'light');
  assert.equal(plan.tierOverride.minimum, 'light');
  assert.equal(plan.tierOverride.constrained, false);
  assert.ok(!plan.skills.includes('thermo-nuclear-code-quality-review'));
});

test('actual operational preparation keeps production checks despite documentation path inventories', () => {
  for (const task of ['Prepare release readiness', 'Get this app ready for its image-based host',
    'Rotate production secrets', 'Prepare a recovery plan', 'Set up observability', 'Prepare the app for production']) {
    const plan = explainRoute(task, ['README.md'], 'light');
    assert.equal(plan.tier, 'standard', task);
    assert.equal(plan.tierOverride.minimum, 'standard', task);
    assert.ok(plan.skills.includes('production-finish'), task);
    assert.ok(!plan.skills.includes('tdd-95'), task);
  }
  for (const task of ['Fix typo in deployment guide', 'Write documentation about deployment',
    'Explain release readiness', 'Correct spelling in the secret rotation guide']) {
    const plan = explainRoute(task, ['README.md']);
    assert.equal(plan.tier, 'light', task);
    assert.ok(!plan.skills.includes('production-finish'), task);
  }
});
