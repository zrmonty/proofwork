import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { hostname } from 'node:os';
import { randomUUID } from 'node:crypto';

function lockError(message) {
  return Object.assign(new Error(message), { code: 'EEXIST' });
}
function isAlive(pid) {
  try { process.kill(pid, 0); return true; }
  catch (error) { if (error.code === 'ESRCH') return false; return true; }
}
export function diagnoseLock(record) {
  if (!Number.isInteger(record.pid) || record.pid <= 0 || !record.host || !record.owner || !record.at)
    return { stale: false, message: 'invalid lock; inspect manually; cannot safely break lock' };
  if (record.host !== hostname())
    return { stale: false, remote: true, message: 'lock held from another host; verify, then --break-lock' };
  return isAlive(record.pid)
    ? { stale: false, message: `run is being written by ${record.owner} (pid ${record.pid})` }
    : { stale: true, message: `stale lock from dead pid ${record.pid}; rerun with --break-lock` };
}
async function inspectLock(file) {
  const raw = await readFile(file, 'utf8');
  try { return { raw, ...diagnoseLock(JSON.parse(raw)) }; }
  catch { return { raw, stale: false, message: 'invalid lock; inspect manually; cannot safely break lock' }; }
}
async function quarantineLock(file, inspected) {
  const quarantine = `${file}.${randomUUID()}.recovery`;
  if ((await inspectLock(file)).raw !== inspected.raw) throw lockError('lock changed during recovery');
  await rename(file, quarantine);
  if (await readFile(quarantine, 'utf8') === inspected.raw) { await unlink(quarantine); return; }
  await writeFile(file, await readFile(quarantine), { flag: 'wx' });
  await unlink(quarantine);
  throw lockError('lock changed during recovery; restored lock');
}
export async function acquireLock(file, owner, breakLock = false) {
  const raw = JSON.stringify({ pid: process.pid, host: hostname(), owner, at: new Date().toISOString() });
  try { await writeFile(file, raw, { flag: 'wx' }); return raw; }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const inspected = await inspectLock(file);
  if (!breakLock || (!inspected.stale && !inspected.remote)) throw lockError(inspected.message);
  await quarantineLock(file, inspected);
  await writeFile(file, raw, { flag: 'wx' });
  return raw;
}
export async function releaseLock(file, raw) {
  if (await readFile(file, 'utf8') !== raw) throw lockError('lock ownership changed; refusing release');
  await unlink(file);
}
