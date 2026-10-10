import { readdir, readFile, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function git(repo, args) {
  try { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true,
    stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
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
  const stat = await lstat(file);
  if (stat.isSymbolicLink()) throw new Error('snapshot cannot contain symlinks; inspect boundary explicitly');
  return [relative, stat.mode, digest(await readFile(file))];
}
export async function snapshotIdentity(repo) {
  const files = (await collectFiles(repo)).sort();
  const content = [];
  for (const file of files) content.push(await fileIdentity(repo, file));
  const tree = git(repo, ['rev-parse', 'HEAD^{tree}']);
  const head = git(repo, ['rev-parse', 'HEAD']);
  return { tree, head, dirtyDigest: digest(JSON.stringify(content)) };
}
export const sameIdentity = (left, right) => JSON.stringify(left) === JSON.stringify(right);
export function ignoreHint(repo) {
  return git(repo, ['check-ignore', '.engineering-team/runs/probe/state.json'])
    ? null : 'Add .engineering-team/ to .gitignore before recording local run artifacts.';
}

export function validateRevision(repo, revision, identity) {
  if (identity.head && git(repo, ['rev-parse', `${revision}^{commit}`]) !== identity.head)
    throw new Error('revision does not resolve to current Git HEAD');
}
