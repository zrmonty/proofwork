import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { explainRoute } from './routing.mjs';

const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const wordCount = file => readFileSync(file, 'utf8').split(/\s+/u).filter(Boolean).length;

export function measureContext(repo, corpus) {
  const skillRoot = path.join(repo, 'shared/skills');
  const entryWords = wordCount(path.join(skillRoot, 'use-proofwork/SKILL.md'));
  const lightWords = wordCount(path.join(skillRoot, 'use-proofwork/references/light.md'));
  const scenarios = corpus.map(scenario => {
    const result = explainRoute(scenario.task, scenario.files);
    const initial = [...new Set([...result.skills,
      ...result.workflow.beforeWork, ...result.workflow.options])];
    const skills = initial.map(skill => wordCount(path.join(skillRoot, skill, 'SKILL.md')));
    const deferred = [...new Set([...result.workflow.review, ...result.workflow.report])]
      .filter(skill => !initial.includes(skill));
    const deferredWords = deferred.reduce((total, skill) =>
      total + wordCount(path.join(skillRoot, skill, 'SKILL.md')), 0);
    const playbookWords = wordCount(path.join(repo, 'shared', result.procedure.path));
    const recoveryWords = result.continuation.references.reduce((total, reference) =>
      total + wordCount(path.join(repo, 'shared', reference)), 0);
    const principleWords = result.principleReferences.reduce((total, reference) =>
      total + wordCount(path.join(repo, 'shared', reference)), 0);
    const words = entryWords + playbookWords + recoveryWords + principleWords
      + skills.reduce((total, count) => total + count, 0);
    return { task: scenario.task, tier: result.tier, deferredWords,
      words: words + (result.tier === 'light' ? lightWords : 0) };
  });
  return { scenarios, totalWords: scenarios.reduce((total, scenario) => total + scenario.words, 0),
    totalDeferredWords: scenarios.reduce((total, scenario) => total + scenario.deferredWords, 0) };
}

export function checkContextBudget(measured, baseline) {
  const positiveCount = value => Number.isSafeInteger(value) && value > 0;
  if (!positiveCount(baseline.totalWords) || !positiveCount(baseline.limits?.light)
    || !positiveCount(baseline.limits?.standard)) throw new Error('budget baseline needs positive integer counts');
  if (!positiveCount(measured.totalWords) || !Array.isArray(measured.scenarios) || !measured.scenarios.length) {
    throw new Error('measured context needs positive counts and scenarios');
  }
  if (measured.scenarios.some(scenario => !['light', 'standard', 'full'].includes(scenario.tier)
    || !positiveCount(scenario.words))) throw new Error('context scenarios need a known tier and positive word count');
  const violations = measured.scenarios.filter(scenario =>
    scenario.tier !== 'full' && scenario.words > baseline.limits[scenario.tier]);
  if (measured.totalWords > baseline.totalWords * 1.1) {
    violations.push({ task: 'aggregate corpus context grew more than 10%', words: measured.totalWords });
  }
  return violations;
}

export function contextBudget(repo) {
  const corpus = readJson(path.join(repo, 'tests/router-corpus.json'));
  const baseline = readJson(path.join(repo, 'shared/context-budget.json'));
  const measured = measureContext(repo, corpus);
  const files = skillBudgets(repo);
  const violations = [...checkContextBudget(measured, baseline), ...files.filter(file => file.words > file.limit)];
  return { ...measured, files, violations, passed: violations.length === 0 };
}

export function skillBudgets(repo) {
  const root = path.join(repo, 'shared/skills');
  const files = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name === 'SKILL.md' || (file.includes(`${path.sep}references${path.sep}`)
        && entry.name.endsWith('.md'))) {
        files.push({ path: path.relative(repo, file), words: wordCount(file),
          limit: entry.name === 'SKILL.md' ? 600 : 800 });
      }
    }
  }
  walk(root);
  return files;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = contextBudget(path.resolve(process.argv[2] ?? '.'));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.passed ? 0 : 1;
}
