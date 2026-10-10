import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execute } from '../scripts/proofwork.mjs';
import { readBinding } from '../scripts/hook-binding.mjs';

test('init binds a known host session and refuses conflicting or partial identities before writing', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw init binding '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const options = { repo, run: 'first', owner: 'owner', objective: 'Deliver parser',
    revision: 'r1', criteria: 'works', host: 'codex', session: 'session' };
  await execute('init', options);
  assert.equal((await readBinding(repo, 'codex', 'session')).run, 'first');
  await assert.rejects(execute('init', { ...options, run: 'second' }), /bound/);
  for (const extra of [{ host: undefined }, { session: undefined }, { host: 'unknown' },
    { session: '../escape' }, { owner: 'x'.repeat(257) }]) {
    await assert.rejects(execute('init', { ...options, run: 'invalid', ...extra }));
  }
  assert.deepEqual(await readdir(path.join(repo, '.engineering-team/runs')), ['first']);
});

test('init without host identity leaves ordinary runs unbound', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw plain init '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  await execute('init', { repo, run: 'run', owner: 'owner', objective: 'Check parser',
    revision: 'r1', criteria: 'works' });
  assert.equal(await readBinding(repo, 'claude-code', 'session'), null);
});
