import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { resolveModelRoles, planModelRoles } from "../scripts/model-roles.mjs";

const inventory = [
  { id: "code-model", strengths: ["code", "review"], reasoning: ["low", "medium"], available: true },
  { id: "reason-model", strengths: ["reasoning", "review"], reasoning: ["medium", "high"], available: true },
  { id: "review-model", strengths: ["review"], reasoning: ["low"], available: true },
  { id: "writer-model", strengths: ["writing"], reasoning: [], available: true },
];

test("absent configuration inherits; explicit opt in resolves observed capabilities and distinct review models", () => {
  const inherited = resolveModelRoles({}, inventory, "codex");
  assert.equal(inherited.enabled, false);
  for (const role of Object.values(inherited.roles)) {
    assert.deepEqual(role.resolved, { model: "inherit", reasoning: "inherit" });
  }
  const selected = resolveModelRoles({ modelRoles: {} }, inventory, "claude-code");
  assert.equal(selected.enabled, true);
  assert.equal(selected.roles.implementer.resolved.model, "code-model");
  assert.notEqual(selected.roles.reviewer.resolved.model, selected.roles.implementer.resolved.model);
  assert.notEqual(selected.roles.challenger.resolved.model, selected.roles.reasoner.resolved.model);
  assert.equal(selected.roles.writer.resolved.model, "writer-model");
  assert.equal(selected.dispatchUnverified, true);
  assert.equal(selected.budgetEnforcement, "advisory");
  assert.deepEqual(selected.budgets, { maxCandidates: 2, maxReviewers: 2, maxParallel: 3, maxTokens: null });
});

test("explicit unavailable models and unsupported reasoning report missing capabilities without fallback", () => {
  const options = {
    modelRoles: {
      implementer: { model: "unknown-model", reasoning: "inherit" },
      reasoner: { model: "code-model", reasoning: "high" },
      writer: { model: "inherit", reasoning: "inherit" },
    },
  };
  const result = resolveModelRoles(options, inventory, "codex");
  assert.equal(result.roles.implementer.resolved, null);
  assert.ok(result.roles.implementer.capabilityMissing.includes("model-unavailable"));
  assert.equal(result.roles.reasoner.resolved, null);
  assert.ok(result.roles.reasoner.capabilityMissing.includes("reasoning-unsupported"));
  assert.deepEqual(result.roles.writer.resolved, { model: "inherit", reasoning: "inherit" });
  assert.equal(resolveModelRoles({ modelRoles: {} }, [], "codex").roles.writer.resolved, null);
  assert.equal(
    resolveModelRoles({ modelRoles: { writer: { model: "inherit", reasoning: "low" } } }, inventory, "codex").roles
      .writer.resolved,
    null,
  );
  const supported = resolveModelRoles(
    { modelRoles: { reasoner: { model: "reason-model", reasoning: "high" } } },
    inventory,
    "codex",
  );
  assert.deepEqual(supported.roles.reasoner.resolved, { model: "reason-model", reasoning: "high" });
  const unavailable = inventory.map((model) => ({ ...model, available: false }));
  assert.equal(resolveModelRoles({ modelRoles: {} }, unavailable, "codex").roles.implementer.resolved, null);
  const same = resolveModelRoles({ modelRoles: {} }, [inventory[1]], "codex");
  assert.equal(same.roles.challenger.resolved.model, "reason-model");
  assert.ok(same.roles.challenger.advisories.some((value) => value.includes("No distinct")));
  const override = resolveModelRoles(
    { modelRoles: { implementer: { model: "writer-model", reasoning: "inherit" } } },
    inventory,
    "codex",
  );
  assert.equal(override.roles.implementer.resolved.model, "writer-model");
  assert.ok(override.roles.implementer.advisories.some((value) => value.includes("no observed strength")));
});

