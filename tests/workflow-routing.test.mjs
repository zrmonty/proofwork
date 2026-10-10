import test from 'node:test';
import assert from 'node:assert/strict';
import { explainRoute } from '../scripts/routing.mjs';
import { workflowFor } from '../scripts/workflow-routing.mjs';

test('existing behavioral work loads context first and keeps reporting separate', () => {
  const result = workflowFor('Add invoice filters to the existing app', ['src/invoices.ts'], 'standard', 'feature');
  assert.deepEqual(result.beforeWork, ['trace-path']);
  assert.deepEqual(result.options, []);
  assert.deepEqual(result.review, []);
  assert.deepEqual(result.report, ['clear-voice', 'evidence-surface']);
});

test('light mechanical, copy and new-product requests avoid automatic context ceremonies', () => {
  for (const [task, files, tier, stage] of [
    ['Fix typo', ['README.md'], 'light', 'bug-fix'],
    ['Rename local variable', ['src/main.rs'], 'full', 'refactor'],
    ['Write onboarding labels', ['src/page.tsx'], 'standard', 'feature'],
    ['Brainstorm a new app', [], 'standard', 'brainstorm'],
    ['Choose architecture for a new project', [], 'standard', 'architecture'],
  ]) {
    const result = workflowFor(task, files, tier, stage);
    assert.deepEqual(result.beforeWork, /README|labels/.test(`${files.join(' ')} ${task}`) ? ['clear-voice'] : [], task);
    assert.deepEqual(result.review, [], task);
  }
});

test('explicit context questions can load light investigation without accidental language tokens', () => {
  assert.deepEqual(workflowFor('Trace checkout through its request handlers', [], 'light', 'investigate').beforeWork,
    ['trace-path']);
  assert.deepEqual(workflowFor('How does the parser reject invalid input?', [], 'light', 'investigate').beforeWork,
    ['trace-path']);
  assert.deepEqual(workflowFor('Why was this unusual cache limit chosen?', [], 'light', 'investigate').beforeWork,
    ['origin-check']);
  assert.deepEqual(workflowFor('Trace the historical checkout path rationale', ['src/checkout.rs'],
    'light', 'investigate').beforeWork, ['origin-check']);
  for (const task of ['Why?', 'Go faster', 'Choose C', 'How many users are there?']) {
    assert.deepEqual(workflowFor(task, [], 'light', 'investigate').beforeWork, [], task);
  }
});

test('documentation and prose work receives initial wording guidance without loading report checks early', () => {
  for (const [task, files] of [['Fix punctuation', ['docs/guide.md']],
    ['Rewrite comments about the parser', ['src/parser.rs']], ['Polish explanatory prose', []]]) {
    const result = workflowFor(task, files, 'light', 'feature');
    assert.deepEqual(result.beforeWork, ['clear-voice']);
    assert.deepEqual(result.report, ['clear-voice', 'evidence-surface']);
  }
});

test('probes and alternatives require meaningful executable uncertainty', () => {
  assert.ok(workflowFor('Use a throwaway runnable probe to settle parser uncertainty', ['src/parser.rs'],
    'standard', 'feature').beforeWork.includes('probe-first'));
  assert.deepEqual(workflowFor('Prototype cache alternatives', ['src/cache.rs'], 'standard', 'prototype').options,
    ['option-arena']);
  assert.deepEqual(workflowFor('Run an option arena with parallel candidates', [], 'standard', 'feature').options,
    ['option-arena']);
  assert.ok(!workflowFor('Read CPU probe data', [], 'standard', 'investigate').beforeWork.includes('probe-first'));
  assert.deepEqual(workflowFor('Prototype a parser', ['src/parser.rs'], 'light', 'prototype').options, []);
});

test('measurement and novel procedure requests select their bounded workflows', () => {
  assert.deepEqual(workflowFor('Optimize parser latency against measured baseline benchmarks', ['src/parser.rs'],
    'standard', 'investigate').options, ['measure-loop']);
  assert.deepEqual(workflowFor('Draft a novel recovery procedure with no existing workflow', [],
    'standard', 'feature').options, ['procedure-draft']);
  assert.deepEqual(workflowFor('Implement invoice tracking', ['src/invoice.ts'], 'standard', 'feature').options, []);
});

