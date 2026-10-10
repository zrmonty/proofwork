import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir, hostname } from "node:os";
import path from "node:path";
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
  assert.equal(calls[0][0], "powershell.exe");
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
  await assert.rejects(acquireLock(file, "replacement", true), /being written/);
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")), legacy);
});
