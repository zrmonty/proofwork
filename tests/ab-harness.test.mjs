import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { tasks, verifyTask, runEvaluation, normalizeMetadata, changedFiles, summarize } from "../evals/ab/run.mjs";
import * as harness from "../evals/ab/run.mjs";
import { explainRoute } from "../scripts/routing.mjs";
import { resolveModelRoles } from "../scripts/model-roles.mjs";

function temporary(t) {
  const root = mkdtempSync(path.join(tmpdir(), "proofwork-ab-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function fakeRunner(root, mode) {
  const script = path.join(root, `runner-${mode}.mjs`);
  writeFileSync(
    script,
    `import {writeFileSync, existsSync, unlinkSync} from 'node:fs';
if (existsSync('acceptance.test.mjs')) throw new Error('oracle was exposed');
const mode = ${JSON.stringify(mode)};
if (mode === 'correct') writeFileSync('module.mjs', "export const formatPages = pages => pages.join('\\\\n');\\n");
if (mode === 'tamper') writeFileSync('visible.test.mjs', '// erased assertions');
if (mode === 'regression') writeFileSync('module.mjs', "export const formatPages = () => 'wrong';");
if (mode === 'remove') unlinkSync('module.mjs');
if (mode === 'helper') {
  writeFileSync('helper.mjs', "export const joinPages = pages => pages.join(String.fromCharCode(10));");
  writeFileSync('module.mjs', "export {joinPages as formatPages} from './helper.mjs';");
}
const metadata = mode === 'correct' ? {tokens:{input:12,output:5},claims:{acceptancePassed:true}}
  : {claims:{acceptancePassed:true}};
if (mode !== 'missing-metadata') writeFileSync(process.argv[2], JSON.stringify(metadata));
if (mode === 'failure') process.exitCode = 2;
`,
  );
  const referenceContextPath = path.join(root, "reference.txt");
  writeFileSync(referenceContextPath, "Local test profile, not a model evaluation.");
  return { command: process.execPath, args: [script, "{metadataFile}"], referenceContextPath };
}

test("all eight distinct tasks begin with failing public behavior and independent acceptance", (t) => {
  const root = temporary(t);
  assert.equal(tasks.length, 8);
  assert.equal(new Set(tasks.map((task) => task.kind)).size, 8);
  for (const task of tasks) {
    const fixture = path.resolve("evals/ab/fixtures", task.id);
    const observed = verifyTask(fixture, task, path.join(root, task.id));
    assert.equal(observed.visible.passed, false, task.id);
    assert.equal(observed.acceptance.passed, false, task.id);
    assert.equal(observed.regression.passed, true, task.id);
  }
});

test("Proofwork context includes selected principle sources and optional unresolved-free model plans", (t) => {
  const root = temporary(t);
  const task = tasks.find((candidate) => candidate.id === "last-page");
  const plan = resolveModelRoles({}, [], "codex");
  const modelPlanPath = path.join(root, "plan.json");
  writeFileSync(modelPlanPath, JSON.stringify(plan));
  const ordinary = harness.profileContext("proofwork", task, {});
  for (const principle of explainRoute(task.prompt, task.files).principles) {
    assert.ok(ordinary.includes(`${principle}${path.sep}SKILL.md`));
  }
  plan.budgets.maxCandidates = 3;
  writeFileSync(modelPlanPath, JSON.stringify(plan));
  const configured = harness.profileContext("proofwork", task, { modelPlanPath });
  assert.ok(configured.startsWith(ordinary));
  assert.match(configured, /untrusted requested plan/);
  assert.match(configured, /dispatchUnverified/);
  assert.equal(harness.profileContext("bare", task, { modelPlanPath }), "");
  for (const invalid of [
    { ...plan, dispatchUnverified: false },
    { ...plan, roles: {} },
    { ...plan, budgets: { ...plan.budgets, maxParallel: 4 } },
    { ...plan, budgetEnforcement: "enforced" },
    { ...plan, roles: { ...plan.roles, writer: { ...plan.roles.writer, resolved: null } } },
    { ...plan, roles: { ...plan.roles, writer: { ...plan.roles.writer, capabilityMissing: ["model-unavailable"] } } },
  ]) {
    writeFileSync(modelPlanPath, JSON.stringify(invalid));
    assert.throws(() => harness.profileContext("proofwork", task, { modelPlanPath }), /model plan/);
  }
  writeFileSync(modelPlanPath, "x".repeat(1048577));
  assert.throws(() => harness.profileContext("proofwork", task, { modelPlanPath }), /model plan/);
  const output = path.join(root, "must-not-start");
  assert.throws(
    () =>
      runEvaluation(
        { command: "never-run", args: [], modelPlanPath },
        { tasks: ["last-page"], arms: ["bare", "proofwork"], runs: 1, out: output },
      ),
    /model plan/,
  );
  assert.equal(existsSync(output), false);
  assert.throws(() => harness.profileContext("proofwork", task, { modelPlanPath: root }), /model plan/);
});

test("optional model-role and cost metadata stays runner reported and unknown values stay null", () => {
  const observed = { acceptance: { passed: true } };
  const role = {
    role: "reviewer",
    requested: { model: "review-model", reasoning: "high" },
    observed: { model: "different-model", reasoning: "medium" },
  };
  const result = normalizeMetadata(
    {
      requestedModelId: "requested-model",
      actualModelId: "observed-model",
      modelRoles: [role],
      costUsd: 0.25,
      private: "omit",
    },
    observed,
  );
  assert.equal(result.requestedModelId, "requested-model");
  assert.equal(result.actualModelId, "observed-model");
  assert.equal(result.modelRoles[0].source, "runner-reported");
  assert.equal(result.costUsd, 0.25);
  assert.equal(result.costSource, "runner-reported");
  assert.ok(!Object.hasOwn(result, "private"));
  const unknown = normalizeMetadata({ modelRoles: [{ ...role, observed: {} }], costUsd: -1 }, observed);
  assert.equal(unknown.modelRoles[0].observed.model, null);
  assert.equal(unknown.actualModelId, null);
  assert.equal(unknown.costUsd, null);
  assert.equal(normalizeMetadata({ modelRoles: [{ ...role, role: "unsupported" }] }, observed).modelRoles, null);
  assert.equal(normalizeMetadata({ costUsd: Infinity }, observed).costUsd, null);
  assert.equal(normalizeMetadata(null, observed).modelRoles, null);
  assert.equal(normalizeMetadata({ costUsd: 0 }, observed).costUsd, 0);
});

test("three repetitions per arm retain observed checks without exposing acceptance tests", (t) => {
  const root = temporary(t);
  const result = runEvaluation(fakeRunner(root, "correct"), { tasks: ["last-page"], runs: 3, out: root });
  assert.equal(result.interrupted, false);
  assert.equal(result.rows.length, 9);
  for (const row of result.rows) {
    assert.equal(row.hiddenAccepted, true);
    assert.equal(row.regressions, 0);
    assert.equal(row.claimsMatched, true);
    assert.deepEqual(row.changedFiles, ["module.mjs"]);
    assert.equal(row.tokens.input, 12);
  }
  for (const aggregate of summarize(result.rows)) {
    assert.equal(aggregate.runs, 3);
    assert.equal(aggregate.hiddenAccepted, 3);
    assert.equal(aggregate.tokenTotal, 51);
    assert.equal(aggregate.unreviewedNarratives, 3);
  }
});

test("a successful runner cannot claim acceptance for an unfixed artifact", (t) => {
  const root = temporary(t);
  const result = runEvaluation(fakeRunner(root, "noop"), { tasks: ["last-page"], arms: ["bare"], runs: 1, out: root });
  const row = result.rows[0];
  assert.equal(row.runnerExitCode, 0);
  assert.equal(row.hiddenAccepted, false);
  assert.equal(row.originalTestPassed, false);
  assert.equal(row.regressions, 0);
  assert.equal(row.claimsMatched, false);
  assert.equal(row.tokens, null);
  const [aggregate] = summarize(result.rows);
  assert.equal(aggregate.contradictedAcceptanceClaims, 1);
  assert.equal(aggregate.tokenTotal, null);
});

test("runner failure preserves its observed row and stops further spending", (t) => {
  const root = temporary(t);
  const result = runEvaluation(fakeRunner(root, "failure"), {
    tasks: ["last-page"],
    arms: ["bare"],
    runs: 3,
    out: root,
  });
  assert.equal(result.interrupted, true);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].runnerExitCode, 2);
  assert.equal(JSON.parse(readFileSync(path.join(root, "results.json"), "utf8")).rows.length, 1);
});

