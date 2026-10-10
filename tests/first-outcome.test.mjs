import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execute } from '../scripts/proofwork.mjs';

test('invoice export failure resumes on the same run and verifies the actual delivered pages', async t => {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw first outcome '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const options = { repo, run: 'invoice', owner: 'coordinator', revision: 'local-v1',
    objective: 'Preserve every exported invoice page', criteria: 'all-pages' };
  const exporter = path.join(repo, 'export.cjs');
  const program = limit => `const fs=require('node:fs');const pages=['page-1','page-2','page-3'];
fs.writeFileSync('invoice.json',JSON.stringify(pages.slice(0,${limit})));
require('node:assert/strict').deepEqual(JSON.parse(fs.readFileSync('invoice.json')),pages);`;
  await writeFile(exporter, program('-1'));
  await execute('init', options);
  const record = async (command, body, extra = {}) => {
    const input = path.join(repo, '.engineering-team/input.json');
    await writeFile(input, JSON.stringify(body));
    return execute(command, { ...options, input, ...extra });
  };
  await record('assign', { id: 'repair', objective: options.objective, files: ['export.cjs'], revision: 'local-v1' });
  const observation = id => ({ id, criterion: 'all-pages', revision: 'local-v1',
    artifact: `.engineering-team/${id}.json`, command: 'node export.cjs', environment: 'local fixture',
    observed: 'Exported JSON compared with all input pages', passed: true });
  const command = `"${process.execPath}" export.cjs`;
  // Running the export creates its delivery file; checkpoint that artifact before recording stable evidence.
  await writeFile(path.join(repo, 'invoice.json'), JSON.stringify(['page-1', 'page-2']));
  await record('checkpoint', {});
  const failed = await record('evidence', observation('before'), { command });
  assert.equal(failed.evidence.at(-1).passed, false);
  await record('checkpoint', { phase: 'stopped-incomplete', nextAction: 'Fix final-page slicing; rerun export' });
  assert.match((await execute('status', options)).nextAction, /final-page/);
  await writeFile(exporter, program('pages.length'));
  await writeFile(path.join(repo, 'invoice.json'), JSON.stringify(['page-1', 'page-2', 'page-3']));
  assert.equal((await execute('preflight', options)).ready, false);
  await record('checkpoint', { phase: 'executing', nextAction: 'Verify every exported page' });
  const checked = await record('evidence', observation('after'), { command });
  assert.equal(checked.evidence.at(-1).passed, true);
  assert.equal(checked.evidence[0].passed, false);
  await record('result', { id: 'repair', status: 'reviewed', revision: 'local-v1',
    summary: 'Inspected slicing change and compared delivered pages' });
  assert.equal((await execute('preflight', options)).ready, true);
  assert.equal((await execute('complete', options)).phase, 'complete');
  assert.deepEqual(JSON.parse(await readFile(path.join(repo, 'invoice.json'), 'utf8')),
    ['page-1', 'page-2', 'page-3']);
});
