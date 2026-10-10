import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

export function processStartIdentity(pid, options = {}) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return null;
  const platform = options.platform ?? process.platform;
  const read = options.readFile ?? readFileSync;
  const run = options.execute ?? execFileSync;
  const commandOptions = { encoding: "utf8", windowsHide: true, timeout: 3000, stdio: ["ignore", "pipe", "ignore"] };
  try {
    if (platform === "linux") {
      const stat = read(`/proc/${pid}/stat`, "utf8");
      const startTicks = stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[19];
      const boot = read("/proc/sys/kernel/random/boot_id", "utf8").trim();
      return /^\d+$/.test(startTicks ?? "") && /^[\da-f-]{36}$/i.test(boot) ? `linux:${boot}:${startTicks}` : null;
    }
    if (platform === "win32") {
      const command = `[Diagnostics.Process]::GetProcessById(${pid}).StartTime.ToUniversalTime().Ticks`;
      const ticks = run(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-Command", command],
        commandOptions,
      ).trim();
      return /^\d+$/.test(ticks) ? `win32:${ticks}` : null;
    }
    if (platform === "darwin") {
      const start = run("ps", ["-p", String(pid), "-o", "lstart="], {
        ...commandOptions,
        env: { ...process.env, LC_ALL: "C", TZ: "UTC" },
      }).trim();
      return /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+\d{4}$/.test(start)
        ? `darwin:${start.replace(/\s+/g, " ")}`
        : null;
    }
  } catch {
    /* Missing permissions, exited processes and unavailable tools remain unknown. */
  }
  return null;
}

let ownProcessStart;
function currentProcessStart() {
  if (ownProcessStart === undefined) ownProcessStart = processStartIdentity(process.pid);
  return ownProcessStart;
}

function lockError(message) {
  return Object.assign(new Error(message), { code: "EEXIST" });
}
function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") return false;
    return true;
  }
}
export function diagnoseLock(record, lookup = processStartIdentity) {
  if (!Number.isInteger(record.pid) || record.pid <= 0 || !record.host || !record.owner || !record.at)
    return { stale: false, message: "invalid lock; inspect manually; cannot safely break lock" };
  if (record.host !== hostname())
    return { stale: false, remote: true, message: "lock held from another host; verify, then --break-lock" };
  if (!isAlive(record.pid))
    return { stale: true, message: `stale lock from dead pid ${record.pid}; rerun with --break-lock` };
  const recorded = record.processStart;
  const actual =
    typeof recorded === "string" && recorded.length > 0 && recorded.length <= 256 ? lookup(record.pid) : null;
  if (typeof actual === "string" && actual && actual !== recorded)
    return {
      stale: true,
      message: `stale lock from reused pid ${record.pid}; process birth differs; use --break-lock`,
    };
  return {
    stale: false,
    message:
      `run is being written by ${record.owner} (pid ${record.pid})` +
      (actual ? "" : "; process birth unknown or legacy lock; cannot safely break a live local lock"),
  };
}
async function inspectLock(file) {
  const raw = await readFile(file, "utf8");
  try {
    return { raw, ...diagnoseLock(JSON.parse(raw)) };
  } catch {
    return { raw, stale: false, message: "invalid lock; inspect manually; cannot safely break lock" };
  }
}
async function quarantineLock(file, inspected) {
  const quarantine = `${file}.${randomUUID()}.recovery`;
  if ((await inspectLock(file)).raw !== inspected.raw) throw lockError("lock changed during recovery");
  await rename(file, quarantine);
  if ((await readFile(quarantine, "utf8")) === inspected.raw) {
    await unlink(quarantine);
    return;
  }
  await writeFile(file, await readFile(quarantine), { flag: "wx" });
  await unlink(quarantine);
  throw lockError("lock changed during recovery; restored lock");
}
export async function acquireLock(file, owner, breakLock = false) {
  const raw = JSON.stringify({
    pid: process.pid,
    host: hostname(),
    owner,
    at: new Date().toISOString(),
    processStart: currentProcessStart(),
  });
  try {
    await writeFile(file, raw, { flag: "wx" });
    return raw;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const inspected = await inspectLock(file);
  if (!breakLock || (!inspected.stale && !inspected.remote)) throw lockError(inspected.message);
  await quarantineLock(file, inspected);
  await writeFile(file, raw, { flag: "wx" });
  return raw;
}
export async function releaseLock(file, raw) {
  if ((await readFile(file, "utf8")) !== raw) throw lockError("lock ownership changed; refusing release");
  await unlink(file);
}