test("configuration and inventory validation rejects ambiguity rather than rewriting defaults", () => {
  for (const config of [
    null,
    [],
    { modelRoles: null },
    { modelRoles: { typo: {} } },
    { modelRoles: { writer: { model: "code-model", reasoning: "maximum" } } },
    { modelRoles: { writer: { model: "code-model" } } },
    { modelBudgets: { maxParallel: 4 } },
    { modelBudgets: { maxCandidates: 0 } },
    { modelBudgets: { maxTokens: -1 } },
    { modelBudgets: { extra: 1 } },
    { modelBudgets: null },
    { modelBudgets: { maxReviewers: 3 } },
    { modelRoles: { writer: { model: "bad model", reasoning: "inherit" } } },
  ])
    assert.throws(() => resolveModelRoles(config, inventory, "codex"));
  for (const models of [
    null,
    {},
    [...inventory, inventory[0]],
    [{ ...inventory[0], available: "yes" }],
    [{ ...inventory[0], strengths: ["magic"] }],
    [{ ...inventory[0], reasoning: ["maximum"] }],
    [{ ...inventory[0], strengths: ["code", "code"] }],
    [{ ...inventory[0], id: "inherit" }],
    [{ ...inventory[0], strengths: null }],
  ]) {
    assert.throws(() => resolveModelRoles({}, models, "codex"));
  }
  assert.throws(() => resolveModelRoles({}, inventory, "unknown"));
  const configured = resolveModelRoles(
    {
      modelRoles: {},
      modelBudgets: {
        maxCandidates: 1,
        maxReviewers: 1,
        maxParallel: 2,
        maxTokens: 10000,
      },
    },
    inventory,
    "codex",
  );
  assert.equal(configured.budgets.maxTokens, 10000);
  assert.equal(resolveModelRoles({ modelBudgets: { maxTokens: null } }, inventory, "codex").budgets.maxTokens, null);
});

test("planner is read only, bounded and CLI errors omit supplied secrets", async (t) => {
  const repo = await mkdtemp(path.join(tmpdir(), "proofwork-models-"));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const source = JSON.stringify({ unrelatedSetting: "preserve", modelRoles: {} });
  await writeFile(path.join(repo, ".proofwork.json"), source);
  const file = path.join(repo, "inventory.json");
  await writeFile(file, JSON.stringify(inventory));
  assert.equal((await planModelRoles({ repo, host: "codex", inventory: file })).enabled, true);
  assert.equal(await readFile(path.join(repo, ".proofwork.json"), "utf8"), source);
  await rm(path.join(repo, ".proofwork.json"));
  assert.equal((await planModelRoles({ repo, host: "codex", inventory: "inventory.json" })).enabled, false);
  await writeFile(path.join(repo, ".proofwork.json"), source);
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: "../outside.json" }));
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: "missing.json" }));
  await assert.rejects(planModelRoles({ repo: file, host: "codex", inventory: file }));
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: null }));
  const cli = (args) =>
    spawnSync(process.execPath, ["scripts/model-roles.mjs", ...args], { encoding: "utf8", windowsHide: true });
  const args = ["plan", "--repo", repo, "--host", "codex", "--inventory", file];
  assert.equal(cli(args).status, 0);
  for (const invalid of [[], ["plan", "--repo", "token=privatevalue"], [...args, "--host", "token=privatevalue"]]) {
    const result = cli(invalid);
    assert.equal(result.status, 1);
    assert.doesNotMatch(result.stderr, /privatevalue/);
    assert.equal(typeof JSON.parse(result.stderr).error, "string");
  }
  await writeFile(file, "x".repeat(1048577));
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: file }));
  await writeFile(file, "{invalid json");
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: file }));
  await writeFile(file, JSON.stringify(inventory));
  await writeFile(path.join(repo, ".proofwork.json"), "x".repeat(65537));
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: file }));
  await rm(path.join(repo, ".proofwork.json"));
  await symlink(repo, path.join(repo, ".proofwork.json"), "junction");
  await assert.rejects(planModelRoles({ repo, host: "codex", inventory: file }));
});

test("a third arena candidate requires explicit configuration and remains bounded", () => {
  assert.equal(resolveModelRoles({}, [], "codex").budgets.maxCandidates, 2);
  assert.equal(resolveModelRoles({ modelBudgets: { maxCandidates: 3 } }, [], "codex").budgets.maxCandidates, 3);
  assert.throws(() => resolveModelRoles({ modelBudgets: { maxCandidates: 4 } }, [], "codex"));
});
