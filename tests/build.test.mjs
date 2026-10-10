import test from "node:test";
import assert from "node:assert/strict";
import { validateLinks, build } from "../scripts/build.mjs";
import { mkdtemp, writeFile, readFile, cp, rm, readdir, symlink, rename } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

test("current verification header matches the source version", async () => {
  const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const metadata = JSON.parse(await readFile(path.join(repository, "package.json"), "utf8"));
  const verification = await readFile(path.join(repository, "docs/verification.md"), "utf8");
  assert.equal(verification.split(/\r?\n/)[0], `# Proofwork ${metadata.version} verification`);
});

test("package reference validator rejects escaped and missing local links", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-build-"));
  try {
    await writeFile(path.join(root, "README.md"), "[missing](absent.md)");
    await assert.rejects(validateLinks(root), /missing/);
    await writeFile(path.join(root, "README.md"), "[escape](../outside.md)");
    await assert.rejects(validateLinks(root), /escape/);
    await writeFile(path.join(root, "README.md"), "[ok](guide.md) [official](https://example.com)");
    await writeFile(path.join(root, "guide.md"), "guide");
    await validateLinks(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("isolated builds stamp versions, preserve skill parity and reject broken source", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-isolated-"));
  const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  try {
    for (const entry of [
      "scripts",
      "shared",
      "adapters",
      "docs/skill-specs",
      ".claude-plugin",
      "package.json",
      "LICENSE",
      "NOTICE.md",
      "UPSTREAM.md",
    ]) {
      await cp(path.join(repository, entry), path.join(root, entry), { recursive: true });
    }
    const outputRoot = path.join(root, "output");
    const reports = await build({ repository: root, outputRoot });
    assert.equal(reports.length, 2);
    const metadata = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    for (const [host, manifest] of [
      ["codex", ".codex-plugin"],
      ["claude-code", ".claude-plugin"],
    ]) {
      const output = path.join(outputRoot, host);
      assert.equal(
        JSON.parse(await readFile(path.join(output, manifest, "plugin.json"), "utf8")).version,
        metadata.version,
      );
      assert.ok((await readdir(output)).includes("shared"));
      assert.equal(
        await readFile(path.join(output, "shared/routing.json"), "utf8"),
        await readFile(path.join(root, "shared/routing.json"), "utf8"),
      );
    }
    assert.deepEqual(
      await readdir(path.join(outputRoot, "codex/skills")),
      await readdir(path.join(outputRoot, "claude-code/skills")),
    );
    const marketplace = JSON.parse(await readFile(path.join(root, ".claude-plugin/marketplace.json"), "utf8"));
    assert.equal(marketplace.plugins.find((plugin) => plugin.name === "proofwork").version, metadata.version);
    await build({ repository: root, outputRoot });
    const cli = spawnSync(process.execPath,[path.join(root,'scripts/build.mjs')],{encoding:'utf8'});
    assert.equal(cli.status,0,cli.stderr);
    const canonical = path.join(root,'shared/skills/setup');
    const linked = path.join(root,'shared/linked');
    await symlink(canonical,linked,'junction');
    await assert.rejects(build({repository:root,outputRoot}),/symlink forbidden/);
    await rm(linked);
    const linkedOutput = path.join(root,'linked-output');
    await symlink(outputRoot,linkedOutput,'junction');
    await assert.rejects(build({repository:root,outputRoot:linkedOutput}),/cannot be a symlink/);
    await rm(linkedOutput);
    const codex = path.join(outputRoot,'codex');
    const preserved = path.join(outputRoot,'saved-codex');
    await rename(codex,preserved);
    await symlink(preserved,codex,'junction');
    await assert.rejects(build({repository:root,outputRoot}),/generated target cannot/);
    await rm(codex);
    await rename(preserved,codex);
    await writeFile(path.join(root, "shared/skills/use-proofwork/broken.md"), "[missing](absent.md)");
    await assert.rejects(build({ repository: root, outputRoot }), /missing reference/);
    await rm(path.join(root, "shared/skills/use-proofwork/broken.md"));
    const skillPath = path.join(root, "shared/skills/setup/SKILL.md");
    await writeFile(skillPath, "invalid");
    await assert.rejects(build({ repository: root, outputRoot }), /frontmatter/);
    await rm(path.join(root, "shared/skills/setup"), { recursive: true });
    await assert.rejects(build({ repository: root, outputRoot }), /missing required/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("build refuses to ship packages missing required legal and authorship files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-build-legal-"));
  const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  try {
    for (const entry of [
      "scripts",
      "shared",
      "adapters",
      "docs/skill-specs",
      "package.json",
      ".claude-plugin",
      "LICENSE",
      "NOTICE.md",
      "UPSTREAM.md",
    ]) {
      await cp(path.join(repository, entry), path.join(root, entry), { recursive: true });
    }
    for (const name of ["LICENSE", "NOTICE.md", "UPSTREAM.md"]) {
      const source = await readFile(path.join(root, name));
      await rm(path.join(root, name));
      const result = spawnSync(process.execPath, [path.join(root, "scripts/build.mjs")], {
        encoding: "utf8",
        windowsHide: true,
      });
      assert.equal(result.status, 1, `missing ${name} must fail the build`);
      assert.match(result.stderr, new RegExp(name.replace(".", "\\.")));
      await writeFile(path.join(root, name), source);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
