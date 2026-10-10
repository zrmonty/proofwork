import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execute } from '../scripts/proofwork.mjs';

async function inventory(root, directory = '') {
  const files = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await inventory(root, relative));
    else {
      const file = path.join(root, relative), metadata = await stat(file);
      files.push([relative, (await readFile(file)).toString('base64'), metadata.mtimeMs, metadata.mode]);
    }
  }
  return files.sort((left, right) => left[0].localeCompare(right[0]));
}
async function fixture(claimed = false) {
  const repo = await mkdtemp(path.join(tmpdir(), 'proofwork-preflight-'));
  const options = { repo, run: 'run', owner: 'owner', objective: 'check', revision: 'r1', criteria: 'works' };
  await writeFile(path.join(repo, 'source.txt'), 'source');
  await execute('init', options);
  const input = path.join(repo, '.engineering-team/input.json');
  async function record(command, value, extra = {}) {
    await writeFile(input, JSON.stringify(value));
    return execute(command, { ...options, input, ...extra });
  }
  await record('assign', { id: 'task', objective: 'check', files: ['source.txt'], revision: 'r1' });
  await record('result', { id: 'task', status: 'reviewed', revision: 'r1', summary: 'checked' });
  const artifact = '.engineering-team/proof.json';
  if (claimed) await writeFile(path.join(repo, artifact), 'manual proof');
  await record('evidence', { id: 'proof', criterion: 'works', artifact,
    revision: 'r1', command: 'check', environment: 'fixture', observed: 'check result', passed: true },
  claimed ? {} : { command: `"${process.execPath}" -e "process.exit(0)"` });
  return { repo, options, record, file: path.join(repo, '.engineering-team/runs/run/state.json') };
}
async function unchangedPreflight(context, extra = {}) {
  const before = await inventory(context.repo);
  const result = await execute('preflight', { ...context.options, ...extra });
  assert.deepEqual(await inventory(context.repo), before, 'preflight must never mutate filesystem');
  return result;
}

test('ready and completed runs receive identical read-only readiness checks even with a lock', async () => {
  const context = await fixture();
  try {
    const lock = path.join(path.dirname(context.file), 'write.lock');
    await writeFile(lock, 'unverified lock; do not touch');
    assert.deepEqual(await unchangedPreflight(context), { ready: true, reasons: [] });
    await rm(lock);
    await execute('complete', context.options);
    assert.deepEqual(await unchangedPreflight(context), { ready: true, reasons: [] });
  } finally { await rm(context.repo, { recursive: true, force: true }); }
});

for (const [name, mutate, expected] of [
  ['invalid owner', async () => {}, /coordinator owner/],
  ['changed source', async context => writeFile(path.join(context.repo, 'source.txt'), 'changed'), /identity changed/],
  ['latest failed evidence', async context => context.record('evidence', {
    id: 'failed', criterion: 'works', revision: 'r1', artifact: '.engineering-team/failed.json',
    command: 'check', environment: 'fixture', observed: 'failed', passed: false,
  }, { command: `"${process.execPath}" -e "process.exit(1)"` }), /latest observation/],
  ['tampered artifact', async context => writeFile(path.join(context.repo, '.engineering-team/proof.json'), 'tampered'),
    /artifact changed/],
  ['open material finding', async context => context.record('finding', {
    id: 'issue', summary: 'required repair', material: true, status: 'open',
  }), /material finding/],
  ['outstanding effect', async context => context.record('checkpoint', { outstandingEffects: ['uncertain push'] }),
    /outstanding effects/],
  ['stale revision', async () => {}, /revision differs/],
  ['stale evidence snapshot', async context => {
    const state = JSON.parse(await readFile(context.file, 'utf8'));
    state.evidence[0].snapshot.dirtyDigest = 'older';
    await writeFile(context.file, JSON.stringify(state));
  }, /stale evidence identity/],
]) {
  test(`preflight rejects ${name} without writing`, async () => {
    const context = await fixture();
    try {
      await mutate(context);
      const extra = name === 'invalid owner' ? { owner: 'intruder' }
        : name === 'stale revision' ? { revision: 'r2' } : {};
      const result = await unchangedPreflight(context, extra);
      assert.equal(result.ready, false);
      assert.match(result.reasons.join('; '), expected);
    } finally { await rm(context.repo, { recursive: true, force: true }); }
  });
}

test('claimed evidence requires an explicit boolean override for preflight and completion', async () => {
  const context = await fixture(true);
  try {
    for (const override of [undefined, false, 'true']) {
      const result = await unchangedPreflight(context, { 'allow-claimed': override });
      assert.equal(result.ready, false); assert.match(result.reasons.join(), /claimed/);
    }
    assert.deepEqual(await unchangedPreflight(context, { 'allow-claimed': true }), { ready: true, reasons: [] });
    await assert.rejects(execute('complete', context.options), /claimed/);
  } finally { await rm(context.repo, { recursive: true, force: true }); }
});

test('malformed and missing states return reasons without creating directories or backups', async () => {
  const repo = await mkdtemp(path.join(tmpdir(), 'proofwork-preflight-invalid-'));
  const options = { repo, run: 'missing', owner: 'owner', revision: 'r1' };
  try {
    const context = { repo, options };
    assert.equal((await unchangedPreflight(context)).ready, false);
    const directory = path.join(repo, '.engineering-team/runs/missing');
    await mkdir(directory, { recursive: true });
    for (const value of ['{bad json', 'null', '{}', JSON.stringify({ schemaVersion: 1,
      run: 'missing', repo, owner: 'owner', phase: 'verifying', revision: 'r1',
      criteria: [], tasks: [], findings: [], evidence: [] })]) {
      await writeFile(path.join(directory, 'state.json'), value);
      const result = await unchangedPreflight(context);
      assert.equal(result.ready, false); assert.ok(result.reasons[0]);
    }
    assert.equal((await unchangedPreflight(context, { run: '../escape' })).ready, false);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('malformed completion collections are refused by the same core gates without writes', async () => {
  const context = await fixture();
  try {
    const baseline = JSON.parse(await readFile(context.file, 'utf8'));
    for (const patch of [
      { criteria: [] }, { criteria: ['works', 'works'] }, { criteria: [' '] }, { criteria: 1 },
      { tasks: [null] }, { tasks: 'invalid' }, { findings: [null] }, { evidence: [null] },
      { outstandingEffects: 'unknown' }, { tasks: [{ status: 'reviewed' }] },
    ]) {
      await writeFile(context.file, JSON.stringify({ ...baseline, ...patch }));
      const result = await unchangedPreflight(context);
      assert.equal(result.ready, false, JSON.stringify(patch));
      assert.match(result.reasons.join(),
        /invalid completion|invalid checkpoint|invalid outstanding|unreviewed task|must be a text array/);
    }
    await writeFile(context.file, JSON.stringify(baseline));
    const absentOwner = await unchangedPreflight(context, { owner: '' });
    assert.equal(absentOwner.ready, false); assert.match(absentOwner.reasons.join(), /owner must/);
    const absentRevision = await unchangedPreflight(context, { revision: '' });
    assert.equal(absentRevision.ready, false); assert.match(absentRevision.reasons.join(), /revision must/);
  } finally { await rm(context.repo, { recursive: true, force: true }); }
});
