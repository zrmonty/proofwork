import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { countLines, checkFileLines } from '../scripts/check-file-lines.mjs';

test('line counting includes comments and blanks without a phantom trailing line', () => {
  assert.equal(countLines(''),0);
  assert.equal(countLines('// comment\n\ncode\n'),3);
  assert.equal(countLines('a\r\nb\r\n'),2);
  assert.equal(countLines('a\rb'),2);
  assert.equal(countLines('last line without newline'),1);
});
test('500 passes and 501 fails across tracked, untracked and additionally inventoried code', async () => {
  const root=await mkdtemp(path.join(tmpdir(),'proofwork-lines-'));
  const git=(...args)=>assert.equal(spawnSync('git',['-C',root,...args],{encoding:'utf8'}).status,0);
  try {
    git('init');
    await writeFile(path.join(root,'tracked.py'),'pass\n'.repeat(500));
    await writeFile(path.join(root,'.gitignore'),'custom\n');
    git('add','tracked.py','.gitignore');
    assert.equal((await checkFileLines(root)).passed,true);
    await writeFile(path.join(root,'new.rs'),'// code\n'.repeat(501));
    assert.deepEqual((await checkFileLines(root)).violations,[{path:'new.rs',lines:501}]);
    await writeFile(path.join(root,'custom'),'code\n'.repeat(501));
    assert.equal((await checkFileLines(root,['custom'])).violations.length,2);
    assert.equal((await checkFileLines(root,[])).violations.length,1);
    assert.equal(spawnSync(process.execPath,['scripts/check-file-lines.mjs','--repo',root],{encoding:'utf8'}).status,1);
    assert.equal(spawnSync(process.execPath,['scripts/check-file-lines.mjs','--repo',root,'--limit','501'],{encoding:'utf8'}).status,1);
    await assert.rejects(checkFileLines(root,['../outside']),/inventory/);
  } finally { await rm(root,{recursive:true,force:true}); }
});
