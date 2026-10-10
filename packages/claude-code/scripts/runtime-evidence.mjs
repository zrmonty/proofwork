import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { open } from 'node:fs/promises';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const secretValue = String.raw`(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s;,}]+)`;
const secretName = String.raw`["']?[a-z0-9_-]*(?:(?:api|access|private|account)[_-]?key`
  + String.raw`|token|password|secret|credential)[a-z0-9_-]*["']?`;
export function redact(value) {
  return String(value)
    .replace(/\bBearer\s+[^\s"';,]+/gi, 'Bearer [REDACTED]')
    .replace(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b|\bAIza[A-Za-z0-9_-]{35}\b/g, '[REDACTED]')
    .replace(new RegExp(`${secretName}\\s*[=:]\\s*${secretValue}`, 'gi'), '[REDACTED]')
    .replace(new RegExp(`--(?:password|token|api-key|secret)(?:=|\\s+)${secretValue}`, 'gi'), '[REDACTED]')
    .replace(/\b(?:sk|ghp|github_pat)[-_][a-zA-Z0-9_-]+/g, '[REDACTED]')
    .replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/gi, 'https://[REDACTED]@');
}
function streamDigest(stream) {
  const hash = createHash('sha256');
  stream.on('data', chunk => hash.update(chunk));
  return hash;
}
async function runCommand(command, repo, timeoutMs) {
  const started = performance.now();
  const child = spawn(command, { cwd: repo, shell: true, windowsHide: true, detached: process.platform !== 'win32' });
  const stdout = streamDigest(child.stdout), stderr = streamDigest(child.stderr);
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (process.platform === 'win32') {
        const killed = spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'],
          { windowsHide: true, timeout: 5000, stdio: 'ignore' });
        if (killed.status !== 0) child.kill();
      } else {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
      }
      child.stdout.destroy(); child.stderr.destroy(); child.unref();
      resolve({ exitCode: null, signal: null, timedOut: true, terminationRequested: true });
    }, timeoutMs);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', (exitCode, signal) => { clearTimeout(timer); resolve({ exitCode, signal, timedOut: false }); });
  });
  return { ...result, timeoutMs, durationMs: performance.now() - started,
    stdoutDigest: stdout.digest('hex'), stderrDigest: stderr.digest('hex') };
}
export async function executeEvidence(record, command, repo, artifact, timeout = 120000) {
  const timeoutMs = Number(timeout);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 3600000)
    throw new Error('evidence timeout must be an integer from 1 to 3600000 milliseconds');
  const output = await open(artifact, 'wx', 0o600);
  try {
    const observation = await runCommand(command, repo, timeoutMs);
    const observed = { ...observation, source: 'executed', passed: !observation.timedOut && observation.exitCode === 0,
      command: 'Executed shell command (text withheld; review invocation against commandDigest)',
      commandDigest: sha256(command),
      observed: observation.timedOut ? 'command timed out' : `exit ${observation.exitCode}` };
    await output.writeFile(`${JSON.stringify(observed, null, 2)}\n`);
    return { ...record, ...observed };
  } finally { await output.close(); }
}
