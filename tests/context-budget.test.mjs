import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { contextBudget, measureContext, checkContextBudget } from '../scripts/context-budget.mjs';

const baseline = { limits: { light: 800, standard: 4000 }, totalWords: 10000 };

test('context budgets accept exact limits and reject the next word', () => {
  const exact = { scenarios: [{ tier: 'light', words: 800 }, { tier: 'standard', words: 4000 }], totalWords: 4800 };
  assert.deepEqual(checkContextBudget(exact, baseline), []);
  const excessive = { scenarios: [{ tier: 'light', words: 801 }, { tier: 'standard', words: 4001 }], totalWords: 4802 };
  assert.equal(checkContextBudget(excessive, baseline).length, 2);
});

test('aggregate growth requires a reviewed baseline even for unrestricted full routes', () => {
  const scenarios = [{ tier: 'full', words: 11000 }];
  assert.deepEqual(checkContextBudget({ scenarios, totalWords: 11000 }, baseline), []);
  assert.equal(checkContextBudget({ scenarios, totalWords: 11001 }, baseline).length, 1);
});

test('malformed budgets and measurements cannot disable a gate through NaN comparison', () => {
  const measured = { scenarios: [{ tier: 'light', words: 150 }], totalWords: 150 };
  for (const invalid of ['bad', 0, -1, 1.5, Infinity, NaN, undefined]) {
    assert.throws(() => checkContextBudget(measured, { ...baseline, totalWords: invalid }), /positive integer/);
    assert.throws(() => checkContextBudget(measured,
      { ...baseline, limits: { light: invalid, standard: 4000 } }), /positive integer/);
  }
  assert.throws(() => checkContextBudget({ ...measured, totalWords: 'bad' }, baseline), /measured context/);
  assert.throws(() => checkContextBudget({ scenarios: [], totalWords: 1 }, baseline), /measured context/);
  for (const scenario of [{ tier: 'unknown', words: 1 }, { tier: 'light', words: 'bad' }]) {
    assert.throws(() => checkContextBudget({ scenarios: [scenario], totalWords: 1 }, baseline), /known tier/);
  }
});

function putFile(repo, relative, content) {
  const file = path.join(repo, relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function fixture() {
  const repo = mkdtempSync(path.join(tmpdir(), 'proofwork-budget-'));
  putFile(repo, 'shared/skills/use-proofwork/SKILL.md', 'entry '.repeat(100));
  putFile(repo, 'shared/skills/use-proofwork/references/light.md', 'stub '.repeat(50));
  for (const skill of ['pw-worker-mode', 'functional-programming', 'data-driven-development', 'pw-clean-code',
    'tdd-95', 'security-hardening', 'thermo-nuclear-code-quality-review', 'rust-best-practices',
    'trace-path', 'clear-voice', 'evidence-surface', 'impact-map', 'challenge-review']) {
    putFile(repo, `shared/skills/${skill}/SKILL.md`, 'skill '.repeat(10));
  }
  for (const name of ['proportionate-effort', 'preserve-contracts', 'prove-the-journey',
    'sequence-verifiable-units', 'no-concealment-risk', 'reproduce-before-fix']) {
    putFile(repo, `shared/skills/pw-principle-${name}/SKILL.md`, 'principle '.repeat(10));
  }
  return repo;
}

test('initial context counts the root, light stub and every selected skill once', t => {
  const repo = fixture();
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const corpus = [{ task: 'Fix typo in README', files: ['README.md'] },
    { task: 'Rename a Rust field', files: ['main.rs'] }, { task: 'Implement parser', files: [] },
    { task: 'Harden application', files: [] }, { task: 'Fix retry logic', files: [] }];
  const measured = measureContext(repo, corpus);
  assert.deepEqual(measured.scenarios.map(scenario => scenario.words), [170, 170, 160, 210, 180]);
  assert.equal(measured.totalWords, 890);
  assert.deepEqual(measured.scenarios.map(scenario => scenario.deferredWords), [10, 20, 20, 20, 20]);
  assert.equal(measured.totalDeferredWords, 90);
});

test('budget command reports a failure and success from the actual selected entries', t => {
  const repo = fixture();
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  putFile(repo, 'tests/router-corpus.json', JSON.stringify([{ task: 'Fix typo', files: [] }]));
  putFile(repo, 'shared/context-budget.json', JSON.stringify({ ...baseline, totalWords: 1 }));
  const command = path.resolve('scripts/context-budget.mjs');
  const failed = spawnSync(process.execPath, [command, repo], { encoding: 'utf8' });
  assert.equal(failed.status, 1);
  assert.equal(JSON.parse(failed.stdout).passed, false);
  putFile(repo, 'shared/context-budget.json', JSON.stringify(baseline));
  assert.equal(contextBudget(repo).passed, true);
  const passed = spawnSync(process.execPath, [command, repo], { encoding: 'utf8' });
  assert.equal(passed.status, 0);
  assert.equal(JSON.parse(passed.stdout).totalWords, 160);
  putFile(repo, 'shared/skills/use-proofwork/references/large.md', 'word '.repeat(801));
  assert.equal(contextBudget(repo).passed, false);
  assert.ok(contextBudget(repo).violations.some(file => file.limit === 800));
});

test('new context questions retain bounded light guidance in the real package', () => {
  const questions = ['How does the parser reject invalid input?', 'Why was this unusual cache limit chosen?'];
  const measured = measureContext(process.cwd(), questions.map(task => ({ task, files: ['src/parser.rs'] })));
  for (const scenario of measured.scenarios) {
    assert.equal(scenario.tier, 'light');
    assert.ok(scenario.words <= 800, `${scenario.task}: ${scenario.words}`);
    assert.ok(scenario.deferredWords > 0);
  }
});