test('cross-boundary impacts load before edits and integrated reviews repeat them', () => {
  const result = workflowFor('Verify integrated API contract changes across service boundaries', ['src/api.ts'],
    'full', 'review');
  assert.ok(result.beforeWork.includes('impact-map'));
  assert.deepEqual(result.review, ['impact-map', 'challenge-review']);
  assert.ok(workflowFor('Assess blast radius on affected callers', [], 'standard', 'review').review
    .includes('impact-map'));
  assert.ok(workflowFor('Run adversarial multi-angle review', [], 'standard', 'review').review
    .includes('challenge-review'));
});

test('schema migrations establish current contracts and impacts without a supplied file inventory', () => {
  for (const tier of ['standard', 'full']) {
    const plan = workflowFor('Implement schema migration across service boundaries', [], tier, 'feature');
    assert.deepEqual(plan.beforeWork, ['trace-path', 'impact-map']);
    assert.ok(plan.review.includes('impact-map'));
    if (tier === 'full') assert.ok(plan.review.includes('challenge-review'));
  }
  const explanation = workflowFor('Assess blast radius on affected callers', [], 'light', 'investigate');
  assert.ok(explanation.beforeWork.includes('impact-map'));
  for (const files of [[], ['README.md']]) {
    const typo = workflowFor('Fix API contract docs typo', files, 'full', 'bug-fix');
    assert.ok(!typo.beforeWork.includes('impact-map'));
  }
});

test('read-only requests never schedule modifying option, probe or measurement workflows', () => {
  for (const task of ['Explain prototype alternatives and benchmark latency',
    'Report-only: use runnable probes and parallel candidates to investigate uncertainty',
    'Dry-run: optimize parser with baseline benchmarks']) {
    const result = workflowFor(task, ['src/parser.rs'], 'full', 'investigate');
    assert.deepEqual(result.options, [], task);
    assert.ok(!result.beforeWork.includes('probe-first'), task);
    assert.ok(!result.review.includes('impact-map'), task);
  }
});

test('phase arrays contain unique skill names even when several triggers match', () => {
  const result = workflowFor('Trace path and explain how the existing parser works; inspect historical rationale',
    ['src/parser.rs'], 'standard', 'investigate');
  for (const phase of Object.values(result)) assert.equal(phase.length, new Set(phase).size);
  assert.deepEqual(result.beforeWork, ['trace-path', 'origin-check']);
});

test('hardening an application establishes its existing behavior before repairs', () => {
  assert.deepEqual(workflowFor('Harden this application', [], 'full', 'feature').beforeWork, ['trace-path']);
  assert.deepEqual(workflowFor('Audit the existing application', [], 'full', 'review').beforeWork, ['trace-path']);
});

test('historical or unusual product content does not imply code archaeology', () => {
  for (const task of ['Design an unusual landing page', 'Display historical invoices',
    'Build an arena seating layout']) {
    const result = workflowFor(task, [], 'standard', 'feature');
    assert.ok(!result.beforeWork.includes('origin-check'), task);
    assert.ok(!result.options.includes('option-arena'), task);
  }
  for (const task of ['Inspect Git history for the cache constraint',
    'Explain historical code decisions', 'Find the rationale behind the earlier constraint',
    'Why was this unusual cache limit chosen?']) {
    assert.ok(workflowFor(task, [], 'light', 'investigate').beforeWork.includes('origin-check'), task);
  }
  assert.ok(workflowFor('Compare implementation candidates in an arena', [], 'standard', 'feature').options
    .includes('option-arena'));
});

test('explained plans expose staged skills for current-behavior and origin questions', () => {
  const behavior = explainRoute('How does the parser reject invalid input?', ['src/parser.rs']);
  assert.equal(behavior.playbook, 'investigate');
  assert.equal(behavior.tier, 'light');
  assert.deepEqual(behavior.workflow.beforeWork, ['trace-path']);
  assert.deepEqual(behavior.workflow.report, ['clear-voice', 'evidence-surface']);
  const origin = explainRoute('Why was this unusual cache limit chosen?', ['src/cache.rs']);
  assert.equal(origin.playbook, 'investigate');
  assert.ok(origin.workflow.beforeWork.includes('origin-check'));
});
