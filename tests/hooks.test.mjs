import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { execute } from "../scripts/proofwork.mjs";
import { bind } from "../scripts/hook-binding.mjs";
import { runHook, completionClaim } from "../scripts/hook-policy.mjs";
import { hookCli } from "../scripts/host-hook.mjs";

test("inactive hooks do nothing; an explicit root request receives a recommendation without writes", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "pw hooks "));
  t.after(() => rm(repo, { recursive: true, force: true }));
  for (const host of ["codex", "claude-code"]) {
    const event = { session_id: "session", cwd: repo, hook_event_name: "SessionStart" };
    assert.deepEqual(await runHook(host, event), {});
    assert.deepEqual(await runHook(host, { ...event, hook_event_name: "Unknown" }), {});
    assert.deepEqual(await runHook(host, { ...event, hook_event_name: "UserPromptSubmit", prompt: "Fix typo" }), {});
    const routed = await runHook(host, {
      ...event,
      hook_event_name: "UserPromptSubmit",
      prompt: "$use-proofwork Fix typo token=privatevalue",
    });
    assert.match(routed.hookSpecificOutput.additionalContext, /light/);
    assert.doesNotMatch(JSON.stringify(routed), /privatevalue/);
  }
});

async function boundFixture(t) {
  const repo = await mkdtemp(path.join(tmpdir(), "pw lifecycle "));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const options = { repo, run: "run", owner: "owner", revision: "r1" };
  await execute("init", { ...options, objective: "Verify parser", criteria: "works" });
  await bind({ ...options, host: "codex", session: "session" });
  const record = async (command, value, extra = {}) => {
    const input = path.join(repo, ".engineering-team/record.json");
    await writeFile(input, JSON.stringify(value));
    return execute(command, { ...options, input, ...extra });
  };
  const event = {
    cwd: repo,
    session_id: "session",
    hook_event_name: "Stop",
    stop_hook_active: false,
    last_assistant_message: "Task complete.",
  };
  return { repo, options, record, event };
}

test("natural completion claims and state-based Stop checks cannot bypass preflight", async (t) => {
  const { record, event } = await boundFixture(t);
  const messages = ["Task complete. All criteria pass.", "Done. Nothing is blocked; all tests pass.",
    "All done - every criterion passes and I verified it.", "Everything is finished and verified.",
    "The fix is in and tests are green.", "I have completed the work."];
  for (const message of messages) assert.equal(completionClaim(message), true, message);
  for (const phase of ["reviewing", "verifying"]) {
    await record("checkpoint", { phase });
    for (const message of [...messages, "Here is my report.", "Incomplete; tests failed."]) {
      assert.equal((await runHook("codex", { ...event, last_assistant_message: message })).decision, "block");
    }
    const missingMessage = { ...event };
    delete missingMessage.last_assistant_message;
    const blocked = await runHook("codex", missingMessage);
    assert.equal(blocked.decision, "block");
    assert.match(blocked.systemMessage, /last_assistant_message/);
    const missingGuard = { ...event };
    delete missingGuard.stop_hook_active;
    const advisory = await runHook("codex", missingGuard);
    assert.match(advisory.systemMessage, /stop_hook_active/);
    assert.equal(advisory.decision, undefined);
    assert.deepEqual(await runHook("codex", { ...event, stop_hook_active: true }), {});
  }
});

test("bound prompt hints retain Go/C false-positive fixes and advertise automatic init binding", async t => {
  const { event } = await boundFixture(t);
  for (const prompt of ["Go ahead and fix the typo", "Update the copy for plan C", "I want an app to track my invoices"]) {
    const hint = (await runHook("codex", { ...event, hook_event_name: "UserPromptSubmit", prompt }))
      .hookSpecificOutput.additionalContext;
    assert.doesNotMatch(hint, /language-fit/);
    assert.match(hint, /--host codex --session session/);
    if (prompt.includes("invoices")) assert.match(hint, /brainstorm/);
  }
  const hint = (await runHook("codex", { ...event, hook_event_name: "UserPromptSubmit",
    prompt: "Compare Go and C for this network service" })).hookSpecificOutput.additionalContext;
  assert.match(hint, /language-fit/);
});

test("ready completion uses recorded reviewed work and current evidence; completed bindings stay inactive", async (t) => {
  const { repo, options, record, event } = await boundFixture(t);
  await record("assign", { id: "parser", objective: "Verify parser", files: ["src"], revision: "r1" });
  await record("result", { id: "parser", status: "reviewed", revision: "r1", summary: "Independent review passed" });
  await record("checkpoint", {});
  await record(
    "evidence",
    {
      id: "test",
      criterion: "works",
      revision: "r1",
      artifact: ".engineering-team/proof.txt",
      command: "parser check",
      environment: "fixture",
      observed: "passed",
      passed: true,
    },
    { command: 'node -e "process.exit(0)"' },
  );
  assert.equal((await execute("preflight", options)).ready, true);
  const file = path.join(repo, ".engineering-team/runs/run/state.json");
  const before = await readFile(file, "utf8");
  assert.deepEqual(await runHook("codex", event), {});
  assert.equal(await readFile(file, "utf8"), before);
  await execute("complete", { ...options, "allow-claimed": true });
  for (const hook_event_name of ["Stop", "SessionStart", "UserPromptSubmit"]) {
    assert.deepEqual(await runHook("codex", { ...event, hook_event_name, prompt: "Fix another typo" }), {});
  }
  const root = await runHook("codex", {
    ...event,
    hook_event_name: "UserPromptSubmit",
    prompt: "$use-proofwork Fix typo",
  });
  assert.match(root.hookSpecificOutput.additionalContext, /recommendation/);
});

