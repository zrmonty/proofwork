import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { route } from '../../scripts/routing.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
export const tasks = JSON.parse(readFileSync(path.join(here, 'tasks.json'), 'utf8'));
const digest = text => createHash('sha256').update(text).digest('hex');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function testEnvironment() {
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  return environment;
}

function snapshot(folder, prefix = '') {
  const files = {};
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(item.name)) continue;
    const relative = path.join(prefix, item.name);
    const absolute = path.join(folder, item.name);
    if (item.isDirectory()) Object.assign(files, snapshot(absolute, relative));
    else if (item.isFile()) files[relative] = digest(readFileSync(absolute));
    else files[relative] = 'non-regular-file';
  }
  return files;
}

export function changedFiles(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter(file => before[file] !== after[file]).sort();
}

function prepare(folder, task) {
  mkdirSync(folder, { recursive: true });
  const fixture = path.join(here, 'fixtures', task.id);
  for (const file of ['module.mjs', 'visible.test.mjs']) {
    copyFileSync(path.join(fixture, file), path.join(folder, file));
  }
  writeJson(path.join(folder, 'package.json'), { private: true, type: 'module', scripts: { test: 'node --test' } });
}

export function verifyTask(workspace, task, privateFolder) {
  mkdirSync(privateFolder, { recursive: true });
  const fixture = path.join(here, 'fixtures', task.id);
  for (const [file, identity] of Object.entries(snapshot(workspace))) {
    if (identity === 'non-regular-file') continue;
    const target = path.join(privateFolder, file);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(workspace, file), target);
  }
  const results = {};
  for (const [name, source] of [['visible', 'visible.test.mjs'], ['acceptance', 'acceptance.test.mjs'],
    ['regression', 'regression.test.mjs']]) {
    copyFileSync(path.join(fixture, source), path.join(privateFolder, source));
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', source],
      { cwd: privateFolder, encoding: 'utf8', timeout: 10000, env: testEnvironment() });
    results[name] = { passed: result.status === 0, exitCode: result.status,
      digest: digest(result.stdout + result.stderr) };
    writeFileSync(path.join(privateFolder, `${name}.tap`), result.stdout + result.stderr);
  }
  return results;
}

function profileContext(arm, task, config) {
  if (arm === 'bare') return '';
  if (arm === 'reference') return readFileSync(config.referenceContextPath, 'utf8');
  const skillRoot = config.proofworkSkillRoot ?? path.join(repo, 'shared/skills');
  const result = route(task.prompt, task.files);
  const files = ['use-proofwork/SKILL.md', ...result.skills.map(skill => `${skill}/SKILL.md`)];
  if (result.tier === 'light') files.push('use-proofwork/references/light.md');
  return files.map(file => {
    const source = path.join(skillRoot, file);
    return `Skill source: ${source}\n${readFileSync(source, 'utf8')}`;
  }).join('\n\n');
}

function promptFor(arm, task, config) {
  return `Work only in the supplied disposable workspace. Do not inspect other evaluation directories or oracle files.
Do not change credentials, user settings, remote repositories, or external applications. Do not install dependencies.
Preserve public exports and original tests. Finish the requested behavior and report actual checks and gaps.
Task: ${task.prompt}\n\n${profileContext(arm, task, config)}`;
}

export function normalizeMetadata(metadata, observed) {
  const validCount = value => Number.isSafeInteger(value) && value >= 0;
  const tokens = metadata.tokens;
  const measuredTokens = tokens && validCount(tokens.input) && validCount(tokens.output)
    ? { input: tokens.input, output: tokens.output, source: 'runner-reported' } : null;
  const claim = metadata.claims?.acceptancePassed;
  const claimsMatched = typeof claim === 'boolean' ? claim === observed.acceptance.passed : null;
  return { tokens: measuredTokens, claimsMatched, humanReview: 'pending' };
}

function readMetadata(file) {
  try { return readJson(file); } catch { return {}; }
}

