import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir, hostname } from 'node:os';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { execute } from '../scripts/proofwork.mjs';

const createRepo = async () => mkdtemp(path.join(tmpdir(), 'proofwork-hardening-'));
const optionsFor = repo => ({ repo, run: 'hardening', owner: 'owner', objective: 'verify',
  revision: 'r1', criteria: 'works' });
async function record(repo, command, value, extra = {}) {
  const input = path.join(repo, '.engineering-team', 'input.json');
  await writeFile(input, JSON.stringify(value));
  return execute(command, { ...optionsFor(repo), input, ...extra });
}
const evidence = { id: 'observed', criterion: 'works', revision: 'r1', artifact: 'proof.txt',
  command: 'manual', environment: 'fixture', observed: 'claimed', passed: true };

test('manual evidence is explicitly claimed and needs completion override', async () => {
  const repo = await createRepo();
  try { await execute('init', optionsFor(repo)); await prepareCompletion(repo);
    await record(repo, 'checkpoint', {});
    const state = await record(repo, 'evidence', { ...evidence, source: 'executed', exitCode: 0 });
    assert.equal(state.evidence[0].source, 'claimed');
    await assert.rejects(execute('complete', optionsFor(repo)), /claimed/);
    await assert.rejects(execute('complete', { ...optionsFor(repo), 'allow-claimed': 'false' }), /claimed/);
    assert.equal((await execute('complete', { ...optionsFor(repo), 'allow-claimed': true })).phase, 'complete');
  } finally { await rm(repo, { recursive: true, force: true }); }
});
async function prepareCompletion(repo) {
  await writeFile(path.join(repo, 'proof.txt'), 'proof');
  await record(repo, 'assign', { id: 'task', objective: 'verify', files: ['src'], revision: 'r1' });
  await record(repo, 'result', { id: 'task', status: 'reviewed', revision: 'r1', summary: 'reviewed' });
}

