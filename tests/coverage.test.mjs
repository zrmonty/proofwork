import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkCoverage } from '../scripts/check-coverage.mjs';

const inventory = ['src/domain.js', 'src/boundary.js'];
const report = () => ({schemaVersion:1,revision:'fixture-v1',tool:'fixture exporter',files:[
  {path:inventory[0],lines:{covered:95,total:100},branches:{covered:19,total:20}},
  {path:inventory[1],lines:{covered:95,total:100},branches:{covered:0,total:0}}
]});

test('coverage gate evaluates separate exact ratios and preserves stricter thresholds', () => {
  assert.equal(checkCoverage(report(),inventory).passed,true);
  const below = report();
  below.files[0].branches.covered = 18;
  assert.equal(checkCoverage(below,inventory).passed,false);
  const rounded = report();
  rounded.files[0].lines = {covered:949,total:1000};
  rounded.files[1].lines = {covered:0,total:0};
  assert.equal(checkCoverage(rounded,inventory).passed,false);
  assert.equal(checkCoverage(report(),inventory,98).passed,false);
  assert.throws(() => checkCoverage(report(),inventory,94),/threshold/);
});

test('coverage inventory prevents omitted files and unsupported metrics from passing', () => {
  for (const modify of [r => r.files.pop(),r => r.files.push({...r.files[0]}),r => delete r.files[0].branches,r => r.files[0].path='../escape.js',r => r.files[0].lines.covered=101,r => r.files[0].lines.total=NaN]) {
    const invalid = report(); modify(invalid);
    assert.throws(() => checkCoverage(invalid,inventory));
  }
  assert.throws(() => checkCoverage(report(),[]),/inventory/);
  assert.throws(() => checkCoverage(report(),[...inventory,'src/unimported.js']),/missing/);
  assert.throws(() => checkCoverage(report(),[inventory[0]]),/unexpected/);
  const empty = report();
  for (const file of empty.files) file.lines = {covered:0,total:0};
  assert.throws(() => checkCoverage(empty,inventory),/executable lines/);
});

test('coverage CLI returns failure for an actual below-gate artifact', async () => {
  const root = await mkdtemp(path.join(tmpdir(),'proofwork-coverage-'));
  try {
    const reportPath = path.join(root,'report.json');
    const inventoryPath = path.join(root,'inventory.json');
    await writeFile(inventoryPath,JSON.stringify(inventory));
    await writeFile(reportPath,JSON.stringify(report()));
    const args = ['scripts/check-coverage.mjs','--report',reportPath,'--inventory',inventoryPath];
    assert.equal(spawnSync(process.execPath,args,{encoding:'utf8'}).status,0);
    const failed = report(); failed.files[0].branches.covered=18;
    await writeFile(reportPath,JSON.stringify(failed));
    const result = spawnSync(process.execPath,args,{encoding:'utf8'});
    assert.equal(result.status,1);
    assert.equal(JSON.parse(result.stdout).passed,false);
  } finally { await rm(root,{recursive:true,force:true}); }
});