function executeRun(task, arm, repetition, config, runRoot, baseline) {
  const root = mkdtempSync(path.join(runRoot, `${task.id}-${arm}-${repetition}-`));
  const workspace = path.join(root, 'workspace');
  prepare(workspace, task);
  const before = snapshot(workspace);
  const replacements = { workspace, promptFile: path.join(root, 'prompt.txt'),
    replyFile: path.join(root, 'reply.txt'), metadataFile: path.join(root, 'metadata.json') };
  const prompt = promptFor(arm, task, config);
  writeFileSync(replacements.promptFile, prompt);
  const args = config.args.map(arg => arg.replace(/\{(\w+)\}/gu, (_, name) => {
    if (!(name in replacements)) throw new Error(`unknown runner placeholder: ${name}`);
    return replacements[name];
  }));
  spawnSync('git', ['init', '--quiet'], { cwd: workspace, encoding: 'utf8' });
  const started = performance.now();
  const runner = spawnSync(config.command, args, { cwd: workspace, encoding: 'utf8',
    input: config.stdinPrompt ? prompt : undefined, timeout: config.timeoutMs ?? 300000,
    maxBuffer: 16 * 1024 * 1024 });
  const durationMs = performance.now() - started;
  writeFileSync(path.join(root, 'runner.stdout'), runner.stdout ?? '');
  writeFileSync(path.join(root, 'runner.stderr'), runner.stderr ?? '');
  const observed = verifyTask(workspace, task, path.join(root, 'private-verification'));
  const metadata = normalizeMetadata(readMetadata(replacements.metadataFile), observed);
  return { task: task.id, arm, repetition, runnerExitCode: runner.status,
    runnerError: runner.error?.code ?? null, runnerSignal: runner.signal ?? null, durationMs,
    hiddenAccepted: observed.acceptance.passed, originalTestPassed: observed.visible.passed,
    regressions: baseline.regression.passed && !observed.regression.passed ? 1 : 0,
    changedFiles: changedFiles(before, snapshot(workspace)), ...metadata,
    evidence: path.relative(repo, root),
    fixtureDigest: digest(readFileSync(path.join(here, 'fixtures', task.id, 'module.mjs'))) };
}

function validateOptions(config, selectedTasks, arms, repetitions) {
  if (!config.command || !Array.isArray(config.args) || config.args.some(arg => typeof arg !== 'string')) {
    throw new Error('runner config requires command and string args');
  }
  if (!Number.isSafeInteger(repetitions) || repetitions < 1) throw new Error('runs must be a positive integer');
  if (!selectedTasks.length || selectedTasks.some(id => !tasks.some(task => task.id === id))) {
    throw new Error('select known task IDs');
  }
  if (!arms.length || arms.some(arm => !['bare', 'reference', 'proofwork'].includes(arm))) {
    throw new Error('select bare, reference or proofwork arms');
  }
  if (arms.includes('reference') && !config.referenceContextPath) {
    throw new Error('reference arm needs local context path');
  }
}

export function runEvaluation(config, options = {}) {
  const selectedTasks = options.tasks ?? tasks.map(task => task.id);
  const arms = options.arms ?? ['bare', 'reference', 'proofwork'];
  const repetitions = options.runs ?? 3;
  validateOptions(config, selectedTasks, arms, repetitions);
  const runRoot = path.resolve(options.out ?? path.join(repo, '.engineering-team/ab'));
  mkdirSync(runRoot, { recursive: true });
  const rows = [];
  const baselines = Object.fromEntries(selectedTasks.map(id => {
    const task = tasks.find(candidate => candidate.id === id);
    const observed = verifyTask(path.join(here, 'fixtures', id), task, path.join(runRoot, `baseline-${id}`));
    if (observed.visible.passed || observed.acceptance.passed || !observed.regression.passed) {
      throw new Error(`fixture ${id} needs failing behavior/acceptance and passing regression checks`);
    }
    return [id, observed];
  }));
  for (const id of selectedTasks) for (const arm of arms)
    for (let repetition = 1; repetition <= repetitions; repetition++) {
    rows.push(executeRun(tasks.find(task => task.id === id), arm, repetition, config, runRoot, baselines[id]));
    writeJson(path.join(runRoot, 'results.json'), { schemaVersion: 1, rows });
    if (rows.at(-1).runnerExitCode !== 0 && !config.continueOnRunnerFailure) return { rows, interrupted: true };
  }
  return { rows, interrupted: false };
}

export function summarize(rows) {
  return [...new Set(rows.map(row => row.arm))].map(arm => {
    const selected = rows.filter(row => row.arm === arm);
    const durations = selected.map(row => row.durationMs).sort((left, right) => left - right);
    const midpoint = Math.floor(durations.length / 2);
    const medianMs = durations.length % 2 ? durations[midpoint]
      : (durations[midpoint - 1] + durations[midpoint]) / 2;
    const tokenTotal = selected.every(row => row.tokens)
      ? selected.reduce((total, row) => total + row.tokens.input + row.tokens.output, 0) : null;
    return { arm, runs: selected.length, hiddenAccepted: selected.filter(row => row.hiddenAccepted).length,
      regressions: selected.reduce((total, row) => total + row.regressions, 0), medianMs,
      tokenTotal, filesChanged: selected.reduce((total, row) => total + row.changedFiles.length, 0),
      contradictedAcceptanceClaims: selected.filter(row => row.claimsMatched === false).length,
      unreviewedNarratives: selected.length };
  });
}

function cliOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index].startsWith('--') || !args[index + 1]) throw new Error('options need --name value pairs');
    options[args[index].slice(2)] = args[index + 1];
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = cliOptions(process.argv.slice(2));
    const result = runEvaluation(readJson(options.config), { tasks: options.tasks?.split(','),
      arms: options.arms?.split(','),
      runs: options.runs === undefined ? undefined : Number(options.runs), out: options.out });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = result.interrupted ? 1 : 0;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
