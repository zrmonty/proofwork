import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { executeEvidence, redact } from '../scripts/runtime-evidence.mjs';
import { execute } from '../scripts/proofwork.mjs';

test('redaction covers bearer, cloud credentials, flags and quoted secret values', () => {
  for (const secret of ['Authorization: Bearer abc.def-secret', 'AKIA1234567890ABCDEF',
    'ASIA1234567890ABCDEF', 'AIza' + 'a'.repeat(35), '--password "two words"',
    '--password=\'two words\'', '"api_key": "two words"', "secret='two words'",
    'aws_secret_access_key=cloud-secret', 'AccountKey=cloud-secret', 'private_key="two words"',
    'token="escaped\\\" secret"']) {
    const result = redact(secret);
    assert.match(result, /REDACTED/, secret);
    assert.doesNotMatch(result, /two words|cloud-secret|abc\.def-secret|escaped|1234567890ABCDEF|a{35}/);
  }
  assert.equal(redact('The parser has two words.'), 'The parser has two words.');
});

test('evidence CLI options pass the deadline through and persist a failing observation', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw evidence options '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const options = { repo, run: 'run', owner: 'owner', objective: 'Check timeout', revision: 'r1', criteria: 'works' };
  await execute('init', options);
  const input = path.join(repo, '.engineering-team/input.json');
  await writeFile(input, JSON.stringify({ id: 'timeout', criterion: 'works', revision: 'r1',
    artifact: '.engineering-team/timeout.json', command: 'probe', environment: 'fixture', observed: 'pending',
    passed: true }));
  const state = await execute('evidence', { ...options, input, 'timeout-ms': '100',
    command: `"${process.execPath}" -e "setInterval(()=>{},1000)"` });
  assert.equal(state.evidence[0].timedOut, true);
  assert.equal(state.evidence[0].passed, false);
  assert.equal(state.evidence[0].observed, 'command timed out');
});

test('executed evidence times out and never reports a timeout as passed', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw evidence deadline '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const artifact = path.join(repo, 'result.json');
  const started = performance.now();
  const result = await executeEvidence({}, `"${process.execPath}" -e "setInterval(()=>{},1000)"`,
    repo, artifact, 100);
  assert.equal(result.timedOut, true);
  assert.equal(result.passed, false);
  assert.equal(result.timeoutMs, 100);
  assert.ok(performance.now() - started < 10000);
  assert.equal(JSON.parse(await readFile(artifact, 'utf8')).timedOut, true);
  for (const invalid of [0, -1, NaN, Infinity, 3600001, 'nope']) {
    await assert.rejects(executeEvidence({}, 'echo invalid', repo, path.join(repo, 'invalid.json'), invalid), /timeout/);
  }
});
