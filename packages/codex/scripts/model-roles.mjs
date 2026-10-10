import { lstat, realpath, open } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const preferences = {
  implementer: ["code"],
  reasoner: ["reasoning"],
  reviewer: ["review"],
  challenger: ["reasoning", "review"],
  writer: ["writing"],
};
const reasoningLevels = ["low", "medium", "high"];
const defaultBudgets = { maxCandidates: 2, maxReviewers: 2, maxParallel: 3, maxTokens: null };
const fail = () => {
  throw new Error("Invalid Proofwork model role configuration or inventory");
};
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const modelId = (value) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/.test(value);

function validateInventory(inventory) {
  if (!Array.isArray(inventory) || inventory.length > 256) fail();
  const names = new Set();
  for (const model of inventory) {
    if (
      !object(model) ||
      !modelId(model.id) ||
      model.id === "inherit" ||
      names.has(model.id) ||
      typeof model.available !== "boolean"
    )
      fail();
    for (const [field, allowed] of [
      ["strengths", ["code", "reasoning", "review", "writing"]],
      ["reasoning", reasoningLevels],
    ]) {
      if (
        !Array.isArray(model[field]) ||
        model[field].length > allowed.length ||
        new Set(model[field]).size !== model[field].length ||
        model[field].some((value) => !allowed.includes(value))
      )
        fail();
    }
    names.add(model.id);
  }
}
function validateConfiguration(config) {
  if (!object(config)) fail();
  if (Object.hasOwn(config, "modelRoles")) {
    if (!object(config.modelRoles)) fail();
    for (const [role, requested] of Object.entries(config.modelRoles)) {
      if (
        !Object.hasOwn(preferences, role) ||
        !object(requested) ||
        Object.keys(requested).length !== 2 ||
        !modelId(requested.model) ||
        !["inherit", ...reasoningLevels].includes(requested.reasoning)
      )
        fail();
    }
  }
  const budgets = { ...defaultBudgets };
  if (Object.hasOwn(config, "modelBudgets")) {
    if (!object(config.modelBudgets)) fail();
    for (const [name, value] of Object.entries(config.modelBudgets)) {
      if (!Object.hasOwn(defaultBudgets, name)) fail();
      if (name === "maxTokens" && value === null) continue;
      const maximum = name === "maxTokens" ? 1000000000 : defaultBudgets[name];
      if (!Number.isSafeInteger(value) || value < 1 || value > maximum) fail();
      budgets[name] = value;
    }
  }
  return budgets;
}
function automaticModel(role, inventory, avoid) {
  const score = (model) => preferences[role].filter((strength) => model.strengths.includes(strength)).length;
  const candidates = inventory
    .filter((model) => model.available && score(model) > 0)
    .sort((left, right) => score(right) - score(left) || left.id.localeCompare(right.id, "en"));
  return candidates.find((model) => model.id !== avoid) ?? candidates[0];
}
function resolveRole(role, configured, inventory, enabled, avoid) {
  const requested = {
    model: configured?.model ?? (enabled ? null : "inherit"),
    reasoning: configured?.reasoning ?? "inherit",
    selection: configured ? "explicit" : enabled ? "capability" : "inherit",
  };
  const capabilityMissing = [];
  const advisories = [];
  let resolved = null;
  if (requested.model === "inherit") {
    if (requested.reasoning !== "inherit") capabilityMissing.push("inherited-model-reasoning-unverified");
    else resolved = { model: "inherit", reasoning: "inherit" };
  } else {
    const model =
      requested.model === null
        ? automaticModel(role, inventory, avoid)
        : inventory.find((model) => model.id === requested.model && model.available);
    if (!model) capabilityMissing.push(requested.model === null ? "role-strength-unavailable" : "model-unavailable");
    else if (requested.reasoning !== "inherit" && !model.reasoning.includes(requested.reasoning))
      capabilityMissing.push("reasoning-unsupported");
    else {
      resolved = { model: model.id, reasoning: requested.reasoning };
      if (!preferences[role].some((strength) => model.strengths.includes(strength)))
        advisories.push("Configured model has no observed strength matching this role.");
      if (avoid && model.id === avoid)
        advisories.push("No distinct model selected; reviewer independence is unverified.");
    }
  }
  if (role === "implementer")
    advisories.push("Economy is a preference; supplied inventory contains no price evidence.");
  if (["reviewer", "challenger"].includes(role))
    advisories.push("A distinct model does not establish independent review; isolate context and verify findings.");
  return { requested, resolved, capabilityPreferences: [...preferences[role]], capabilityMissing, advisories };
}
export function resolveModelRoles(config, inventory, host) {
  if (!["codex", "claude-code"].includes(host)) fail();
  validateInventory(inventory);
  const budgets = validateConfiguration(config);
  const enabled = Object.hasOwn(config, "modelRoles");
  const roles = {};
  for (const role of Object.keys(preferences)) {
    const avoid =
      role === "reviewer"
        ? roles.implementer.resolved?.model
        : role === "challenger"
          ? roles.reasoner.resolved?.model
          : undefined;
    roles[role] = resolveRole(role, config.modelRoles?.[role], inventory, enabled, avoid);
  }
  return { host, enabled, roles, budgets, budgetEnforcement: "advisory", dispatchUnverified: true };
}
async function readJson(file, limit, optional = false) {
  let stat;
  try {
    stat = await lstat(file);
  } catch (error) {
    if (optional && error.code === "ENOENT") return {};
    throw error;
  }
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > limit) fail();
  const handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const actual = await handle.stat();
    if (!actual.isFile() || actual.ino !== stat.ino || actual.dev !== stat.dev) fail();
    const buffer = Buffer.alloc(limit + 1);
    let total = 0;
    while (total < buffer.length) {
      const { bytesRead } = await handle.read(buffer, total, buffer.length - total, total);
      if (!bytesRead) break;
      total += bytesRead;
    }
    if (total > limit) fail();
    return JSON.parse(buffer.subarray(0, total).toString("utf8"));
  } finally {
    await handle.close();
  }
}
export async function planModelRoles(options) {
  if (
    typeof options.repo !== "string" ||
    !options.repo ||
    typeof options.inventory !== "string" ||
    !options.inventory ||
    options.repo.length > 4096 ||
    options.inventory.length > 4096
  )
    fail();
  const repo = await realpath(options.repo);
  if (!(await lstat(repo)).isDirectory()) fail();
  const inventoryPath = path.resolve(repo, options.inventory);
  const relative = path.relative(repo, inventoryPath);
  if (!path.isAbsolute(options.inventory) && (relative === ".." || relative.startsWith(`..${path.sep}`))) fail();
  const config = await readJson(path.join(repo, ".proofwork.json"), 65536, true);
  const inventory = await readJson(inventoryPath, 1048576);
  return resolveModelRoles(config, inventory, options.host);
}
async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command !== "plan") fail();
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    if (
      !["--repo", "--host", "--inventory"].includes(name) ||
      !args[index + 1] ||
      Object.hasOwn(options, name.slice(2))
    )
      fail();
    options[name.slice(2)] = args[index + 1];
  }
  if (Object.keys(options).length !== 3) fail();
  console.log(JSON.stringify(await planModelRoles(options), null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(() => {
    console.error(
      JSON.stringify({ error: "Proofwork model role planning failed; inspect configuration and inventory" }),
    );
    process.exitCode = 1;
  });
}
