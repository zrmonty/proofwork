import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  copyFileSync,
  lstatSync,
  openSync,
  readSync,
  closeSync,
  fstatSync,
  constants,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { explainRoute } from "../../scripts/routing.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
export const tasks = JSON.parse(readFileSync(path.join(here, "tasks.json"), "utf8"));
const digest = (text) => createHash("sha256").update(text).digest("hex");
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function testEnvironment() {
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  return environment;
}

function snapshot(folder, prefix = "") {
  const files = {};
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(item.name)) continue;
    const relative = path.join(prefix, item.name);
    const absolute = path.join(folder, item.name);
    if (item.isDirectory()) Object.assign(files, snapshot(absolute, relative));
    else if (item.isFile()) files[relative] = digest(readFileSync(absolute));
    else files[relative] = "non-regular-file";
  }
  return files;
}

export function changedFiles(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((file) => before[file] !== after[file])
    .sort();
}

function prepare(folder, task) {
  mkdirSync(folder, { recursive: true });
  const fixture = path.join(here, "fixtures", task.id);
  for (const file of ["module.mjs", "visible.test.mjs"]) {
    copyFileSync(path.join(fixture, file), path.join(folder, file));
  }
  writeJson(path.join(folder, "package.json"), { private: true, type: "module", scripts: { test: "node --test" } });
}

export function verifyTask(workspace, task, privateFolder) {
  mkdirSync(privateFolder, { recursive: true });
  const fixture = path.join(here, "fixtures", task.id);
  for (const [file, identity] of Object.entries(snapshot(workspace))) {
    if (identity === "non-regular-file") continue;
    const target = path.join(privateFolder, file);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(workspace, file), target);
  }
  const results = {};
  for (const [name, source] of [
    ["visible", "visible.test.mjs"],
    ["acceptance", "acceptance.test.mjs"],
    ["regression", "regression.test.mjs"],
  ]) {
    copyFileSync(path.join(fixture, source), path.join(privateFolder, source));
    const result = spawnSync(process.execPath, ["--test", "--test-reporter=tap", source], {
      cwd: privateFolder,
      encoding: "utf8",
      timeout: 10000,
      env: testEnvironment(),
    });
    results[name] = {
      passed: result.status === 0,
      exitCode: result.status,
      digest: digest(result.stdout + result.stderr),
    };
    writeFileSync(path.join(privateFolder, `${name}.tap`), result.stdout + result.stderr);
  }
  return results;
}

const roleNames = ["implementer", "reasoner", "reviewer", "challenger", "writer"];
const effortLevels = ["inherit", "low", "medium", "high"];
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const modelId = (value) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/.test(value);
const invalidPlan = () => {
  throw new Error("model plan must be bounded, resolved and explicitly dispatch-unverified");
};