test("stopped and awaiting checkpoints never request completion continuation", async (t) => {
  const { record, event } = await boundFixture(t);
  for (const phase of ["stopped-incomplete", "awaiting-input"]) {
    await record("checkpoint", { phase, nextAction: "Wait for explicit user instruction" });
    assert.deepEqual(await runHook("codex", event), {});
    const recovery = await runHook("codex", { ...event, hook_event_name: "SessionStart" });
    assert.match(recovery.hookSpecificOutput.additionalContext, new RegExp(phase));
  }
});

test("invalid payloads fail safely and root routing without a binding remains read only", async (t) => {
  const { repo, event } = await boundFixture(t);
  await assert.rejects(runHook("unknown", event));
  for (const invalid of [null, [], "payload", { ...event, cwd: "relative" }, { ...event, session_id: 7 }]) {
    await assert.rejects(runHook("codex", invalid));
  }
  await assert.rejects(runHook("codex", { ...event, hook_event_name: "UserPromptSubmit", prompt: 7 }));
  const unboundRepo = await mkdtemp(path.join(tmpdir(), "pw no binding "));
  t.after(() => rm(unboundRepo, { recursive: true, force: true }));
  const routed = await runHook("codex", {
    cwd: unboundRepo,
    session_id: "unbound",
    hook_event_name: "UserPromptSubmit",
    prompt: "/proofwork:use-proofwork Design a café",
  });
  assert.ok(routed.hookSpecificOutput.additionalContext);
  assert.deepEqual(await readdir(unboundRepo), []);
});

test("hook CLI decodes UTF8 after combining byte chunks and contains stream failures", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "pw utf8 "));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const event = {
    cwd: repo,
    session_id: "unicode",
    hook_event_name: "UserPromptSubmit",
    prompt: "$use-proofwork Design café résumé",
  };
  const bytes = Buffer.from(JSON.stringify(event));
  async function* chunks() {
    for (const byte of bytes) yield Buffer.from([byte]);
  }
  assert.deepEqual(await hookCli(["--host", "codex"], chunks()), await runHook("codex", event));
  async function* strings() {
    yield JSON.stringify(event);
  }
  assert.deepEqual(await hookCli(["--host", "codex"], strings()), await runHook("codex", event));
  async function* broken() {
    throw new Error("token=privatevalue");
  }
  const failed = await hookCli(["--host", "codex"], broken());
  assert.ok(failed.systemMessage);
  assert.doesNotMatch(JSON.stringify(failed), /privatevalue/);
  assert.ok((await hookCli([], strings())).systemMessage);
});

test("bound recovery preserves state and incomplete turns never cause continuation loops", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "pw bound hooks "));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const options = { repo, run: "run", owner: "owner", revision: "r1" };
  await execute("init", { ...options, objective: "Deliver parser token=privatevalue", criteria: "regression" });
  // Binding is the only deliberate write; lifecycle handlers cannot choose a run themselves.
  await bind({ ...options, host: "codex", session: "session" });
  const file = path.join(repo, ".engineering-team/runs/run/state.json");
  const before = await readFile(file, "utf8");
  const event = { session_id: "session", cwd: repo, hook_event_name: "SessionStart", source: "compact" };
  const recovery = await runHook("codex", event);
  assert.match(recovery.hookSpecificOutput.additionalContext, /preparing/);
  assert.doesNotMatch(JSON.stringify(recovery), /privatevalue/);
  const stop = { ...event, hook_event_name: "Stop", last_assistant_message: "Task complete.", stop_hook_active: false };
  assert.equal((await runHook("codex", stop)).decision, "block");
  assert.deepEqual(await runHook("codex", { ...stop, stop_hook_active: true }), {});
  for (const message of ["Progress: inspected parser.", "Task complete? Awaiting input.", "Done, but unverified."]) {
    assert.deepEqual(await runHook("codex", { ...stop, last_assistant_message: message }), {});
  }
  assert.deepEqual(await runHook("codex", { ...event, hook_event_name: "UserPromptSubmit", prompt: "Stop now" }), {});
  assert.match(
    (await runHook("codex", { ...event, hook_event_name: "UserPromptSubmit", prompt: "Fix parser" })).hookSpecificOutput
      .additionalContext,
    /accepted context/,
  );
  assert.equal(await readFile(file, "utf8"), before);
});

test("hook stdin rejects malformed, oversized and unsupported requests without raw data or shell execution", () => {
  const run = (input, args = ["--host", "codex"]) =>
    spawnSync(process.execPath, ["scripts/host-hook.mjs", ...args], { input, encoding: "utf8" });
  for (const input of ["{token=privatevalue", "x".repeat(1048577), JSON.stringify({ hook_event_name: "Stop" })]) {
    const result = run(input);
    assert.equal(result.status, 0);
    assert.ok(JSON.parse(result.stdout).systemMessage);
    assert.doesNotMatch(result.stdout + result.stderr, /privatevalue/);
  }
  assert.ok(JSON.parse(run("{}", ["--host", "unknown"]).stdout).systemMessage);
  assert.deepEqual(JSON.parse(run('{"hook_event_name":"Unknown"}').stdout), {});
});
