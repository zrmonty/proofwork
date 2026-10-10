import { lstat, realpath, mkdir, open, link, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const fail = () => {
  throw new Error("Invalid or conflicting Proofwork hook binding");
};
const hosts = ["codex", "claude-code"];
const identifiers = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/;
const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

function validateIdentifier(value) {
  if (typeof value !== "string" || !identifiers.test(value) || reserved.test(value)) fail();
  return value;
}
export function validateOwner(owner) {
  if (typeof owner !== "string" || !owner.trim() || owner.length > 256 || /[\x00-\x1f]/.test(owner)) fail();
  return owner;
}
export function validateSelection(host, session) {
  if (!hosts.includes(host)) fail();
  validateIdentifier(session);
}
async function inspect(candidate, kind) {
  try {
    const stat = await lstat(candidate);
    if (stat.isSymbolicLink() || !(kind === "file" ? stat.isFile() : stat.isDirectory())) fail();
    return stat;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
async function inspectChain(repo, file, finalKind = "file") {
  const relative = path.relative(repo, path.resolve(file));
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) fail();
  let candidate = repo;
  const components = relative.split(path.sep).filter(Boolean);
  for (let index = 0; index < components.length; index += 1) {
    candidate = path.join(candidate, components[index]);
    if (!(await inspect(candidate, index === components.length - 1 ? finalKind : "directory"))) return null;
  }
  return inspect(candidate, finalKind);
}
async function canonicalRepository(repo) {
  if (typeof repo !== "string" || !repo.trim() || repo.length > 4096) fail();
  const canonical = await realpath(repo);
  if (!(await inspect(canonical, "directory"))) fail();
  return canonical;
}
function bindingPath(repo, host, session) {
  return path.join(repo, ".engineering-team", "hooks", "bindings", host, `${session}.json`);
}
async function readJson(repo, file, maximum) {
  const expected = await inspectChain(repo, file);
  if (!expected) return null;
  const handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const actual = await handle.stat();
    if (!actual.isFile() || actual.size > maximum || actual.ino !== expected.ino || actual.dev !== expected.dev) fail();
    const buffer = Buffer.alloc(maximum + 1);
    let total = 0;
    while (total < buffer.length) {
      const { bytesRead } = await handle.read(buffer, total, buffer.length - total, total);
      if (!bytesRead) break;
      total += bytesRead;
    }
    if (total > maximum) fail();
    return JSON.parse(buffer.subarray(0, total).toString("utf8"));
  } finally {
    await handle.close();
  }
}
async function validateRun(binding) {
  const file = path.join(binding.repo, ".engineering-team", "runs", binding.run, "state.json");
  const state = await readJson(binding.repo, file, 2 * 1024 * 1024);
  if (
    !state ||
    state.schemaVersion !== 1 ||
    state.repo !== binding.repo ||
    state.run !== binding.run ||
    state.owner !== binding.owner ||
    state.activeMode !== "use-proofwork"
  )
    fail();
}
function validateBinding(binding, repo, host, session) {
  const keys = ["schemaVersion", "repo", "host", "session", "run", "owner"];
  if (
    !binding ||
    typeof binding !== "object" ||
    Array.isArray(binding) ||
    Object.keys(binding).length !== keys.length ||
    keys.some((key) => !Object.hasOwn(binding, key))
  )
    fail();
  if (binding.schemaVersion !== 1 || binding.repo !== repo || binding.host !== host || binding.session !== session)
    fail();
  validateIdentifier(binding.run);
  validateOwner(binding.owner);
}
export async function readBinding(repo, host, session) {
  validateSelection(host, session);
  const canonical = await canonicalRepository(repo);
  const binding = await readJson(canonical, bindingPath(canonical, host, session), 16 * 1024);
  if (binding === null) return null;
  validateBinding(binding, canonical, host, session);
  await validateRun(binding);
  return binding;
}
async function ensureDirectories(repo, host) {
  let current = repo;
  for (const component of [".engineering-team", "hooks", "bindings", host]) {
    current = path.join(current, component);
    try {
      await mkdir(current);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    if (!(await inspectChain(repo, current, "directory"))) fail();
  }
}
const sameBinding = (left, right) =>
  ["schemaVersion", "repo", "host", "session", "run", "owner"].every((key) => left[key] === right[key]);

async function publishBinding(binding) {
  const destination = bindingPath(binding.repo, binding.host, binding.session);
  const temporary = path.join(path.dirname(destination), `.${binding.session}.${randomUUID()}.tmp`);
  try {
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(`${JSON.stringify(binding)}\n`);
      await handle.sync();
    } finally {
      await handle.close();
    }
    if (!(await inspectChain(binding.repo, path.dirname(destination), "directory"))) fail();
    try {
      await link(temporary, destination);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const existing = await readBinding(binding.repo, binding.host, binding.session);
      if (!existing || !sameBinding(existing, binding)) fail();
    }
  } finally {
    try {
      await unlink(temporary);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
export async function bind(options) {
  validateSelection(options.host, options.session);
  const repo = await canonicalRepository(options.repo);
  const binding = {
    schemaVersion: 1,
    repo,
    host: options.host,
    session: options.session,
    run: validateIdentifier(options.run),
    owner: validateOwner(options.owner),
  };
  await validateRun(binding);
  const existing = await readBinding(repo, binding.host, binding.session);
  if (existing) {
    if (!sameBinding(existing, binding)) fail();
    return existing;
  }
  await ensureDirectories(repo, binding.host);
  await publishBinding(binding);
  return binding;
}
export async function unbind(options) {
  validateSelection(options.host, options.session);
  const repo = await canonicalRepository(options.repo);
  validateIdentifier(options.run);
  validateOwner(options.owner);
  const existing = await readBinding(repo, options.host, options.session);
  if (!existing) return { unbound: false };
  if (existing.run !== options.run || existing.owner !== options.owner) fail();
  const file = bindingPath(repo, options.host, options.session);
  await inspectChain(repo, file);
  await unlink(file);
  return { unbound: true };
}
function optionsFrom(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]?.slice(2);
    if (
      !args[index]?.startsWith("--") ||
      !["repo", "host", "session", "run", "owner"].includes(key) ||
      !args[index + 1] ||
      Object.hasOwn(options, key)
    )
      fail();
    options[key] = args[index + 1];
  }
  if (Object.keys(options).length !== 5) fail();
  return options;
}
async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!["bind", "unbind"].includes(command)) fail();
  const result = await (command === "bind" ? bind : unbind)(optionsFrom(args));
  console.log(JSON.stringify(result));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(() => {
    console.error(JSON.stringify({ error: "Proofwork hook binding failed; inspect the explicit run and session" }));
    process.exitCode = 1;
  });
}
