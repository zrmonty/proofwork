import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function validateFormat(format) {
  if (!["proofwork", "conventional", "off"].includes(format))
    throw new Error("commitFormat must be proofwork, conventional or off");
  return format;
}
export function configuredCommitFormat(repo) {
  let root = resolve(repo);
  try { root = git(repo, ["rev-parse", "--show-toplevel"]).trim(); }
  catch { /* Non-Git targets use their own config. */ }
  try {
    const config = JSON.parse(readFileSync(resolve(root, ".proofwork.json"), "utf8"));
    if (!config || typeof config !== "object" || Array.isArray(config))
      throw new Error("commitFormat configuration must be an object");
    return validateFormat(Object.hasOwn(config, "commitFormat") ? config.commitFormat : "off");
  } catch (error) { if (error.code === "ENOENT") return "off"; throw error; }
}
function conventionalErrors(message) {
  const lines = message.split(/\r?\n/);
  const header = /^[a-z][a-z0-9_-]*(?:\(([^()\r\n]+)\))?!?: \S.*$/i.exec(lines[0]);
  if (!header || (header[1] !== undefined && !header[1].trim()))
    return ["Conventional subject must use type(scope)!: description; scope and ! are optional"];
  return lines.length > 1 && lines[1].trim() ? ["Conventional body must follow a blank line"] : [];
}

export function checkMessage(message, format = "proofwork") {
  validateFormat(format);
  if (format === "off") return [];
  if (format === "conventional") return conventionalErrors(message);
  const lines = message.split(/\r?\n/);
  return ["Major features", "Minor features"].flatMap((heading) => {
    const positions = lines.flatMap((line, index) => (line.trim().replace(/:$/, "") === heading ? [index] : []));
    if (positions.length !== 1) return [`${heading} must appear exactly once`];
    const start = positions[0] + 1;
    const following = lines.slice(start);
    const end = following.findIndex((line) =>
      /^(Major features|Minor features|Validation|Breaking changes):?$/.test(line.trim()),
    );
    const content = (end < 0 ? following : following.slice(0, end)).join("\n").replace(/[\s*-]/g, "");
    return content ? [] : [`${heading} is empty; describe the changes or write None`];
  });
}

function git(repo, args) {
  const result = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || "Git command failed");
  return result.stdout;
}

export function checkRange(repo, range, format = configuredCommitFormat(repo)) {
  validateFormat(format);
  if (typeof range !== "string" || !range || range.startsWith("-") || /[\r\n\0]/.test(range))
    throw new Error("Supply a valid explicit Git revision or outgoing range");
  if (format === "off") return [];
  const commits = git(repo, ["rev-list", "--end-of-options", range]).trim().split(/\r?\n/).filter(Boolean);
  return commits.map((commit) => ({
    commit, errors: checkMessage(git(repo, ["show", "-s", "--format=%B", commit]), format),
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4 || args[0] !== "--repo" || args[2] !== "--range")
      throw new Error("Usage: node check-commits.mjs --repo PATH --range GIT_RANGE");
    const format = configuredCommitFormat(args[1]);
    const result = checkRange(args[1], args[3], format);
    process.stdout.write(`${JSON.stringify({ format, enabled: format !== "off", commits: result }, null, 2)}\n`);
    if (result.some((item) => item.errors.length)) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
