import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { normalizeLcov } from "../scripts/collect-coverage.mjs";

const record = (name, lines = 10, covered = 10) =>
  `SF:${name}\nLH:${covered}\nLF:${lines}\nBRH:1\nBRF:1\nend_of_record\n`;
test("normalizes Node LCOV with a separate complete source inventory", () => {
  const report = normalizeLcov(record("scripts/a.mjs") + record("tests/a.test.mjs"), ["scripts/a.mjs"], "abc");
  assert.deepEqual(report.files, [
    { path: "scripts/a.mjs", lines: { covered: 10, total: 10 }, branches: { covered: 1, total: 1 } },
  ]);
});
test("missing, duplicate, malformed and incomplete source evidence is rejected", () => {
  assert.throws(() => normalizeLcov("", ["scripts/a.mjs"], "abc"), /missing coverage/);
  assert.throws(() => normalizeLcov(record("scripts/a.mjs").repeat(2), ["scripts/a.mjs"], "abc"), /duplicate/);
  assert.throws(
    () => normalizeLcov(record("scripts/a.mjs").replace("BRH:1\n", ""), ["scripts/a.mjs"], "abc"),
    /missing/,
  );
  assert.throws(() => normalizeLcov(record("scripts/a.mjs", 10, 11), ["scripts/a.mjs"], "abc"), /invalid/);
});
test("low measured coverage remains in the report instead of being rewritten", () => {
  const report = normalizeLcov(record("scripts/a.mjs", 100, 70), ["scripts/a.mjs"], "abc");
  assert.equal(report.files[0].lines.covered, 70);
});

test("collector CLI writes the measured report and exits nonzero below95", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-collector-"));
  const lcov = path.join(root, "coverage.lcov");
  const inventory = path.join(root, "inventory.json");
  const output = path.join(root, "report.json");
  const run = (args) => spawnSync(process.execPath, ["scripts/collect-coverage.mjs", ...args], { encoding: "utf8" });
  const args = ["--lcov", lcov, "--inventory", inventory, "--output", output, "--revision", "abc"];
  try {
    await writeFile(inventory, JSON.stringify(["scripts/a.mjs"]));
    await writeFile(lcov, record(path.resolve("scripts/a.mjs")));
    assert.equal(run(args).status, 0);
    assert.equal(JSON.parse(await readFile(output, "utf8")).files[0].path, "scripts/a.mjs");
    await writeFile(lcov, record("scripts/a.mjs", 100, 70));
    assert.equal(run(args).status, 1);
    assert.equal(JSON.parse(await readFile(output, "utf8")).files[0].lines.covered, 70);
    assert.equal(run(["--bad", "value"]).status, 1);
    assert.equal(run(["--lcov"]).status, 1);
    assert.equal(run(["--repo", ".", "--repo", "."]).status, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
