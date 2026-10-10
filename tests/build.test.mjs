import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLinks } from '../scripts/build.mjs';
import { mkdtemp, writeFile, readFile, cp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

test('build refuses to ship packages missing required legal and authorship files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'proofwork-build-legal-'));
  const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  try {
    for (const entry of ['scripts', 'shared', 'adapters', 'docs/skill-specs', 'package.json', 'LICENSE', 'NOTICE.md', 'UPSTREAM.md']) {
      await cp(path.join(repository, entry), path.join(root, entry), { recursive: true });
    }
    for (const name of ['LICENSE', 'NOTICE.md', 'UPSTREAM.md']) {
      const source = await readFile(path.join(root, name));
      await rm(path.join(root, name));
      const result = spawnSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { encoding: 'utf8', windowsHide: true });
      assert.equal(result.status, 1, `missing ${name} must fail the build`);
      assert.match(result.stderr, new RegExp(name.replace('.', '\\.')));
      await writeFile(path.join(root, name), source);
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});