test("verification preserves original tests and accommodates local helpers or deleted modules", (t) => {
  const root = temporary(t);
  for (const [mode, accepted] of [
    ["tamper", false],
    ["helper", true],
    ["remove", false],
    ["missing-metadata", false],
    ["regression", false],
  ]) {
    const result = runEvaluation(fakeRunner(root, mode), {
      tasks: ["last-page"],
      arms: ["bare"],
      runs: 1,
      out: root,
    });
    assert.equal(result.rows[0].hiddenAccepted, accepted, mode);
    if (mode === "tamper") assert.equal(result.rows[0].regressions, 0);
    if (mode === "regression") assert.equal(result.rows[0].regressions, 1);
    if (mode === "helper") assert.deepEqual(result.rows[0].changedFiles, ["helper.mjs", "module.mjs"]);
    if (mode === "missing-metadata") assert.equal(result.rows[0].claimsMatched, null);
  }
});

test("an explicit failure experiment may continue, while an absent executable stops safely", (t) => {
  const root = temporary(t);
  const result = runEvaluation(
    { ...fakeRunner(root, "failure"), continueOnRunnerFailure: true },
    {
      tasks: ["last-page"],
      arms: ["bare"],
      runs: 2,
      out: root,
    },
  );
  assert.equal(result.interrupted, false);
  assert.equal(result.rows.length, 2);
  const failed = runEvaluation(
    { command: path.join(root, "absent-executable"), args: [] },
    {
      tasks: ["last-page"],
      arms: ["bare"],
      runs: 1,
      out: root,
    },
  );
  assert.equal(failed.interrupted, true);
  assert.equal(failed.rows[0].runnerError, "ENOENT");
  const rows = [10, 30].map((durationMs) => ({
    arm: "bare",
    durationMs,
    hiddenAccepted: true,
    regressions: 0,
    changedFiles: [],
    tokens: null,
    claimsMatched: null,
  }));
  assert.equal(summarize(rows)[0].medianMs, 20);
});