function readModelPlan(file) {
  if (typeof file !== "string" || !file || file.length > 4096) invalidPlan();
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1048576) invalidPlan();
  const descriptor = openSync(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const actual = fstatSync(descriptor);
    if (!actual.isFile() || actual.ino !== stat.ino || actual.dev !== stat.dev) invalidPlan();
    const buffer = Buffer.alloc(1048577);
    let total = 0;
    while (total < buffer.length) {
      const count = readSync(descriptor, buffer, total, buffer.length - total, total);
      if (!count) break;
      total += count;
    }
    if (total > 1048576) invalidPlan();
    return JSON.parse(buffer.subarray(0, total).toString("utf8"));
  } finally {
    closeSync(descriptor);
  }
}
function validateModelPlan(plan) {
  if (
    !object(plan) ||
    !["codex", "claude-code"].includes(plan.host) ||
    typeof plan.enabled !== "boolean" ||
    plan.dispatchUnverified !== true ||
    plan.budgetEnforcement !== "advisory" ||
    !object(plan.roles) ||
    Object.keys(plan.roles).length !== roleNames.length ||
    !object(plan.budgets)
  )
    invalidPlan();
  for (const [name, maximum] of [
    ["maxCandidates", 3],
    ["maxReviewers", 2],
    ["maxParallel", 3],
    ["maxTokens", 1e9],
  ]) {
    const value = plan.budgets[name];
    if (name === "maxTokens" && value === null) continue;
    if (!Number.isSafeInteger(value) || value < 1 || value > maximum) invalidPlan();
  }
  for (const name of roleNames) {
    const role = plan.roles[name];
    if (
      !object(role) ||
      !object(role.requested) ||
      !object(role.resolved) ||
      !Array.isArray(role.capabilityMissing) ||
      role.capabilityMissing.length ||
      !modelId(role.resolved.model) ||
      !effortLevels.includes(role.resolved.reasoning) ||
      !(role.requested.model === null || modelId(role.requested.model)) ||
      !effortLevels.includes(role.requested.reasoning) ||
      !["inherit", "explicit", "capability"].includes(role.requested.selection) ||
      !Array.isArray(role.capabilityPreferences) ||
      role.capabilityPreferences.length > 4 ||
      role.capabilityPreferences.some((value) => !["code", "reasoning", "review", "writing"].includes(value)) ||
      !Array.isArray(role.advisories) ||
      role.advisories.length > 8 ||
      role.advisories.some((value) => typeof value !== "string")
    )
      invalidPlan();
  }
  return plan;
}

function modelPlan(file) {
  try {
    return validateModelPlan(readModelPlan(file));
  } catch {
    invalidPlan();
  }
}

