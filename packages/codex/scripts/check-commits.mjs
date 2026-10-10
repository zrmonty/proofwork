import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkMessage(message) {
  const lines = message.split(/\r?\n/);
  return ['Major features', 'Minor features'].flatMap(heading => {
    const positions = lines.flatMap((line, index) => line.trim().replace(/:$/, '') === heading ? [index] : []);
    if (positions.length !== 1) return [`${heading} must appear exactly once`];
    const start = positions[0] + 1;
    const following = lines.slice(start);
    const end = following.findIndex(line => /^(Major features|Minor features|Validation|Breaking changes):?$/.test(line.trim()));
    const content = (end < 0 ? following : following.slice(0, end)).join('\n').replace(/[\s*-]/g, '');
    return content ? [] : [`${heading} is empty; describe the changes or write None`];
  });
}

function git(repo, args) {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || 'Git command failed');
  return result.stdout;
}

export function checkRange(repo, range) {
  if (!range || range.startsWith('-') || /[\r\n\0]/.test(range)) throw new Error('Supply a valid explicit Git revision or outgoing range');
  const commits = git(repo, ['rev-list', '--end-of-options', range]).trim().split(/\r?\n/).filter(Boolean);
  return commits.map(commit => ({ commit, errors: checkMessage(git(repo, ['show', '-s', '--format=%B', commit])) }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4 || args[0] !== '--repo' || args[2] !== '--range') throw new Error('Usage: node check-commits.mjs --repo PATH --range GIT_RANGE');
    const result = checkRange(args[1], args[3]);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (result.some(item => item.errors.length)) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
