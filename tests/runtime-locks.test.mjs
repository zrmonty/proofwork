import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir, hostname } from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { acquireLock, releaseLock, diagnoseLock, processStartIdentity } from "../scripts/runtime-locks.mjs";

const liveRecord = (extra) => ({
  pid: process.pid,
  host: hostname(),
  owner: "prior-writer",
  at: new Date().toISOString(),
  ...extra,
});

test("a live reused PID does not retain authority over a lock from a different process birth", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "proofwork-lock-birth-"));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const file = path.join(repo, "write.lock");
  const raw = await acquireLock(file, "current-writer");
  const current = JSON.parse(raw);
  assert.equal(typeof current.processStart, "string");
  assert.equal(diagnoseLock(current).stale, false);
  const reused = { ...current, processStart: `${current.processStart}-earlier` };
  assert.equal(diagnoseLock(reused).stale, true);
  await writeFile(file, JSON.stringify(reused));
  await assert.rejects(acquireLock(file, "replacement"), /stale.*birth/);
  const replacement = await acquireLock(file, "replacement", true);
  assert.equal(JSON.parse(replacement).processStart, current.processStart);
  await releaseLock(file, replacement);
});

test("platform birth lookups use OS creation data, reject malformed output and fail conservatively", () => {
  const boot = "12345678-1234-1234-1234-123456789abc";
  const fields = Array.from({ length: 20 }, (_, index) => (index === 19 ? "424242" : "0"));
  const readFile = (file) => (file.endsWith("/stat") ? `42 (name with ) spaces) ${fields.join(" ")}` : `${boot}\n`);
  assert.equal(processStartIdentity(42, { platform: "linux", readFile }), `linux:${boot}:424242`);
  for (const value of ["broken", "42 (name) invalid"]) {
    assert.equal(processStartIdentity(42, { platform: "linux", readFile: () => value }), null);
  }
  const calls = [];
  const execute = (...args) => {
    calls.push(args);
    return "638900000000000000\r\n";
  };
  assert.equal(processStartIdentity(42, { platform: "win32", execute }), "win32:638900000000000000");
  assert.match(calls[0][0], /^[A-Z]:\\.*WindowsPowerShell\\v1\.0\\powershell\.exe$/i);
  assert.match(calls[0][1].at(-1), /GetProcessById\(42\).*StartTime.*Ticks/);
  assert.equal(calls[0][2].windowsHide, true);
  assert.equal(processStartIdentity(42, { platform: "win32", execute: () => "unavailable" }), null);
  const macExecute = (binary, args, options) => {
    assert.equal(binary, "ps");
    assert.deepEqual(args, ["-p", "42", "-o", "lstart="]);
    assert.equal(options.env.TZ, "UTC");
    assert.equal(options.env.LC_ALL, "C");
    return "Sat Oct  10 12:34:56 2026\n";
  };
  assert.equal(
    processStartIdentity(42, { platform: "darwin", execute: macExecute }),
    "darwin:Sat Oct 10 12:34:56 2026",
  );
  assert.equal(processStartIdentity(42, { platform: "darwin", execute: () => "" }), null);
  assert.equal(processStartIdentity(42, { platform: "unsupported" }), null);
  assert.equal(processStartIdentity(-1), null);
  assert.equal(processStartIdentity("42; attacker"), null);
  assert.equal(
    processStartIdentity(42, {
      platform: "win32",
      execute: () => {
        throw new Error("denied");
      },
    }),
    null,
  );
});

test("a short lived local writer can finish before the bounded contention deadline", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "proofwork-lock-contention-"));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const file = path.join(repo, "write.lock");
  const first = await acquireLock(file, "first");
  const timer = setTimeout(() => {
    releaseLock(file, first).catch(() => {});
  }, 80);
  t.after(() => clearTimeout(timer));
  const second = await acquireLock(file, "second");
  assert.equal(JSON.parse(second).owner, "second");
  await releaseLock(file, second);
});

test("process birth remains stable across later lock acquisitions", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "proofwork-lock-stable-"));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const file = path.join(repo, "write.lock");
  const first = await acquireLock(file, "writer");
  await releaseLock(file, first);
  const second = await acquireLock(file, "writer");
  assert.equal(JSON.parse(first).processStart, JSON.parse(second).processStart);
  assert.equal(JSON.parse(second).processStart, processStartIdentity(process.pid));
  await releaseLock(file, second);
});

test("unknown and legacy live birth identities never authorize breaking a local lock", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "proofwork-lock-unknown-"));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const file = path.join(repo, "write.lock");
  const legacy = liveRecord({});
  assert.equal(diagnoseLock(legacy).stale, false);
  assert.equal(diagnoseLock(liveRecord({ processStart: "known" }), () => null).stale, false);
  assert.equal(diagnoseLock(liveRecord({ processStart: 5 }), () => "different").stale, false);
  await writeFile(file, JSON.stringify(legacy));
  const started = performance.now();
  await assert.rejects(acquireLock(file, "replacement", true), /being written/);
  assert.ok(performance.now() - started >= 1400);
  assert.ok(performance.now() - started < 2500);
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")), legacy);
});

test(
  "Windows birth lookup survives missing PATH and CIM agrees with native start time",
  { skip: process.platform !== "win32" },
  () => {
    const direct = processStartIdentity(process.pid);
    assert.equal(typeof direct, "string");
    const emptyPath = processStartIdentity(process.pid, {
      execute: (file, args, options) => execFileSync(file, args, { ...options, env: { ...process.env, PATH: "" } }),
    });
    const fallback = processStartIdentity(process.pid, {
      execute: (file, args, options) =>
        execFileSync(
          file,
          args.map((argument) =>
            argument.includes("GetProcessById")
              ? argument.replace(/try \{ .*? \} catch/, "try { throw 'forced fallback' } catch")
              : argument,
          ),
          options,
        ),
    });
    assert.equal(emptyPath, direct);
    assert.equal(fallback, direct);
    assert.equal(diagnoseLock(liveRecord({ processStart: direct.slice(0, -1) + "1" }), () => direct).stale, false);
  },
);

test(
  "a transient unknown process birth is retried on the next acquisition",
  { skip: process.platform !== "win32" },
  async (t) => {
    const repo = await mkdtemp(path.join(tmpdir(), "proofwork-lock-transient-"));
    t.after(() => rm(repo, { recursive: true, force: true }));
    const script = `
      import childProcess from 'node:child_process';
      import { syncBuiltinESMExports } from 'node:module';
      const original = childProcess.execFileSync;
      let attempts = 0;
      childProcess.execFileSync = (...args) => {
        if (++attempts === 1) throw new Error('temporary lookup failure');
        return original(...args);
      };
      syncBuiltinESMExports();
      const { acquireLock, releaseLock } = await import('./scripts/runtime-locks.mjs');
      const file = process.argv[1];
      const first = await acquireLock(file, 'first');
      await releaseLock(file, first);
      const second = await acquireLock(file, 'second');
      await releaseLock(file, second);
      console.log(JSON.stringify({ first: JSON.parse(first).processStart,
        second: JSON.parse(second).processStart, attempts }));
    `;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script, path.join(repo, "lock")], {
      encoding: "utf8",
      windowsHide: true,
    });
    assert.equal(result.status, 0, result.stderr);
    const observation = JSON.parse(result.stdout);
    assert.equal(observation.first, null);
    assert.equal(typeof observation.second, "string");
    assert.ok(observation.attempts >= 2);
  },
);
