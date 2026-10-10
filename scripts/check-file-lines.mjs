import { readFile, realpath, lstat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const MAX_CODE_LINES = null;
export async function configuredLimit(repo) {
  try {
    const config = JSON.parse(await readFile(path.join(repo, ".proofwork.json"), "utf8"));
    return validateLimit(config.maxFileLines ?? null);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
function validateLimit(limit) {
  if (limit !== null && (!Number.isSafeInteger(limit) || limit < 1)) {
    throw new Error("file-line limit must be a positive safe integer or null");
  }
  return limit;
}
export function countLines(text) {
  if (!text) return 0;
  const lines = text.split(/\r\n|\n|\r/);
  return lines.length - (lines.at(-1) === "" ? 1 : 0);
}
const extensions = [
  "[cm]?[jt]sx?|rs|pyi?|go|java|kt|kts|scala|c|h|cc|cpp|cxx|hpp|cs|fs|fsx|vb|rb|php|swift|m|mm|dart",
  "vue|svelte|html?|css|scss|sass|less|sql|sh|bash|zsh|fish|ps1|psm1|psd1|bat|cmd|lua|r|ex|exs|erl|hrl",
  "clj|cljs|cljc|edn|hs|lhs|elm|zig|cuh?|proto|graphql|gql|tf|hcl|pl|pm|jl|groovy|gradle|sol|wat|wast",
];
const codeExtension = new RegExp(`\\.(?:${extensions.join("|")})$`, "i");
const codeFile = (name) =>
  codeExtension.test(name) ||
  /(?:^|\/)(?:Dockerfile(?:\.[^/]+)?|[^/]+\.Dockerfile|Containerfile|Makefile|GNUmakefile|CMakeLists\.txt)$/i.test(
    name,
  );
const validPath = (name) =>
  typeof name === "string" &&
  name.length > 0 &&
  !/[\\:\x00-\x1f]/.test(name) &&
  !name.startsWith("/") &&
  name.split("/").every((part) => part && part !== "." && part !== "..");
function git(repo, args) {
  const result = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || "Git discovery failed");
  return result.stdout;
}
function decode(bytes) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe ? "utf-16le" : bytes[0] === 0xfe && bytes[1] === 0xff ? "utf-16be" : "utf-8";
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
  if (text.includes("\0")) throw new Error("source contains NUL; supply supported text encoding");
  return text;
}
export async function checkFileLines(repo, additional = [], limit = undefined) {
  if (!Array.isArray(additional) || !additional.every(validPath))
    throw new Error("additional inventory must contain repository-relative file paths");
  const root = await realpath(git(path.resolve(repo), ["rev-parse", "--show-toplevel"]).trim());
  const maximum = validateLimit(limit === undefined ? await configuredLimit(root) : limit);
  if (maximum === null)
    return { passed: true, enabled: false, limit: null, repository: root, scanned: 0, violations: [], files: [] };
  const discovered = git(root, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .split("\0")
    .filter(Boolean)
    .filter(codeFile);
  const names = [...new Set([...discovered, ...additional])].sort();
  if (!names.length) throw new Error("no code files discovered; verify the additional inventory");
  const files = await Promise.all(
    names.map(async (name) => {
      if (!validPath(name)) throw new Error("unsafe source path");
      const target = path.resolve(root, name);
      const resolved = await realpath(target);
      const relative = path.relative(root, resolved);
      if (
        relative === ".." ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative) ||
        !(await lstat(target)).isFile()
      )
        throw new Error(`unsafe or non-file source: ${name}`);
      return { path: name, lines: countLines(decode(await readFile(target))) };
    }),
  );
  const violations = files.filter((file) => file.lines > maximum);
  return {
    passed: violations.length === 0,
    enabled: true,
    limit: maximum,
    repository: root,
    scanned: files.length,
    violations,
    files,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === "--help")
      console.log("node check-file-lines.mjs --repo PATH [--inventory PATH] [--limit N] (disabled unless configured)");
    else {
      const options = {};
      for (let index = 0; index < args.length; index += 2) {
        const key = args[index];
        if (!["--repo", "--inventory", "--limit"].includes(key) || !args[index + 1] || Object.hasOwn(options, key))
          throw new Error("invalid or duplicate file-line option");
        options[key] = args[index + 1];
      }
      if (!options["--repo"]) throw new Error("supply --repo");
      const additional = options["--inventory"] ? JSON.parse(await readFile(options["--inventory"], "utf8")) : [];
      const limit = options["--limit"] === undefined ? undefined : Number(options["--limit"]);
      const result = await checkFileLines(options["--repo"], additional, limit);
      console.log(JSON.stringify(result, null, 2));
      if (!result.passed) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
