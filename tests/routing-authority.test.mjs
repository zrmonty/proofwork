import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { explainRoute } from '../scripts/routing.mjs';
import { withTeamPolicy } from '../scripts/team-policy.mjs';

const noChanges = [
  'do an audit. Just surface and do not make any codebase changes',
  'Audit the parser; findings only',
  'Audit the parser; do not make any changes',
  "Audit the parser; don't change anything",
  'Audit the parser; don\u2019t make changes',
  'Audit the parser without editing',
  'Explain the proposed fix without editing',
  'Explain the bug and then fix it; do not edit anything',
  'Do not edit anything and explain the parser',
  'Fix the parser; do not make any changes and report findings',
  'Audit the parser; do not make any changes to the codebase',
  'Fix the parser; do not edit anything until I approve',
  'Audit this repository; do not edit any files yet',
  'Audit this repository without making changes to it',
];
test('natural negative authority keeps team policy review-only', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-authority-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const task of noChanges) {
    const plan = explainRoute(task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'review-only', task);
    assert.ok(!plan.skills.includes('tdd-95'), task);
  }
});

test('explanation followed by implementation keeps testing and migration risk floors', () => {
  for (const [task, stage, tier] of [
    ['Describe the current schema and implement the migration', 'feature', 'full'],
    ['Explain the bug and then fix it', 'bug-fix', 'standard'],
    ['Describe the parser; then implement validation', 'feature', 'standard'],
  ]) {
    const plan = explainRoute(task, [], 'light');
    assert.equal(plan.playbook, stage, task);
    assert.equal(plan.tier, tier, task);
    assert.equal(plan.tierOverride.minimum, tier, task);
    assert.ok(plan.skills.includes('tdd-95'), task);
    if (tier === 'full' || stage === 'bug-fix')
      assert.ok(plan.workflow.beforeWork.includes('trace-path'), task);
  }
  for (const task of ['Explain the proposed fix without editing',
    'Explain how to implement the migration', 'Describe the migration and its implementation',
    'Explain fix for parser rejection']) {
    const plan = explainRoute(task);
    assert.equal(plan.playbook, 'investigate', task);
    assert.equal(plan.tier, 'light', task);
    assert.ok(!plan.skills.includes('tdd-95'), task);
  }
});

test('requested report-only procedures retain analysis depth without repair authority', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-analysis-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const [task, stage, skills] of [
    ['Run Coordinated Audit, report-only', 'review',
      ['audit-stack', 'security-hardening', 'dead-code-audit', 'dry-audit', 'performance-increase', 'tdd-95']],
    ['Justify Structure, report-only: compare storage options', 'architecture',
      ['architecture-fit', 'language-fit']],
    ['Run Harden and Finish, findings only', 'production-finish',
      ['security-hardening', 'production-finish']],
  ]) {
    const plan = explainRoute(task, [], 'light');
    assert.equal(plan.playbook, stage, task);
    assert.equal(plan.tier, 'full', task);
    assert.equal(plan.tierOverride.minimum, 'full', task);
    for (const skill of skills) assert.ok(plan.skills.includes(skill), `${task}: ${skill}`);
    if (stage === 'review') assert.ok(plan.workflow.beforeWork.includes('trace-path'), task);
    if (stage !== 'architecture') {
      assert.ok(plan.workflow.beforeWork.includes('impact-map'), task);
      assert.ok(plan.workflow.review.includes('challenge-review'), task);
    }
    assert.deepEqual(plan.workflow.options, [], task);
    assert.ok(!plan.workflow.beforeWork.includes('probe-first'), task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'review-only', task);
  }
});

const preservationRequests = [
  ['The invoice export sometimes loses its final page. Fix it without changing the format, and show that every page survives.', 'bug-fix', 'standard'],
  ['Implement the schema migration without changing the public API', 'feature', 'full'],
  ['Fix the parser, but do not change the public API', 'bug-fix', 'standard'],
  ['Implement the schema migration and do not edit unrelated files', 'feature', 'full'],
  ['Fix the parser; do not make any changes to the public API', 'bug-fix', 'standard'],
];
test('scoped preservation constraints retain authorized changes and risk floors', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-preservation-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const [task, stage, tier] of preservationRequests) {
    const plan = explainRoute(task, [], 'light');
    assert.equal(plan.playbook, stage, task);
    assert.equal(plan.tier, tier, task);
    assert.equal(plan.tierOverride.minimum, tier, task);
    assert.ok(plan.skills.includes('tdd-95'), task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'apply', task);
  }
  const restricted = explainRoute('Fix the parser without changing its API; do not edit anything');
  assert.equal(withTeamPolicy(restricted, repo,
    'Fix the parser without changing its API; do not edit anything', []).teamPolicy.mode, 'review-only');
});

const explanationRequests = [
  'Explain how to remove the cache and fix stale entries',
  'Explain why users must delete the old config and add the new one',
  'Describe the steps to remove the cache and fix stale entries',
  'Explain how to remove the cache and then fix stale entries',
];
test('actions inside an explanation do not grant implementation authority', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-explanation-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const task of explanationRequests) {
    const plan = explainRoute(task);
    assert.equal(plan.playbook, 'investigate', task);
    assert.equal(plan.tier, 'light', task);
    assert.ok(!plan.skills.includes('tdd-95'), task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'review-only', task);
  }
  for (const task of ['Explain the bug and then fix it',
    'Explain how to remove the cache and fix stale entries; then implement the repair',
    'Explain why users must delete the old config and add the new one. Fix the migration']) {
    const plan = explainRoute(task);
    assert.notEqual(plan.tier, 'light', task);
    assert.ok(plan.skills.includes('tdd-95'), task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'apply', task);
  }
});

const inspectionRequests = [
  ['Review unused functions, findings only', 'dead-code-audit'],
  ['Audit duplicated validation logic; findings only', 'dry-audit'],
  ['Compare SQLite and Postgres for this app, findings only', 'architecture-fit'],
  ['Compare Rust and Python runtimes, findings only', 'language-fit'],
  ['Review test coverage, findings only', 'tdd-95'],
  ['Check staging readiness, findings only', 'production-finish'],
];
test('natural report-only inspections retain their requested lenses without effect workflows', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-inspection-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const [task, skill] of inspectionRequests) {
    const plan = explainRoute(task, [], 'light');
    assert.equal(plan.tier, 'standard', task);
    assert.equal(plan.tierOverride.minimum, 'standard', task);
    assert.ok(plan.skills.includes(skill), task);
    assert.deepEqual(plan.workflow.options, [], task);
    assert.ok(!plan.workflow.beforeWork.includes('probe-first'), task);
    assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.mode, 'review-only', task);
  }
  for (const task of ['Explain unused functions', 'Explain SQLite and Postgres',
    'Explain staging readiness', 'Review this diff, findings only', 'Fix a typo, findings only']) {
    assert.equal(explainRoute(task).tier, 'light', task);
  }
});
