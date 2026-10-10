import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { coverageInventory, verifyCoverage } from '../scripts/verify-coverage.mjs';

async function fixture(t, source, tests) {
  const repository = await mkdtemp(path.join(os.tmpdir(), 'proofwork-coverage-'));
  t.after(() => rm(repository, { recursive: true, force: true }));
  await mkdir(path.join(repository, 'scripts'));
  await mkdir(path.join(repository, 'tests'));
  if (source !== null) await writeFile(path.join(repository, 'scripts/value.mjs'), source);
  if (tests !== null) await writeFile(path.join(repository, 'tests/value.test.mjs'), tests);
  return repository;
}

const source = 'export const answer = () => 42;\n';
const passing = "import { answer } from '../scripts/value.mjs';\nif (answer() !== 42) throw Error('wrong answer');\n";

test('coverage inventories unimported production source independently', async t => {
  const repo = await fixture(t, source, passing);
  await writeFile(path.join(repo, 'scripts/unimported.mjs'), 'export const unseen = () => 7;\n');
  assert.deepEqual(await coverageInventory(repo), ['scripts/unimported.mjs', 'scripts/value.mjs']);
  await assert.rejects(verifyCoverage(repo), /missing|inventory|coverage/i);
});

test('actual Node LCOV passes both gates for the complete tiny target', async t => {
  const repo = await fixture(t, source, passing);
  const report = await verifyCoverage(repo);
  assert.equal(report.passed, true);
  assert.deepEqual(report.inventory, ['scripts/value.mjs']);
  assert.match(report.revision, /^scripts-sha256:/);
});

test('a failing test cannot be replaced by a favorable coverage ratio', async t => {
  const repo = await fixture(t, source, "throw Error('intentional failure');\n");
  await assert.rejects(verifyCoverage(repo), /test run failed/);
});

test('new production source during collection invalidates the inventory', async t => {
  const mutation = passing + "import { writeFileSync } from 'node:fs';\n" +
    "writeFileSync('scripts/new.mjs', 'export const unseen = () => 7;');\n";
  const repo = await fixture(t, source, mutation);
  await assert.rejects(verifyCoverage(repo), /scripts changed/);
});

test('empty source and test inventories are explicit failures', async t => {
  await assert.rejects(verifyCoverage(await fixture(t, null, passing)), /no production scripts/);
  await assert.rejects(verifyCoverage(await fixture(t, source, null)), /no tests discovered/);
});