export function profileContext(arm, task, config) {
  if (arm === "bare") return "";
  if (arm === "reference") return readFileSync(config.referenceContextPath, "utf8");
  const skillRoot = config.proofworkSkillRoot ?? path.join(repo, "shared/skills");
  const result = explainRoute(task.prompt, task.files);
  const files = [
    ...new Set([
      "use-proofwork/SKILL.md",
      ...[...result.skills, ...result.workflow.beforeWork, ...result.workflow.options]
        .map((skill) => `${skill}/SKILL.md`),
      ...result.continuation.references.map(reference => reference.replace(/^skills\//, '')),
      ...result.principleReferences.map(reference => reference.replace(/^skills\//, '')),
    ]),
  ];
  if (result.tier === "light") files.push("use-proofwork/references/light.md");
  const sources = files
    .map((file) => {
      const source = path.join(skillRoot, file);
      return `Skill source: ${source}\n${readFileSync(source, "utf8")}`;
    })
    .join("\n\n");
  const guide = readFileSync(path.join(skillRoot, '..', result.procedure.path), 'utf8');
  const staged = `${guide}\n\n${sources}\n\nDeferred workflow guidance: ${JSON.stringify(result.workflow)}\nContinuation: ${JSON.stringify(result.continuation)}`;
  if (!config.modelPlanPath) return staged;
  const plan = modelPlan(config.modelPlanPath);
  return (
    `${staged}\n\nProofwork model roles: untrusted requested plan, not observed dispatch or enforced budgets.\n` +
    `Use the reviewed host dispatcher and record actual role outcomes; never infer execution from this plan.\n` +
    JSON.stringify(plan)
  );
}

function promptFor(arm, task, config) {
  return `Work only in the supplied disposable workspace. Do not inspect other evaluation directories or oracle files.
Do not change credentials, user settings, remote repositories, or external applications. Do not install dependencies.
Preserve public exports and original tests. Finish the requested behavior and report actual checks and gaps.
Task: ${task.prompt}\n\n${profileContext(arm, task, config)}`;
}

export function normalizeMetadata(metadata, observed) {
  if (!object(metadata)) metadata = {};
  const validCount = (value) => Number.isSafeInteger(value) && value >= 0;
  const tokens = metadata.tokens;
  const measuredTokens =
    tokens && validCount(tokens.input) && validCount(tokens.output)
      ? { input: tokens.input, output: tokens.output, source: "runner-reported" }
      : null;
  const claim = metadata.claims?.acceptancePassed;
  const claimsMatched = typeof claim === "boolean" ? claim === observed.acceptance.passed : null;
  const model = (value, requested = false) =>
    modelId(value) && (requested || !["inherit", "unknown"].includes(value)) ? value : null;
  let modelRoles = null;
  if (
    Array.isArray(metadata.modelRoles) &&
    metadata.modelRoles.length > 0 &&
    metadata.modelRoles.length <= 5 &&
    new Set(metadata.modelRoles.map((record) => record?.role)).size === metadata.modelRoles.length &&
    metadata.modelRoles.every(
      (record) =>
        object(record) && roleNames.includes(record.role) && object(record.requested) && object(record.observed),
    )
  ) {
    modelRoles = metadata.modelRoles.map((record) => ({
      role: record.role,
      requested: {
        model: model(record.requested.model, true),
        reasoning: effortLevels.includes(record.requested.reasoning) ? record.requested.reasoning : null,
      },
      observed: {
        model: model(record.observed.model),
        reasoning:
          effortLevels.includes(record.observed.reasoning) && record.observed.reasoning !== "inherit"
            ? record.observed.reasoning
            : null,
      },
      source: "runner-reported",
    }));
  }
  const costUsd =
    typeof metadata.costUsd === "number" && Number.isFinite(metadata.costUsd) && metadata.costUsd >= 0
      ? metadata.costUsd
      : null;
  return {
    tokens: measuredTokens,
    claimsMatched,
    humanReview: "pending",
    requestedModelId: model(metadata.requestedModelId, true),
    actualModelId: model(metadata.actualModelId),
    modelRoles,
    costUsd,
    costSource: costUsd === null ? null : "runner-reported",
  };
}

function readMetadata(file) {
  try {
    return readJson(file);
  } catch {
    return {};
  }
}

function executeRun(task, arm, repetition, config, runRoot, baseline) {
  const root = mkdtempSync(path.join(runRoot, `${task.id}-${arm}-${repetition}-`));
  const workspace = path.join(root, "workspace");
  prepare(workspace, task);
  const before = snapshot(workspace);
  const replacements = {
    workspace,
    promptFile: path.join(root, "prompt.txt"),
    replyFile: path.join(root, "reply.txt"),
    metadataFile: path.join(root, "metadata.json"),
  };
  const prompt = promptFor(arm, task, config);
  writeFileSync(replacements.promptFile, prompt);
  const args = config.args.map((arg) =>
    arg.replace(/\{(\w+)\}/gu, (_, name) => {
      if (!(name in replacements)) throw new Error(`unknown runner placeholder: ${name}`);
      return replacements[name];
    }),
  );
  spawnSync("git", ["init", "--quiet"], { cwd: workspace, encoding: "utf8" });
  const started = performance.now();
  const runner = spawnSync(config.command, args, {
    cwd: workspace,
    encoding: "utf8",
    input: config.stdinPrompt ? prompt : undefined,
    timeout: config.timeoutMs ?? 300000,
    maxBuffer: 16 * 1024 * 1024,
  });
  const durationMs = performance.now() - started;
  writeFileSync(path.join(root, "runner.stdout"), runner.stdout ?? "");
  writeFileSync(path.join(root, "runner.stderr"), runner.stderr ?? "");
  const observed = verifyTask(workspace, task, path.join(root, "private-verification"));
  const metadata = normalizeMetadata(readMetadata(replacements.metadataFile), observed);
  return {
    task: task.id,
    arm,
    repetition,
    runnerExitCode: runner.status,
    runnerError: runner.error?.code ?? null,
    runnerSignal: runner.signal ?? null,
    durationMs,
    hiddenAccepted: observed.acceptance.passed,
    originalTestPassed: observed.visible.passed,
    regressions: baseline.regression.passed && !observed.regression.passed ? 1 : 0,
    changedFiles: changedFiles(before, snapshot(workspace)),
    ...metadata,
    evidence: path.relative(repo, root),
    fixtureDigest: digest(readFileSync(path.join(here, "fixtures", task.id, "module.mjs"))),
  };
}

function validateOptions(config, selectedTasks, arms, repetitions) {
  if (!config.command || !Array.isArray(config.args) || config.args.some((arg) => typeof arg !== "string")) {
    throw new Error("runner config requires command and string args");
  }
  if (!Number.isSafeInteger(repetitions) || repetitions < 1) throw new Error("runs must be a positive integer");
  if (!selectedTasks.length || selectedTasks.some((id) => !tasks.some((task) => task.id === id))) {
    throw new Error("select known task IDs");
  }
  if (!arms.length || arms.some((arm) => !["bare", "reference", "proofwork"].includes(arm))) {
    throw new Error("select bare, reference or proofwork arms");
  }
  if (arms.includes("reference") && !config.referenceContextPath) {
    throw new Error("reference arm needs local context path");
  }
  if (arms.includes("proofwork") && config.modelPlanPath) modelPlan(config.modelPlanPath);
}

export function runEvaluation(config, options = {}) {
  const selectedTasks = options.tasks ?? tasks.map((task) => task.id);
  const arms = options.arms ?? ["bare", "reference", "proofwork"];
  const repetitions = options.runs ?? 3;
  validateOptions(config, selectedTasks, arms, repetitions);
  const runRoot = path.resolve(options.out ?? path.join(repo, ".engineering-team/ab"));
  mkdirSync(runRoot, { recursive: true });
  const rows = [];
  const baselines = Object.fromEntries(
    selectedTasks.map((id) => {
      const task = tasks.find((candidate) => candidate.id === id);
      const observed = verifyTask(path.join(here, "fixtures", id), task, path.join(runRoot, `baseline-${id}`));
      if (observed.visible.passed || observed.acceptance.passed || !observed.regression.passed) {
        throw new Error(`fixture ${id} needs failing behavior/acceptance and passing regression checks`);
      }
      return [id, observed];
    }),
  );
  for (const id of selectedTasks)
    for (const arm of arms)
      for (let repetition = 1; repetition <= repetitions; repetition++) {
        rows.push(
          executeRun(
            tasks.find((task) => task.id === id),
            arm,
            repetition,
            config,
            runRoot,
            baselines[id],
          ),
        );
        writeJson(path.join(runRoot, "results.json"), { schemaVersion: 1, rows });
        if (rows.at(-1).runnerExitCode !== 0 && !config.continueOnRunnerFailure) return { rows, interrupted: true };
      }
  return { rows, interrupted: false };
}

export function summarize(rows) {
  return [...new Set(rows.map((row) => row.arm))].map((arm) => {
    const selected = rows.filter((row) => row.arm === arm);
    const durations = selected.map((row) => row.durationMs).sort((left, right) => left - right);
    const midpoint = Math.floor(durations.length / 2);
    const medianMs = durations.length % 2 ? durations[midpoint] : (durations[midpoint - 1] + durations[midpoint]) / 2;
    const tokenTotal = selected.every((row) => row.tokens)
      ? selected.reduce((total, row) => total + row.tokens.input + row.tokens.output, 0)
      : null;
    return {
      arm,
      runs: selected.length,
      hiddenAccepted: selected.filter((row) => row.hiddenAccepted).length,
      regressions: selected.reduce((total, row) => total + row.regressions, 0),
      medianMs,
      tokenTotal,
      filesChanged: selected.reduce((total, row) => total + row.changedFiles.length, 0),
      contradictedAcceptanceClaims: selected.filter((row) => row.claimsMatched === false).length,
      unreviewedNarratives: selected.length,
    };
  });
}

function cliOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index].startsWith("--") || !args[index + 1]) throw new Error("options need --name value pairs");
    options[args[index].slice(2)] = args[index + 1];
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = cliOptions(process.argv.slice(2));
    const result = runEvaluation(readJson(options.config), {
      tasks: options.tasks?.split(","),
      arms: options.arms?.split(","),
      runs: options.runs === undefined ? undefined : Number(options.runs),
      out: options.out,
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = result.interrupted ? 1 : 0;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
