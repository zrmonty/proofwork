import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { open } from 'node:fs/promises';

const sha256 = value => createHash('sha256').update(value).digest('hex');
export function redact(value) {
  return String(value).replace(/(?:api[_-]?key|token|password|secret)\s*[=:]\s*[^\s;]+/gi, '[REDACTED]')
    .replace(/\b(?:sk|ghp|github_pat)[-_][a-zA-Z0-9_-]+/g, '[REDACTED]')
    .replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/gi, 'https://[REDACTED]@');
}
function streamDigest(stream) {
  const hash = createHash('sha256');
  stream.on('data', chunk => hash.update(chunk));
  return hash;
}
async function runCommand(command, repo) {
  const started = performance.now();
  const child = spawn(command, { cwd: repo, shell: true, windowsHide: true });
  const stdout = streamDigest(child.stdout), stderr = streamDigest(child.stderr);
  const result = await new Promise((resolve, reject) => {
    child.once('error', reject); child.once('close', (exitCode, signal) => resolve({ exitCode, signal }));
  });
  return { ...result, durationMs: performance.now() - started,
    stdoutDigest: stdout.digest('hex'), stderrDigest: stderr.digest('hex') };
}
export async function executeEvidence(record, command, repo, artifact) {
  const output = await open(artifact, 'wx', 0o600);
  try {
    const observation = await runCommand(command, repo);
    const observed = { ...observation, source: 'executed', passed: observation.exitCode === 0,
      command: 'Executed shell command (text withheld; review invocation against commandDigest)',
      commandDigest: sha256(command), observed: `exit ${observation.exitCode}` };
    await output.writeFile(`${JSON.stringify(observed, null, 2)}\n`);
    return { ...record, ...observed };
  } finally { await output.close(); }
}
