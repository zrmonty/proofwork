import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink, utimes, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { snapshotIdentity } from '../scripts/runtime-snapshot.mjs';
import { execute } from '../scripts/proofwork.mjs';

const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], { windowsHide: true });
async function fixture(t) {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw snapshot '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  git(repo, 'init', '--quiet');
  await writeFile(path.join(repo, '.gitignore'), 'node_modules/\ncache/\n.engineering-team/\n');
  await writeFile(path.join(repo, 'tracked.js'), 'before');
  git(repo, 'add', '.');
  return repo;
}
test('ignored trees and their junctions do not affect snapshots, but tracked and untracked code do', async t => {
  const repo = await fixture(t);
  const original = await snapshotIdentity(repo);
  await mkdir(path.join(repo, 'node_modules'));
  await writeFile(path.join(repo, 'node_modules/cache'), 'ignored');
  await symlink(repo, path.join(repo, 'node_modules/link'), 'junction');
  assert.deepEqual(await snapshotIdentity(repo), original);
  await writeFile(path.join(repo, 'untracked.js'), 'new');
  assert.notDeepEqual(await snapshotIdentity(repo), original);
  await rm(path.join(repo, 'untracked.js'));
  await writeFile(path.join(repo, 'tracked.js'), 'after!');
  assert.notDeepEqual(await snapshotIdentity(repo), original);
  await rm(path.join(repo, 'tracked.js'));
  assert.notDeepEqual(await snapshotIdentity(repo), original);
});
test('symlink targets are hashed without following them in non-Git folders', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw snapshot link '));
  const outside = await mkdtemp(path.join(tmpdir(), 'pw outside '));
  t.after(async () => { await rm(repo, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); });
  await symlink(outside, path.join(repo, 'link'), 'junction');
  const original = await snapshotIdentity(repo);
  await writeFile(path.join(outside, 'ignored'), 'external');
  assert.deepEqual(await snapshotIdentity(repo), original);
  await rm(path.join(repo, 'link'));
  await symlink(repo, path.join(repo, 'link'), 'junction');
  assert.notDeepEqual(await snapshotIdentity(repo), original);
});
test('20,000 ignored files cost less than one second to snapshot', async t => {
  const repo = await fixture(t);
  await mkdir(path.join(repo, 'node_modules'));
  for (let offset = 0; offset < 20000; offset += 100) {
    await Promise.all(Array.from({ length: 100 }, (_, index) =>
      writeFile(path.join(repo, 'node_modules', `${offset + index}.js`), 'dependency')));
  }
  const started = performance.now();
  await snapshotIdentity(repo);
  const elapsed = performance.now() - started;
  t.diagnostic(`20000 ignored files snapshot: ${elapsed.toFixed(2)} ms`);
  assert.ok(elapsed < 1000, `snapshot took ${elapsed.toFixed(2)} ms`);
});

test('cached hashing detects same-size rewrites even when modification time is restored', async t => {
  const repo = await fixture(t), file = path.join(repo, 'tracked.js');
  const before = await stat(file), original = await snapshotIdentity(repo);
  assert.deepEqual(await snapshotIdentity(repo), original);
  await writeFile(file, 'change');
  await utimes(file, before.atime, before.mtime);
  assert.notDeepEqual(await snapshotIdentity(repo), original);
});

test('executed checks may write ignored caches without making evidence stale', async t => {
  const repo = await fixture(t);
  await mkdir(path.join(repo, 'cache'));
  const options = { repo, run: 'run', owner: 'owner', objective: 'Verify cache writes', revision: 'r1', criteria: 'works' };
  await execute('init', options);
  const input = path.join(repo, '.engineering-team/input.json');
  await writeFile(input, JSON.stringify({ id: 'check', criterion: 'works', revision: 'r1',
    artifact: '.engineering-team/check.json', command: 'cache check', environment: 'fixture',
    observed: 'pending', passed: false }));
  const state = await execute('evidence', { ...options, input,
    command: `"${process.execPath}" -e "require('fs').writeFileSync('cache/result','generated')"` });
  assert.equal(state.evidence[0].passed, true);
  assert.doesNotMatch(JSON.stringify(await execute('preflight', options)), /identity changed|stale evidence/);
});

test('initialized submodule content contributes to the parent identity', async t => {
  const repo = await fixture(t), submodule = path.join(repo, 'submodule');
  await mkdir(submodule);
  git(submodule, 'init', '--quiet');
  await writeFile(path.join(submodule, 'source.js'), 'first');
  git(submodule, 'add', '.');
  git(submodule, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'fixture');
  const head = git(submodule, 'rev-parse', 'HEAD').toString().trim();
  git(repo, 'update-index', '--add', '--cacheinfo', `160000,${head},submodule`);
  const original = await snapshotIdentity(repo);
  await writeFile(path.join(submodule, 'source.js'), 'other');
  assert.notDeepEqual(await snapshotIdentity(repo), original);
});
