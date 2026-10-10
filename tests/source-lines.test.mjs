import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { longLines, checkSourceLines } from "../scripts/check-source-lines.mjs";

test("source width includes comments, accepts120 and reports121 with physical positions", () => {
  assert.deepEqual(longLines("x".repeat(120)), []);
  assert.deepEqual(longLines(`short\r\n${"x".repeat(121)}`), [{ line: 2, length: 121 }]);
  assert.throws(() => longLines("text", 0), /invalid/);
});

test("source-width CLI checks discovered production scripts and reports failures", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-source-width-"));
  const script = path.resolve("scripts/check-source-lines.mjs");
  const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
  try {
    assert.equal(run().status, 1);
    await mkdir(path.join(root, "scripts"));
    await writeFile(path.join(root, "scripts/a.mjs"), "short");
    await writeFile(path.join(root, "scripts/README.md"), "x".repeat(500));
    assert.equal(run().status, 0);
    await writeFile(path.join(root, "scripts/a.mjs"), "x".repeat(121));
    assert.equal(run().status, 1);
    assert.match(run().stdout, /121/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("source width checks selected source contents without rewriting them", async () => {
  const report = await checkSourceLines(process.cwd(), ["scripts/check-source-lines.mjs"]);
  assert.equal(report.passed, true);
});
