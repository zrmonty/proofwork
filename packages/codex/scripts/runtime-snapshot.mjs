import { readdir, lstat, readlink } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function git(repo, args) {
  try { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true,
    stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
}
const cache = new Map();
const metadata = stat => [stat.size, stat.mtimeNs, stat.ctimeNs, stat.ino, stat.dev, stat.mode].join(':');
const excluded = file => ['.git', '.engineering-team'].includes(file.split('/')[0]);
function gitFiles(repo) {
  if (git(repo, ['rev-parse', '--is-inside-work-tree']) !== 'true') return null;
  try {
    const output = execFileSync('git', ['-C', repo, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    return [...new Set(output.split('\0').filter(file => file && !excluded(file)))];
  } catch { throw new Error('Git snapshot inventory unavailable; cannot verify codebase identity'); }
}
async function collectFiles(repo, directory = '', files = []) {
  for (const entry of await readdir(path.join(repo, directory), { withFileTypes: true })) {
    if (!directory && ['.git', '.engineering-team'].includes(entry.name)) continue;
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(repo, relative, files);
    else files.push(relative);
  }
  return files;
}
async function fileIdentity(repo, relative) {
  const file = path.join(repo, relative);
  let stat;
  try { stat = await lstat(file, { bigint: true }); }
  catch (error) { if (error.code === 'ENOENT') return [relative, 'missing']; throw error; }
  if (stat.isSymbolicLink()) return [relative, 'symlink', await readlink(file)];
  if (stat.isDirectory()) return [relative, 'submodule', await snapshot(file, 1)];
  if (!stat.isFile()) throw new Error('snapshot contains unsupported file type');
  const signature = metadata(stat), cached = cache.get(file);
  let hash = cached?.signature === signature ? cached.hash : null;
  if (!hash) {
    const streamHash = createHash('sha256');
    for await (const chunk of createReadStream(file)) streamHash.update(chunk);
    if (metadata(await lstat(file, { bigint: true })) !== signature)
      throw new Error('file changed while computing snapshot; retry after writes settle');
    hash = streamHash.digest('hex');
    cache.set(file, { signature, hash });
    if (cache.size > 10000) cache.delete(cache.keys().next().value);
  }
  return [relative, Number(stat.mode), hash];
}
async function snapshot(repo, workers) {
  const files = (gitFiles(repo) ?? await collectFiles(repo)).sort();
  const content = new Array(files.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(workers, files.length) }, async () => {
    while (next < files.length) {
      const index = next++;
      content[index] = await fileIdentity(repo, files[index]);
    }
  }));
  const tree = git(repo, ['rev-parse', 'HEAD^{tree}']);
  const head = git(repo, ['rev-parse', 'HEAD']);
  return { tree, head, dirtyDigest: digest(JSON.stringify(content)) };
}
export const snapshotIdentity = repo => snapshot(repo, 8);
export const sameIdentity = (left, right) => JSON.stringify(left) === JSON.stringify(right);
export function ignoreHint(repo) {
  return git(repo, ['check-ignore', '.engineering-team/runs/probe/state.json'])
    ? null : 'Add .engineering-team/ to .gitignore before recording local run artifacts.';
}

export function validateRevision(repo, revision, identity) {
  if (identity.head && git(repo, ['rev-parse', `${revision}^{commit}`]) !== identity.head)
    throw new Error('revision does not resolve to current Git HEAD');
}
