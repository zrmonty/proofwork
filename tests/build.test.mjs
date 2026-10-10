import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLinks } from '../scripts/build.mjs';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('package reference validator rejects escaped and missing local links', async () => {
  const root = await mkdtemp(path.join(tmpdir(),'proofwork-build-'));
  try {
    await writeFile(path.join(root,'README.md'),'[missing](absent.md)');
    await assert.rejects(validateLinks(root),/missing/);
    await writeFile(path.join(root,'README.md'),'[escape](../outside.md)');
    await assert.rejects(validateLinks(root),/escape/);
    await writeFile(path.join(root,'README.md'),'[ok](guide.md) [official](https://example.com)');
    await writeFile(path.join(root,'guide.md'),'guide');
    await validateLinks(root);
  } finally { await rm(root,{recursive:true,force:true}); }
});
