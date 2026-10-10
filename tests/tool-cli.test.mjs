import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

test("commit checker CLI checks real outgoing commits and rejects invalid arguments", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-commit-cli-"));
  const git = (args) => spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  const run = (args) => spawnSync(process.execPath, ["scripts/check-commits.mjs", ...args], { encoding: "utf8" });
  try {
    await writeFile(path.join(root, ".proofwork.json"), JSON.stringify({ commitFormat: "proofwork" }));
    for (const args of [
      ["init"],
      ["config", "user.name", "Fixture"],
      ["config", "user.email", "fixture@example.invalid"],
    ]) {
      assert.equal(git(args).status, 0);
    }
    assert.equal(git(["commit", "--allow-empty", "-m", "Major features\nNone\nMinor features\nNone"]).status, 0);
    assert.equal(run(["--repo", root, "--range", "HEAD"]).status, 0);
    assert.equal(git(["commit", "--allow-empty", "-m", "missing feature sections"]).status, 0);
    assert.equal(run(["--repo", root, "--range", "HEAD~1..HEAD"]).status, 1);
    assert.equal(run([]).status, 1);
    assert.equal(run(["--repo", root, "--range", "--all"]).status, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("coverage checker CLI provides usage and rejects malformed configurations", () => {
  const run = (args) => spawnSync(process.execPath, ["scripts/check-coverage.mjs", ...args], { encoding: "utf8" });
  assert.match(run(["--help"]).stdout, /threshold/);
  for (const args of [[], ["--bad", "a"], ["--report"], ["--report", "a", "--report", "b"]]) {
    assert.equal(run(args).status, 1);
  }
});
