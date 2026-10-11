import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { isMain } from './runtime-entry.mjs';

// Git status includes staged differences and untracked generated files, unlike git diff.
export function checkPackageParity(repository) {
  const status = execFileSync('git', ['-C', path.resolve(repository), 'status', '--porcelain=v1',
    '-z', '--untracked-files=all', '--', 'packages', '.claude-plugin/marketplace.json'],
  { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const changes = status.split('\0').filter(Boolean);
  return { passed: changes.length === 0, changes };
}
if (isMain(import.meta.url)) {
  try {
    const report = checkPackageParity(process.argv[2] ?? process.cwd());
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
