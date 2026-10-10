import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { install } from '../scripts/install.mjs';
import { executeEvidence } from '../scripts/runtime-evidence.mjs';
import { execute } from '../scripts/proofwork.mjs';

async function fixture(t) {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw parity café '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  return repo;
}
test('both installer adapters execute a Node CLI entry with literal source arguments', async t => {
  const repo = await fixture(t);
  const cli = path.join(repo, 'fake host.cjs');
  const source = 'source café & $value ; "quoted"';
  await writeFile(cli, `const assert = require('node:assert/strict');
    const args = process.argv.slice(2);
    if (args[1] === 'marketplace') assert.equal(args[3], ${JSON.stringify(source)});
    const item = {id:'proofwork@proofwork-local',pluginId:'proofwork@proofwork-local',
      version:'0.35.0',enabled:true};
    console.log(JSON.stringify(args[1] === 'list' ? {installed:[item]} : {}));`);
  assert.equal(install({ host: 'codex', source, cli }).version, '0.35.0');
  const text = await readFile(cli, 'utf8');
  await writeFile(cli, text.replace('{installed:[item]}', '[item]'));
  assert.equal(install({ host: 'claude-code', source, cli }).version, '0.35.0');
});
test('direct evidence preserves argument bytes, exit codes, timeouts and spawn failures', async t => {
  const repo = await fixture(t);
  const values = ['café spaced', '& echo injected', '$HOME', '"quoted"', 'a\\b', ''];
  const argv = [process.execPath, '-e', 'process.stdout.write(JSON.stringify(process.argv.slice(1)))', ...values];
  const result = await executeEvidence({}, argv, repo, path.join(repo, 'ok.json'));
  assert.equal(result.passed, true);
  assert.match(result.command, /argument-array/);
  assert.equal(result.stdoutDigest, createHash('sha256').update(JSON.stringify(values)).digest('hex'));
  assert.equal(result.commandDigest, createHash('sha256').update(JSON.stringify(argv)).digest('hex'));
  const failed = await executeEvidence({}, [process.execPath, '-e', 'process.exit(7)'],
    repo, path.join(repo, 'failed.json'));
  assert.equal(failed.exitCode, 7); assert.equal(failed.passed, false);
  const timeout = await executeEvidence({}, [process.execPath, '-e', 'setInterval(()=>{},1000)'],
    repo, path.join(repo, 'timeout.json'), 100);
  assert.equal(timeout.timedOut, true); assert.equal(timeout.passed, false);
  await assert.rejects(executeEvidence({}, [path.join(repo, 'missing-host')],
    repo, path.join(repo, 'missing.json')), { code: 'ENOENT' });
  for (const bad of [[], [''], [1], ['node', null], ['node', '\0'], ['node', 'x'.repeat(32769)],
    Array(257).fill('node'), '', null, 'bad\0']) {
    await assert.rejects(executeEvidence({}, bad, repo, path.join(repo, 'invalid.json')), /invocation/);
  }
});
test('argv evidence integrates with run identity and rejects conflicting modes before execution', async t => {
  const repo = await fixture(t);
  const options = { repo, run: 'parity', owner: 'owner', objective: 'Portable check', revision: 'r1',
    criteria: 'works' };
  await execute('init', options);
  const input = path.join(repo, '.engineering-team/input.json');
  const argv = path.join(repo, '.engineering-team/argv.json');
  await writeFile(input, JSON.stringify({id:'portable',criterion:'works',revision:'r1',
    artifact:'.engineering-team/portable.json',command:'probe',environment:'fixture',observed:'pending',passed:false}));
  await writeFile(argv, JSON.stringify([process.execPath, '-e', 'process.exit(0)']));
  await assert.rejects(execute('evidence', {...options,input,argv,command:'echo nope'}), /choose/);
  await writeFile(argv, '{}');
  await assert.rejects(execute('evidence', {...options,input,argv}), /JSON array/);
  await writeFile(argv, JSON.stringify([process.execPath, '-e', 'process.exit(0)']));
  const state = await execute('evidence', {...options,input,argv});
  assert.equal(state.evidence[0].source, 'executed');
  assert.equal(state.evidence[0].passed, true);
  const observed = JSON.parse(await readFile(path.join(repo, '.engineering-team/portable.json'), 'utf8'));
  assert.equal(observed.exitCode, 0);
});
