import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { countLines, checkFileLines } from "../scripts/check-file-lines.mjs";

test("line counting includes comments and blanks without a phantom trailing line", () => {
  assert.equal(countLines(""), 0);
  assert.equal(countLines("// comment\n\ncode\n"), 3);
  assert.equal(countLines("a\r\nb\r\n"), 2);
  assert.equal(countLines("a\rb"), 2);
  assert.equal(countLines("last line without newline"), 1);
});
test("file ceilings are disabled by default and configurable without a global cap", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-config-"));
  try {
    spawnSync("git", ["-C", root, "init"], { encoding: "utf8" });
    await writeFile(path.join(root, "large.py"), "pass\n".repeat(700));
    assert.equal((await checkFileLines(root)).enabled, false);
    await writeFile(path.join(root, ".proofwork.json"), JSON.stringify({ maxFileLines: 800 }));
    assert.equal((await checkFileLines(root)).passed, true);
    assert.equal((await checkFileLines(root, [], 699)).passed, false);
    await assert.rejects(checkFileLines(root, [], 0), /positive/);
    await writeFile(path.join(root, ".proofwork.json"), "{bad");
    await assert.rejects(checkFileLines(root), SyntaxError);
    await writeFile(path.join(root, ".proofwork.json"), JSON.stringify({ maxFileLines: null }));
    assert.equal((await checkFileLines(root)).enabled, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("500 passes and 501 fails across tracked, untracked and additionally inventoried code", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-lines-"));
  const git = (...args) => assert.equal(spawnSync("git", ["-C", root, ...args], { encoding: "utf8" }).status, 0);
  try {
    git("init");
    await writeFile(path.join(root, "tracked.py"), "pass\n".repeat(500));
    await writeFile(path.join(root, ".gitignore"), "custom\n");
    git("add", "tracked.py", ".gitignore");
    assert.equal((await checkFileLines(root, [], 500)).passed, true);
    await writeFile(path.join(root, "new.rs"), "// code\n".repeat(501));
    assert.deepEqual((await checkFileLines(root, [], 500)).violations, [{ path: "new.rs", lines: 501 }]);
    await writeFile(path.join(root, "custom"), "code\n".repeat(501));
    assert.equal((await checkFileLines(root, ["custom"], 500)).violations.length, 2);
    assert.equal((await checkFileLines(root, [], 500)).violations.length, 1);
    assert.equal(
      spawnSync(process.execPath, ["scripts/check-file-lines.mjs", "--repo", root, "--limit", "500"], {
        encoding: "utf8",
      }).status,
      1,
    );
    assert.equal(
      spawnSync(process.execPath, ["scripts/check-file-lines.mjs", "--repo", root, "--limit", "501"], {
        encoding: "utf8",
      }).status,
      0,
    );
    await assert.rejects(checkFileLines(root, ["../outside"]), /inventory/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("optional file ceilings reject unsafe inventory, non-source and malformed encodings", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-lines-guards-"));
  try {
    await assert.rejects(checkFileLines(root, [], 10), /Git|git|repository/);
    spawnSync("git", ["-C", root, "init"], { encoding: "utf8" });
    await assert.rejects(checkFileLines(root, [], 10), /no code/);
    for (const inventory of [null, ["/root"], ["bad\\path"], ["a:b"], ["a//b"], ["."], ["a/.."], ["\0"]]) {
      await assert.rejects(checkFileLines(root, inventory, 10), /inventory/);
    }
    await assert.rejects(checkFileLines(root, ["absent"], 10), /ENOENT/);
    await mkdir(path.join(root,'directory'));
    await assert.rejects(checkFileLines(root,['directory'],10),/non-file/);
    await writeFile(path.join(root, "source.py"), Buffer.from([255]));
    await assert.rejects(checkFileLines(root, [], 10), /encoded|encoding/i);
    await writeFile(path.join(root, "source.py"), "nul\0");
    await assert.rejects(checkFileLines(root, [], 10), /NUL/);
    await writeFile(path.join(root, "source.py"), Buffer.from([255, 254, 97, 0, 10, 0]));
    assert.equal((await checkFileLines(root, [], 10)).files[0].lines, 1);
    await writeFile(path.join(root,'inventory.json'),JSON.stringify(['source.py']));
    const cli = spawnSync(process.execPath,['scripts/check-file-lines.mjs','--repo',root,
      '--inventory',path.join(root,'inventory.json'),'--limit','10'],{encoding:'utf8'});
    assert.equal(cli.status,0,cli.stderr);
    await rm(path.join(root,'.proofwork.json'),{force:true});
    const disabled = spawnSync(process.execPath,['scripts/check-file-lines.mjs','--repo',root],{encoding:'utf8'});
    assert.equal(JSON.parse(disabled.stdout).enabled,false);
    await writeFile(path.join(root, "source.py"), Buffer.from([254, 255, 0, 97, 0, 10]));
    assert.equal((await checkFileLines(root, [], 10)).files[0].lines, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("file-line CLI documents optional limits and rejects invalid arguments", () => {
  const run = (args) => spawnSync(process.execPath, ["scripts/check-file-lines.mjs", ...args], { encoding: "utf8" });
  assert.match(run(["--help"]).stdout, /disabled/);
  for (const args of [[], ["--unknown", "a"], ["--repo"], ["--repo", ".", "--repo", "."]]) {
    assert.equal(run(args).status, 1);
  }
});