test('executed evidence records actual exit and protects output secrets', async () => {
  const repo = await createRepo();
  try { await execute('init', optionsFor(repo));
    const command = `"${process.execPath}" -e "console.log('api_key=never-print-this');process.exit(7)"`;
    const state = await record(repo, 'evidence',
      { ...evidence, artifact: '.engineering-team/execution.json' }, { command });
    const item = state.evidence[0];
    assert.equal(item.source, 'executed'); assert.equal(item.exitCode, 7); assert.equal(item.passed, false);
    assert.ok(item.durationMs >= 0); assert.match(item.stdoutDigest, /^[a-f0-9]{64}$/);
    assert.ok(!JSON.stringify(state).includes('never-print-this'));
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('killed process lock requires explicit stale recovery', async () => {
  const repo = await createRepo();
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { windowsHide: true });
  try { await execute('init', optionsFor(repo));
    const lock = path.join(repo, '.engineering-team/runs/hardening/write.lock');
    await writeFile(lock, JSON.stringify({ pid: child.pid, host: hostname(), owner: 'child', at: Date.now() }));
    await assert.rejects(record(repo, 'checkpoint', { nextAction: 'wait' }), /being written/);
    await new Promise(resolve => { child.once('exit', resolve); child.kill(); });
    await assert.rejects(record(repo, 'checkpoint', { nextAction: 'recover' }), /stale lock/);
    const recovered = await record(repo, 'checkpoint', { nextAction: 'recover' }, { 'break-lock': true });
    assert.equal(recovered.nextAction, 'recover');
  } finally { child.kill(); await rm(repo, { recursive: true, force: true }); }
});

import { spawnSync } from 'node:child_process';
function git(repo, ...args) {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
async function gitFixture(repo) {
  git(repo, 'init', '--quiet'); git(repo, 'config', 'user.name', 'Fixture');
  git(repo, 'config', 'user.email', 'fixture@example.invalid');
  await writeFile(path.join(repo, '.gitignore'), '.engineering-team/\nignored.rs\n');
  await writeFile(path.join(repo, 'main.rs'), 'fn main() {}\n');
  git(repo, 'add', '.'); git(repo, 'commit', '--quiet', '-m', 'fixture');
  return git(repo, 'rev-parse', 'HEAD');
}

test('Git revision binding and ignored source changes cannot reuse passing observations', async () => {
  const repo = await createRepo();
  try {
    const revision = await gitFixture(repo), options = { ...optionsFor(repo), revision };
    await assert.rejects(execute('init', { ...options, revision: 'not-a-commit' }), /Git HEAD/);
    const state = await execute('init', options); assert.equal(state.ignoreHint, null);
    await writeFile(path.join(repo, 'ignored.rs'), 'pub const VALUE: u8 = 1;\n');
    const input = path.join(repo, '.engineering-team', 'input.json');
    await writeFile(input, JSON.stringify({ ...evidence, revision, artifact: '.engineering-team/proof.json' }));
    await assert.rejects(execute('evidence', { ...options, input,
      command: `"${process.execPath}" -e "process.exit(0)"` }), /differs from checkpoint/);
    await writeFile(input, '{}'); await execute('checkpoint', { ...options, input });
    await writeFile(input, JSON.stringify({ ...evidence, revision, artifact: '.engineering-team/proof-2.json' }));
    const observed = await execute('evidence', { ...options, input,
      command: `"${process.execPath}" -e "process.exit(0)"` });
    assert.equal(observed.evidence[0].passed, true);
    await writeFile(path.join(repo, 'ignored.rs'), 'pub const VALUE: u8 = 2;\n');
    await assert.rejects(execute('complete', options), /identity changed/);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('remote lock recovery is explicit and malformed locks remain untouched', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo));
    const lock = path.join(repo, '.engineering-team/runs/hardening/write.lock');
    await writeFile(lock, JSON.stringify({ pid: 123, host: 'verified-remote-host', owner: 'remote', at: Date.now() }));
    await assert.rejects(record(repo, 'checkpoint', {}), /another host/);
    await record(repo, 'checkpoint', { nextAction: 'recovered' }, { 'break-lock': true });
    await writeFile(lock, '{malformed');
    await assert.rejects(record(repo, 'checkpoint', {}, { 'break-lock': true }), /invalid lock/);
    assert.equal(await readFile(lock, 'utf8'), '{malformed');
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('successful actual evidence completes; later artifacts or stale identities cannot substitute', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo)); await prepareCompletion(repo);
    await record(repo, 'checkpoint', {});
    const observation = { ...evidence, artifact: '.engineering-team/actual.json' };
    const state = await record(repo, 'evidence', observation,
      { command: `"${process.execPath}" -e "process.exit(0)"` });
    assert.equal(state.evidence[0].passed, true);
    await writeFile(path.join(repo, observation.artifact), '{}');
    await assert.rejects(execute('complete', optionsFor(repo)), /artifact changed/);
    await record(repo, 'evidence', { ...observation, id: 'fresh', artifact: '.engineering-team/fresh.json' },
      { command: `"${process.execPath}" -e "process.exit(0)"` });
    const completed = await execute('complete', optionsFor(repo));
    assert.deepEqual(completed.claimedEvidence, []);
    await assert.rejects(record(repo, 'evidence', observation,
      { command: `"${process.execPath}" -e "process.exit(0)"` }), /immutable/);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

import { transition } from '../scripts/proofwork.mjs';
const emptyState = { owner: 'owner', phase: 'preparing', revision: 'r1', criteria: ['works'],
  tasks: [], evidence: [], findings: [] };
const assignment = { id: 'task', objective: 'verify', files: ['src'], revision: 'r1' };

test('untrusted aggregate records fail closed at public transition boundary', () => {
  const badRecords = [
    ['assign', { ...assignment, objective: '' }, /nonempty/],
    ['assign', { ...assignment, files: 'src' }, /path array/],
    ['result', { id: 'absent' }, /unknown task/],
    ['evidence', { ...evidence, criterion: 'absent' }, /unknown criterion/],
    ['evidence', { ...evidence, passed: 'true' }, /boolean/],
    ['finding', { id: 'f', summary: 'issue', material: 'yes', status: 'open' }, /invalid finding/],
    ['finding', { id: 'f', summary: 'issue', material: true, status: 'resolved' }, /resolution/],
    ['checkpoint', { phase: 'complete' }, /invalid phase/],
    ['checkpoint', { skills: 'Rust' }, /text array/],
    ['checkpoint', { outstandingEffects: [42] }, /text array/],
    ['checkpoint', { limits: [] }, /limits/],
    ['checkpoint', { playbook: 'other' }, /playbook/],
    ['checkpoint', null, /object/], ['checkpoint', [], /object/], ['constructor', {}, /unknown command/],
  ];
  for (const [command, record, message] of badRecords)
    assert.throws(() => transition(emptyState, command, record, 'owner'), message);
});

test('duplicate assignments and observations cannot overwrite ownership or evidence', () => {
  const assigned = transition(emptyState, 'assign', assignment, 'owner');
  assert.throws(() => transition(assigned, 'assign', assignment, 'owner'), /already exists/);
  assert.throws(() => transition(assigned, 'result', { id: 'task', status: 'passed' }, 'owner'), /status/);
  const observed = transition(emptyState, 'evidence', evidence, 'owner');
  assert.throws(() => transition(observed, 'evidence', evidence, 'owner'), /already exists/);
  const resolved = transition(emptyState, 'finding', { id: 'f', summary: 'fixed', material: true,
    status: 'resolved', resolution: 'verified fixture' }, 'owner');
  assert.equal(resolved.findings[0].status, 'resolved');
  assert.throws(() => transition({ ...emptyState, phase: 'complete' }, 'checkpoint', {}, 'owner'), /immutable/);
});

test('outstanding effects and snapshot changes block completion after checkpoint refresh', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo)); await prepareCompletion(repo); await record(repo, 'checkpoint', {});
    await record(repo, 'evidence', evidence);
    await record(repo, 'checkpoint', { outstandingEffects: ['external delivery outcome unknown'] });
    await assert.rejects(execute('complete', { ...optionsFor(repo), 'allow-claimed': true }), /outstanding effects/);
    await writeFile(path.join(repo, 'new-source.ts'), 'export const version = 2;\n');
    await record(repo, 'checkpoint', { outstandingEffects: [] });
    await assert.rejects(execute('complete', { ...optionsFor(repo), 'allow-claimed': true }), /stale evidence identity/);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('a command that rewrites source cannot claim verification of the original checkpoint', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo));
    const command = `"${process.execPath}" -e "require('fs').writeFileSync('source.js','changed')"`;
    await assert.rejects(record(repo, 'evidence', { ...evidence, artifact: '.engineering-team/mutated.json' },
      { command }), /command changed codebase/);
    assert.equal((await execute('status', optionsFor(repo))).evidence.length, 0);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('initialization rejects missing or duplicate criteria and reports local ignore reminder', async () => {
  const repo = await createRepo();
  try {
    for (const criteria of [undefined, '', 'works,works'])
      await assert.rejects(execute('init', { ...optionsFor(repo), criteria }), /criteria/);
    const state = await execute('init', optionsFor(repo)); assert.match(state.ignoreHint, /gitignore/);
    assert.ok((await execute('route', { task: 'Explain parser' })).playbook);
    const routed = await execute('route', { task: 'Explain parser', files: 'parser.rs' });
    assert.ok(routed.skills.includes('rust-best-practices'));
  } finally { await rm(repo, { recursive: true, force: true }); }
});

import { acquireLock, releaseLock, diagnoseLock } from '../scripts/runtime-locks.mjs';
import { snapshotIdentity } from '../scripts/runtime-snapshot.mjs';
import { symlink, mkdir } from 'node:fs/promises';

test('lock metadata rejects invalid identities and release never deletes another writer lock', async () => {
  const repo = await createRepo(), lock = path.join(repo, 'lock');
  try {
    const invalid = { pid: -1, host: hostname(), owner: 'invalid', at: Date.now() };
    assert.equal(diagnoseLock(invalid).stale, false);
    await assert.rejects(acquireLock(path.join(repo, 'missing', 'lock'), 'owner'), /ENOENT/);
    const held = await acquireLock(lock, 'owner');
    await assert.rejects(acquireLock(lock, 'owner', true), /being written/);
    await writeFile(lock, 'replacement writer');
    await assert.rejects(releaseLock(lock, held), /ownership changed/);
    assert.equal(await readFile(lock, 'utf8'), 'replacement writer');
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('snapshot includes nested code and fails closed at symlink boundaries', async () => {
  const repo = await createRepo(), outside = await createRepo();
  try {
    await mkdir(path.join(repo, 'src')); await writeFile(path.join(repo, 'src', 'code.py'), 'VALUE = 1\n');
    const original = await snapshotIdentity(repo);
    await writeFile(path.join(repo, 'src', 'code.py'), 'VALUE = 2\n');
    assert.notEqual((await snapshotIdentity(repo)).dirtyDigest, original.dirtyDigest);
    await symlink(outside, path.join(repo, 'external'), 'junction');
    await assert.rejects(snapshotIdentity(repo), /symlinks/);
  } finally { await rm(repo, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); }
});

import { fileURLToPath } from 'node:url';
const runtimeScript = fileURLToPath(new URL('../scripts/proofwork.mjs', import.meta.url));
function cli(...args) {
  return spawnSync(process.execPath, [runtimeScript, ...args], { encoding: 'utf8', windowsHide: true });
}
test('CLI rejects duplicate or missing values and presents help without running commands', () => {
  for (const args of [['route', '--task'], ['route', '--task', '--files'], ['route', 'task', 'text'],
    ['route', '--task', 'one', '--task', 'two']]) assert.equal(cli(...args).status, 1);
  for (const args of [[], ['help'], ['--help']]) assert.match(cli(...args).stdout, /Proofwork local tools/);
});

test('executed observation files must stay in the local artifact directory before command launch', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo));
    await assert.rejects(record(repo, 'evidence', evidence,
      { command: `"${process.execPath}" -e "require('fs').writeFileSync('should-not-exist','ran')"` }),
      /artifact must be under/);
    await assert.rejects(readFile(path.join(repo, 'should-not-exist')), /ENOENT/);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('existing or missing-parent evidence output prevents command execution before side effects', async () => {
  const repo = await createRepo();
  try {
    await execute('init', optionsFor(repo));
    const artifact = '.engineering-team/existing.json';
    await writeFile(path.join(repo, artifact), 'keep original observation');
    const command = `"${process.execPath}" -e "require('fs').writeFileSync('must-not-run','ran')"`;
    await assert.rejects(record(repo, 'evidence', { ...evidence, artifact }, { command }), /EEXIST/);
    await assert.rejects(readFile(path.join(repo, 'must-not-run')), /ENOENT/);
    assert.equal(await readFile(path.join(repo, artifact), 'utf8'), 'keep original observation');
    await assert.rejects(record(repo, 'evidence',
      { ...evidence, artifact: '.engineering-team/missing-parent/observation.json' }, { command }), /ENOENT/);
    await assert.rejects(readFile(path.join(repo, 'must-not-run')), /ENOENT/);
    assert.equal((await execute('status', optionsFor(repo))).evidence.length, 0);
  } finally { await rm(repo, { recursive: true, force: true }); }
});
