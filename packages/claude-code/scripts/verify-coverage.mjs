import { isMain } from './runtime-entry.mjs';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeLcov } from './collect-coverage.mjs';
import { checkCoverage } from './check-coverage.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export async function coverageInventory(repository) {
  const names = await readdir(path.join(repository, 'scripts'));
  return names.filter(name => name.endsWith('.mjs')).sort().map(name => `scripts/${name}`);
}

async function sourceIdentity(repository, inventory) {
  const digest = createHash('sha256');
  for (const file of inventory) {
    digest.update(file);
    digest.update(await readFile(path.join(repository, file)));
  }
  return `scripts-sha256:${digest.digest('hex')}`;
}

function runTests(repository, args) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const child = spawn(process.execPath, args, { cwd: repository, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', chunk => stdout.push(chunk));
    child.stderr.on('data', chunk => stderr.push(chunk));
    child.once('error', reject);
    child.once('close', exit => resolve({ exit, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) }));
  });
}

export async function verifyCoverage(repository = root) {
  const inventory = await coverageInventory(repository);
  if (!inventory.length) throw new Error('no production scripts in the coverage inventory');
  const revision = await sourceIdentity(repository, inventory);
  const directory = path.join(repository, '.engineering-team', 'coverage', randomUUID());
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'inventory.json'), JSON.stringify(inventory, null, 2));
  const tests = (await readdir(path.join(repository, 'tests')))
    .filter(name => name.endsWith('.test.mjs')).sort().map(name => `tests/${name}`);
  if (!tests.length) throw new Error('no tests discovered for coverage');
  const lcov = path.join(directory, 'coverage.lcov');
  const execution = await runTests(repository, [
    '--test', '--experimental-test-coverage', '--test-reporter=lcov',
    `--test-reporter-destination=${lcov}`, ...tests,
  ]);
  await writeFile(path.join(directory, 'test-stdout.log'), execution.stdout);
  await writeFile(path.join(directory, 'test-stderr.log'), execution.stderr);
  if (execution.exit !== 0) throw new Error(`coverage test run failed; inspect local artifacts: ${directory}`);
  const currentInventory = await coverageInventory(repository);
  if (JSON.stringify(currentInventory) !== JSON.stringify(inventory) ||
      await sourceIdentity(repository, inventory) !== revision) {
    throw new Error('production scripts changed while collecting coverage');
  }
  const report = normalizeLcov(await readFile(lcov, 'utf8'), inventory, revision, repository);
  const gate = checkCoverage(report, inventory);
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2));
  await writeFile(path.join(directory, 'gate.json'), JSON.stringify(gate, null, 2));
  return { ...gate, directory, inventory, revision };
}

if (isMain(import.meta.url)) {
  verifyCoverage(path.resolve(process.argv[2] ?? root))
    .then(report => {
      console.log(JSON.stringify(report, null, 2));
      if (!report.passed) process.exitCode = 1;
    })
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
