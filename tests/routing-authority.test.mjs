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
