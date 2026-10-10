import test from 'node:test';
import assert from 'node:assert/strict';
import { checkMessage, checkRange } from '../scripts/check-commits.mjs';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('both feature sections must contain actual text or None', () => {
  assert.deepEqual(checkMessage('docs: explain setup\n\nMajor features\nNone\n\nMinor features\n- Explain local installation.\n'), []);
  assert.ok(checkMessage('feat: export\n\nMajor features\n- Export files.').some(x => x.includes('Minor')));
  assert.ok(checkMessage('fix: parser\n\nMajor features\n\nMinor features\n- Reject invalid input.').some(x => x.includes('empty')));
});

test('duplicate and fabricated-empty headings cannot satisfy sections', () => {
  assert.ok(checkMessage('feat: x\nMajor features\nNone\nMajor features\nNone\nMinor features\nNone').some(x => x.includes('once')));
  assert.ok(checkMessage('feat: x\nMajor features\n-\nMinor features\nNone').some(x => x.includes('empty')));
});

test('outgoing range checks real commit bodies and rejects invalid revisions', () => {
  const repo = mkdtempSync(join(tmpdir(), 'proofwork-commits-'));
  const git = (...args) => {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
  };
  try {
    git('init', '-b', 'main');
    git('config', 'user.name', 'Proofwork fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    writeFileSync(join(repo, 'note.txt'), 'fixture');
    git('add', 'note.txt');
    git('commit', '-m', 'docs: explain fixture\n\nMajor features\nNone\n\nMinor features\n- Explain fixture.');
    assert.equal(checkRange(repo, 'HEAD')[0].errors.length, 0);
    git('commit', '--allow-empty', '-m', 'docs: invalid message');
    assert.equal(checkRange(repo, 'HEAD~1..HEAD')[0].errors.length, 2);
    assert.throws(() => checkRange(repo, '--all'), /valid explicit/);
    assert.throws(() => checkRange(repo, 'does-not-exist'), /revision|argument/i);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
