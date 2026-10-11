import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkPackageParity } from '../scripts/check-package-parity.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
test('CI package parity rejects newly generated untracked references', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-parity-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const git = args => spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
  assert.equal(git(['init', '--quiet']).status, 0);
  for (const host of ['codex', 'claude-code']) {
    await mkdir(path.join(repo, 'packages', host, 'skills/example/references'), { recursive: true });
    await writeFile(path.join(repo, 'packages', host, 'README.md'), 'baseline');
  }
  assert.equal(git(['add', '.']).status, 0);
  assert.equal(git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
    'commit', '--quiet', '-m', 'baseline']).status, 0);
  const workflow = await readFile(path.join(repository, '.github/workflows/check.yml'), 'utf8');
  const command = /name: Check generated package parity\s+run: ([^\r\n]+)/.exec(workflow)[1];
  const run = () => {
    if (command.startsWith('git ')) return git(command.slice(4).split(' '));
    assert.equal(command, 'node scripts/check-package-parity.mjs');
    return spawnSync(process.execPath, [path.join(repository, 'scripts/check-package-parity.mjs')],
      { encoding: 'utf8', cwd: repo });
  };
  assert.equal(run().status, 0);
  for (const host of ['codex', 'claude-code']) {
    await writeFile(path.join(repo, 'packages', host, 'skills/example/references/new-reference.md'), 'new');
  }
  assert.equal(git(['diff', '--exit-code', '--', 'packages', '.claude-plugin/marketplace.json']).status, 0);
  const result = run();
  assert.equal(result.status, 1, 'CI must reject untracked generated files');
  assert.match(result.stdout + result.stderr, /new-reference/);
});

test('parity detects staged, modified, deleted and marketplace files but ignores unrelated work', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-parity-status-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const git = args => {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  };
  git(['init', '--quiet']);
  await mkdir(path.join(repo, 'packages/codex'), { recursive: true });
  await mkdir(path.join(repo, '.claude-plugin'));
  const generated = path.join(repo, 'packages/codex/README.md');
  const marketplace = path.join(repo, '.claude-plugin/marketplace.json');
  await writeFile(generated, 'baseline');
  await writeFile(marketplace, '{}');
  git(['add', '.']);
  git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
    'commit', '--quiet', '-m', 'baseline']);
  await writeFile(path.join(repo, 'unrelated.md'), 'unrelated');
  assert.deepEqual(checkPackageParity(repo), { passed: true, changes: [] });
  await writeFile(generated, 'modified');
  assert.equal(checkPackageParity(repo).passed, false);
  git(['add', 'packages']);
  assert.equal(checkPackageParity(repo).passed, false);
  git(['reset', '--hard', 'HEAD']);
  await rm(generated);
  assert.equal(checkPackageParity(repo).passed, false);
  git(['reset', '--hard', 'HEAD']);
  await writeFile(marketplace, '{"new": true}');
  assert.equal(checkPackageParity(repo).passed, false);
});

test('parity fails closed when the Git checkout cannot be inspected', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw-parity-nongit-'));
  t.after(() => rm(repo, { recursive: true, force: true }));
  assert.throws(() => checkPackageParity(repo));
  const result = spawnSync(process.execPath, [path.join(repository, 'scripts/check-package-parity.mjs'), repo],
    { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /git|repository/i);
});
