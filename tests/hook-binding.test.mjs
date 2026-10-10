import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, realpath, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { bind, unbind, readBinding } from "../scripts/hook-binding.mjs";

async function fixture() {
  const repo = await realpath(await mkdtemp(path.join(tmpdir(), "proofwork-binding-")));
  const options = { repo, host: "codex", session: "session-123", run: "run-one", owner: "coordinator" };
  await writeRun(repo, options.run, options.owner);
  return options;
}
async function writeRun(repo, run, owner) {
  const directory = path.join(repo, ".engineering-team", "runs", run);
  await mkdir(directory, { recursive: true });
  const state = { schemaVersion: 1, repo, run, owner, activeMode: "use-proofwork", phase: "preparing" };
  await writeFile(path.join(directory, "state.json"), JSON.stringify(state));
}
const bindingFile = (options) =>
  path.join(options.repo, ".engineering-team/hooks/bindings", options.host, `${options.session}.json`);

test("binding is explicit, idempotent and independent of run recency", async () => {
  const options = await fixture();
  try {
    assert.equal(await readBinding(options.repo, options.host, options.session), null);
    const stateFile = path.join(options.repo, ".engineering-team/runs/run-one/state.json");
    const original = await readFile(stateFile);
    await writeRun(options.repo, "newest", "other-owner");
    const created = await bind(options);
    assert.equal(created.run, "run-one");
    assert.deepEqual(await bind(options), created);
    assert.deepEqual(await readBinding(options.repo, options.host, options.session), created);
    assert.deepEqual(await readFile(stateFile), original);
    assert.deepEqual(await readdir(path.dirname(bindingFile(options))), ["session-123.json"]);
    await assert.rejects(bind({ ...options, run: "newest", owner: "other-owner" }));
    await assert.rejects(unbind({ ...options, owner: "other-owner" }));
    assert.deepEqual(await unbind(options), { unbound: true });
    assert.deepEqual(await unbind(options), { unbound: false });
    assert.equal((await bind({ ...options, run: "newest", owner: "other-owner" })).run, "newest");
  } finally {
    await rm(options.repo, { recursive: true, force: true });
  }
});

test("concurrent duplicate creation publishes one complete identical binding", async () => {
  const options = await fixture();
  try {
    const results = await Promise.all(Array.from({ length: 12 }, () => bind(options)));
    assert.ok(results.every((result) => result.run === options.run));
    assert.deepEqual(await readdir(path.dirname(bindingFile(options))), ["session-123.json"]);
    await writeRun(options.repo, "second", options.owner);
    await unbind(options);
    const competitors = await Promise.allSettled([bind(options), bind({ ...options, run: "second" })]);
    assert.equal(competitors.filter((result) => result.status === "fulfilled").length, 1);
  } finally {
    await rm(options.repo, { recursive: true, force: true });
  }
});

test("binding rejects invalid selectors, absent runs and checkpoint identity or authority mismatch", async () => {
  const options = await fixture();
  try {
    for (const changes of [
      { host: "cursor" },
      { session: "../escape" },
      { session: "CON" },
      { session: "x".repeat(81) },
      { run: "missing" },
      { owner: "wrong" },
      { owner: "" },
    ])
      await assert.rejects(bind({ ...options, ...changes }));
    const stateFile = path.join(options.repo, ".engineering-team/runs/run-one/state.json");
    const original = JSON.parse(await readFile(stateFile, "utf8"));
    for (const changes of [
      { repo: tmpdir() },
      { run: "other" },
      { owner: "wrong" },
      { activeMode: "other" },
      { schemaVersion: 2 },
    ]) {
      await writeFile(stateFile, JSON.stringify({ ...original, ...changes }));
      await assert.rejects(bind(options));
    }
    assert.equal(await readBinding(options.repo, options.host, options.session), null);
  } finally {
    await rm(options.repo, { recursive: true, force: true });
  }
});

test("read rejects forged binding identity, malformed or oversized files", async () => {
  const options = await fixture();
  try {
    const original = await bind(options);
    for (const changes of [
      { repo: tmpdir() },
      { host: "claude-code" },
      { session: "other" },
      { owner: "wrong" },
      { run: "../escape" },
      { schemaVersion: 2 },
      { extra: true },
    ]) {
      await writeFile(bindingFile(options), JSON.stringify({ ...original, ...changes }));
      await assert.rejects(readBinding(options.repo, options.host, options.session));
    }
    await writeFile(bindingFile(options), "{bad");
    await assert.rejects(readBinding(options.repo, options.host, options.session));
    await writeFile(bindingFile(options), "x".repeat(17000));
    await assert.rejects(readBinding(options.repo, options.host, options.session));
  } finally {
    await rm(options.repo, { recursive: true, force: true });
  }
});

test("symlinks in repository ancestors, run paths and binding paths are rejected", async () => {
  const options = await fixture();
  const outer = await mkdtemp(path.join(tmpdir(), "proofwork-binding-links-"));
  try {
    const alias = path.join(outer, "repository");
    await symlink(options.repo, alias, "junction");
    await assert.rejects(readBinding(alias, options.host, options.session));
    const runAlias = path.join(options.repo, ".engineering-team/runs/alias");
    await symlink(path.join(options.repo, ".engineering-team/runs/run-one"), runAlias, "junction");
    await assert.rejects(bind({ ...options, run: "alias" }));
    const hooks = path.join(options.repo, ".engineering-team/hooks");
    await symlink(outer, hooks, "junction");
    await assert.rejects(bind(options));
    await rm(hooks);
    await bind(options);
    await rm(bindingFile(options));
    // Junctions exercise the final component without Windows file-symlink privileges.
    await symlink(outer, bindingFile(options), "junction");
    await assert.rejects(readBinding(options.repo, options.host, options.session));
  } finally {
    await rm(options.repo, { recursive: true, force: true });
    await rm(outer, { recursive: true, force: true });
  }
});

test("CLI supports both hosts and reports generic failures without attacker-supplied text", async () => {
  const options = await fixture();
  const run = (args) => spawnSync(process.execPath, ["scripts/hook-binding.mjs", ...args], { encoding: "utf8" });
  const args = [
    "--repo",
    options.repo,
    "--host",
    "claude-code",
    "--session",
    "session_UUID-2",
    "--run",
    options.run,
    "--owner",
    options.owner,
  ];
  try {
    assert.equal(run(["bind", ...args]).status, 0);
    assert.equal(run(["unbind", ...args]).status, 0);
    for (const invalid of [
      [],
      ["status", ...args],
      ["bind", "--repo", "secret-token"],
      ["bind", ...args, "--owner", "secret-token"],
    ]) {
      const result = run(invalid);
      assert.equal(result.status, 1);
      assert.ok(!result.stderr.includes("secret-token"));
      assert.equal(typeof JSON.parse(result.stderr).error, "string");
    }
  } finally {
    await rm(options.repo, { recursive: true, force: true });
  }
});