test("optional measurements stay unavailable and omit unrelated metadata fields", () => {
  const observed = { acceptance: { passed: true } };
  assert.equal(normalizeMetadata({}, observed).claimsMatched, null);
  assert.equal(normalizeMetadata({ tokens: { input: -1, output: 3 } }, observed).tokens, null);
  assert.deepEqual(normalizeMetadata({ tokens: { input: 1, output: 2, private: "omit" } }, observed).tokens, {
    input: 1,
    output: 2,
    source: "runner-reported",
  });
  assert.deepEqual(changedFiles({ "a.mjs": "a", "b.mjs": "b" }, { "a.mjs": "changed", "c.mjs": "new" }), [
    "a.mjs",
    "b.mjs",
    "c.mjs",
  ]);
  assert.deepEqual(summarize([]), []);
});

test("invalid selections fail before invoking a runner", () => {
  const config = { command: process.execPath, args: [] };
  for (const options of [
    { runs: 0 },
    { runs: 1.5 },
    { tasks: ["missing"] },
    { tasks: [] },
    { arms: ["missing"] },
    { arms: [] },
    { arms: ["reference"] },
  ]) {
    assert.throws(() => runEvaluation(config, options));
  }
  assert.throws(() => runEvaluation({ command: "node", args: [1] }));
  assert.throws(() => runEvaluation({ args: [] }));
});

test("CLI rejects malformed options and prints a public selection error", (t) => {
  const root = temporary(t);
  const config = path.join(root, "config.json");
  writeFileSync(config, JSON.stringify(fakeRunner(root, "noop")));
  const command = path.resolve("evals/ab/run.mjs");
  assert.equal(spawnSync(process.execPath, [command, "--config"], { encoding: "utf8" }).status, 1);
  const unknown = spawnSync(process.execPath, [command, "--config", config, "--tasks", "missing"], {
    encoding: "utf8",
  });
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /known task IDs/);
  assert.throws(
    () =>
      runEvaluation(
        { command: process.execPath, args: ["{unknown}"] },
        {
          tasks: ["last-page"],
          arms: ["bare"],
          runs: 1,
          out: root,
        },
      ),
    /unknown runner placeholder/,
  );
  const ran = spawnSync(
    process.execPath,
    [command, "--config", config, "--tasks", "last-page", "--arms", "bare", "--runs", "1", "--out", root],
    { encoding: "utf8" },
  );
  assert.equal(ran.status, 0);
  assert.equal(JSON.parse(ran.stdout).rows[0].hiddenAccepted, false);
});
