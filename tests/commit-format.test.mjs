import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkMessage, checkRange, configuredCommitFormat } from '../scripts/check-commits.mjs';

const proofwork = 'Change export\n\nMajor features\nNone\n\nMinor features\nPreserve the final page.\n';
const git = (repo, args) => spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true });
async function fixture() {
  const repo = await mkdtemp(path.join(tmpdir(), 'proofwork-commit-policy-'));
  for (const args of [['init'], ['config', 'user.name', 'Fixture'],
    ['config', 'user.email', 'fixture@example.invalid'], ['commit', '--allow-empty', '-m', 'Free-form message']])
    assert.equal(git(repo, args).status, 0);
  return repo;
}
const configure = (repo, commitFormat) => writeFile(path.join(repo, '.proofwork.json'), JSON.stringify({ commitFormat }));

test('absent or off project policy performs no message enforcement or history rewrite', async () => {
  const repo = await fixture();
  try {
    const before = git(repo, ['rev-parse', 'HEAD']).stdout;
    assert.equal(configuredCommitFormat(repo), 'off'); assert.deepEqual(checkRange(repo, 'HEAD'), []);
    await configure(repo, 'off'); assert.deepEqual(checkRange(repo, 'HEAD'), []);
    assert.equal(git(repo, ['rev-parse', 'HEAD']).stdout, before);
    assert.deepEqual(checkMessage('Any existing subject', 'off'), []);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('Proofwork sections are required only under the explicit Proofwork policy', async () => {
  const repo = await fixture();
  try {
    await configure(repo, 'proofwork'); assert.equal(configuredCommitFormat(repo), 'proofwork');
    assert.equal(checkRange(repo, 'HEAD')[0].errors.length, 2);
    assert.equal(git(repo, ['commit', '--allow-empty', '-m', proofwork]).status, 0);
    assert.deepEqual(checkRange(repo, 'HEAD~1..HEAD')[0].errors, []);
    assert.deepEqual(checkMessage(proofwork), []);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('conventional policy accepts typed subjects and rejects unstructured subjects', async () => {
  const repo = await fixture();
  try {
    await configure(repo, 'conventional'); assert.equal(checkRange(repo, 'HEAD')[0].errors.length, 1);
    for (const message of ['fix: preserve export order', 'FEAT(parser)!: reject invalid input',
      'custom-type: describe the actual change', 'docs: clarify installation\n\nFurther context.'])
      assert.deepEqual(checkMessage(message, 'conventional'), []);
    for (const message of ['', 'Fix the export', 'fix:no separator space', 'fix: ', 'fix(): invalid scope',
      'fix: valid subject\nbody without blank line']) assert.ok(checkMessage(message, 'conventional').length);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('malformed and unsupported configured policies fail closed', async () => {
  const repo = await fixture();
  try {
    for (const commitFormat of ['automatic', true, null, 42]) {
      await configure(repo, commitFormat); assert.throws(() => checkRange(repo, 'HEAD'), /commitFormat/);
    }
    await writeFile(path.join(repo, '.proofwork.json'), '{');
    assert.throws(() => configuredCommitFormat(repo), /JSON/);
    assert.throws(() => checkMessage('fix: change', 'unknown'), /commitFormat/);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const checker = fileURLToPath(new URL('../scripts/check-commits.mjs', import.meta.url));
function cli(repo, range) {
  return spawnSync(process.execPath, [checker, '--repo', repo, '--range', range],
    { encoding: 'utf8', windowsHide: true });
}
test('CLI reports disabled policy explicitly and nested paths honor opted-in root policy', async () => {
  const repo = await fixture();
  try {
    const disabled = cli(repo, 'HEAD'); assert.equal(disabled.status, 0);
    assert.deepEqual(JSON.parse(disabled.stdout), { format: 'off', enabled: false, commits: [] });
    const nested = path.join(repo, 'src'); await mkdir(nested);
    await configure(repo, 'conventional'); assert.equal(configuredCommitFormat(nested), 'conventional');
    const enabled = cli(nested, 'HEAD'); assert.equal(enabled.status, 1);
    const report = JSON.parse(enabled.stdout); assert.equal(report.enabled, true);
    assert.equal(report.format, 'conventional'); assert.equal(report.commits[0].errors.length, 1);
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('unrelated configuration defaults off while malformed objects and unsafe ranges remain errors', async () => {
  const repo = await fixture();
  try {
    await writeFile(path.join(repo, '.proofwork.json'), JSON.stringify({ maxFileLines: null }));
    assert.deepEqual(checkRange(repo, 'HEAD'), []);
    assert.equal(checkRange(repo, 'HEAD', 'conventional')[0].errors.length, 1);
    assert.throws(() => checkRange(repo, '--all'), /valid explicit/);
    for (const config of ['null', '[]']) {
      await writeFile(path.join(repo, '.proofwork.json'), config);
      assert.throws(() => configuredCommitFormat(repo), /configuration must be an object/);
    }
  } finally { await rm(repo, { recursive: true, force: true }); }
});

test('non-Git targets can read local opt-in without changing any Git configuration', async () => {
  const repo = await mkdtemp(path.join(tmpdir(), 'proofwork-commit-config-'));
  try {
    assert.equal(configuredCommitFormat(repo), 'off');
    await configure(repo, 'proofwork'); assert.equal(configuredCommitFormat(repo), 'proofwork');
    assert.throws(() => checkRange(repo, 'HEAD'), /not a git repository/i);
  } finally { await rm(repo, { recursive: true, force: true }); }
});
