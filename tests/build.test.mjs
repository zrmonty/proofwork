import test from "node:test";
import assert from "node:assert/strict";
import { validateLinks, build } from "../scripts/build.mjs";
import { mkdtemp, writeFile, readFile, cp, rm, readdir, symlink, rename, mkdir } from "node:fs/promises";
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
      "assets/brand",
      "docs/skill-specs",
      ".claude-plugin",
      "package.json",
      "LICENSE",
      "NOTICE.md",
      "UPSTREAM.md",
    ]) {
      await cp(path.join(repository, entry), path.join(root, entry), { recursive: true });
    }
    const ordinaryPolicy = path.join(root, "shared/skills/rust-best-practices/agents");
    await mkdir(ordinaryPolicy, { recursive: true });
    await writeFile(path.join(ordinaryPolicy, "openai.yaml"), "policy:\n  allow_implicit_invocation: true\n");
    const outputRoot = path.join(root, "output");
    const reports = await build({ repository: root, outputRoot });
    assert.equal(reports.length, 2);
    const metadata = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    for (const [host, manifest] of [
      ["codex", ".codex-plugin"],
      ["claude-code", ".claude-plugin"],
    ]) {
      const output = path.join(outputRoot, host);
      for (const asset of ["proofwork-logo.png", "proofwork-icon.png",
        "proofwork-logo-dark.png", "proofwork-icon-dark.png"]) {
        const packaged = await readFile(path.join(output, "assets/brand", asset));
        assert.deepEqual(packaged, await readFile(path.join(repository, "assets/brand", asset)));
        assert.equal(packaged.subarray(1, 4).toString(), "PNG");
        assert.ok(packaged.length < 5 * 1024 * 1024);
        if (!asset.includes("-dark")) assert.equal(packaged[25], 6, "light PNG retains its alpha channel");
        else assert.ok([2, 6].includes(packaged[25]), "dark PNG is RGB or RGBA");
        if (asset.includes("icon")) {
          assert.equal(packaged.readUInt32BE(16), packaged.readUInt32BE(20));
          assert.ok(packaged.readUInt32BE(16) >= 48 && packaged.readUInt32BE(16) <= 4096);
        }
      }
      if (host === "codex") {
        const plugin = JSON.parse(await readFile(path.join(output, manifest, "plugin.json"), "utf8"));
        assert.equal(plugin.interface.logo, "./assets/brand/proofwork-icon.png");
        assert.equal(plugin.interface.composerIcon, plugin.interface.logo);
        assert.equal(plugin.interface.logoDark, "./assets/brand/proofwork-icon-dark.png");
        assert.equal(plugin.interface.composerIconDark, plugin.interface.logoDark);
      }
      const readme = await readFile(path.join(output, "README.md"), "utf8");
      assert.match(readme, /<source media="\(prefers-color-scheme: dark\)"/);
      for (const match of readme.matchAll(/(?:src|srcset)="([^"]+)"/g))
        assert.ok((await readFile(path.join(output, match[1]))).length > 0);
      assert.ok(!(await readdir(output)).includes("hooks"));
      assert.ok(!(await readdir(path.join(output, "adapters"))).includes("hooks"));
      assert.equal(
        JSON.parse(await readFile(path.join(output, manifest, "plugin.json"), "utf8")).version,
        metadata.version,
      );
      assert.ok((await readdir(output)).includes("shared"));
      assert.match(
        await readFile(path.join(output, "README.md"), "utf8"),
        host === "codex"
          ? /codex plugin add proofwork@proofwork-local/
          : /\/plugin install proofwork --marketplace zrmonty\/proofwork/,
      );
      assert.equal(
        await readFile(path.join(output, "shared/routing.json"), "utf8"),
        await readFile(path.join(root, "shared/routing.json"), "utf8"),
      );
    }
    assert.deepEqual(
      await readdir(path.join(outputRoot, "codex/skills")),
      await readdir(path.join(outputRoot, "claude-code/skills")),
    );
    for (const name of ["pw-setup", "pw-worker-mode", "audit-stack"]) {
      const codex = await readFile(path.join(outputRoot, "codex/skills", name, "SKILL.md"), "utf8");
      const claude = await readFile(path.join(outputRoot, "claude-code/skills", name, "SKILL.md"), "utf8");
      assert.equal(claude.replace(/disable-model-invocation: true\r?\n/u, ""), codex);
      assert.doesNotMatch(codex, /disable-model-invocation/);
      assert.match(
        await readFile(path.join(outputRoot, "codex/skills", name, "agents/openai.yaml"), "utf8"),
        /allow_implicit_invocation: false/,
      );
    }
    assert.doesNotMatch(
      await readFile(path.join(outputRoot, "claude-code/skills/rust-best-practices/SKILL.md"), "utf8"),
      /disable-model-invocation/,
    );
    const marketplace = JSON.parse(await readFile(path.join(root, ".claude-plugin/marketplace.json"), "utf8"));
    assert.equal(marketplace.plugins.find((plugin) => plugin.name === "proofwork").version, metadata.version);
    await build({ repository: root, outputRoot });
    await build({ repository: root, outputRoot, hooks: true });
    for (const [host, manifestDirectory] of [
      ["codex", ".codex-plugin"],
      ["claude-code", ".claude-plugin"],
    ]) {
      const output = path.join(outputRoot, host);
      const config = JSON.parse(await readFile(path.join(output, "hooks/hooks.json"), "utf8"));
      assert.deepEqual(Object.keys(config), ["hooks"]);
      assert.deepEqual(Object.keys(config.hooks).sort(), ["SessionStart", "Stop", "UserPromptSubmit"]);
      assert.ok(!(await readdir(path.join(output, "adapters"))).includes("hooks"));
      const manifest = JSON.parse(await readFile(path.join(output, manifestDirectory, "plugin.json"), "utf8"));
      assert.ok(!Object.hasOwn(manifest, "hooks"), "root conventional hooks config must not be registered twice");
      for (const handlers of Object.values(config.hooks)) {
        assert.equal(handlers.length, 1);
        assert.equal(handlers[0].hooks.length, 1);
        const command = handlers[0].hooks[0];
        assert.equal(command.type, "command");
        assert.equal(command.timeout, 15);
        assert.match(JSON.stringify(command), /host-hook\.mjs/);
        assert.match(JSON.stringify(command), new RegExp(host));
      }
    }
    // An ordinary rebuild removes opt-in configuration, including stale prior output.
    await build({ repository: root, outputRoot });
    for (const host of ["codex", "claude-code"]) {
      assert.ok(!(await readdir(path.join(outputRoot, host))).includes("hooks"));
    }
    for (const args of [["--unknown"], ["--hooks", "--hooks"], ["--hooks", "unexpected"]]) {
      const invalid = spawnSync(process.execPath, [path.join(root, "scripts/build.mjs"), ...args], {
        encoding: "utf8",
        windowsHide: true,
      });
      assert.equal(invalid.status, 1);
      assert.match(invalid.stderr, /usage/);
    }
    const cli = spawnSync(process.execPath, [path.join(root, "scripts/build.mjs")], { encoding: "utf8" });
    assert.equal(cli.status, 0, cli.stderr);
    const canonical = path.join(root, "shared/skills/pw-setup");
    const linked = path.join(root, "shared/linked");
    await symlink(canonical, linked, "junction");
    await assert.rejects(build({ repository: root, outputRoot }), /symlink forbidden/);
    await rm(linked);
    const linkedOutput = path.join(root, "linked-output");
    await symlink(outputRoot, linkedOutput, "junction");
    await assert.rejects(build({ repository: root, outputRoot: linkedOutput }), /cannot be a symlink/);
    await rm(linkedOutput);
    const codex = path.join(outputRoot, "codex");
    const preserved = path.join(outputRoot, "saved-codex");
    await rename(codex, preserved);
    await symlink(preserved, codex, "junction");
    await assert.rejects(build({ repository: root, outputRoot }), /generated target cannot/);
    await rm(codex);
    await rename(preserved, codex);
    await writeFile(path.join(root, "shared/skills/use-proofwork/broken.md"), "[missing](absent.md)");
    await assert.rejects(build({ repository: root, outputRoot }), /missing reference/);
    await rm(path.join(root, "shared/skills/use-proofwork/broken.md"));
    const skillPath = path.join(root, "shared/skills/pw-setup/SKILL.md");
    await writeFile(skillPath, "invalid");
    await assert.rejects(build({ repository: root, outputRoot }), /frontmatter/);
    await rm(path.join(root, "shared/skills/pw-setup"), { recursive: true });
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
      "assets/brand",
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

test("both installed layouts execute explained routing and model planning", async t => {
  const root = await mkdtemp(path.join(tmpdir(), "proofwork-runtime-package-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  await build({ repository, outputRoot: root });
  await writeFile(path.join(root, "inventory.json"), "[]");
  for (const host of ["codex", "claude-code"]) {
    const routed = spawnSync(process.execPath, [path.join(root, host, "scripts/proofwork.mjs"),
      "route", "--explain", "--task", "Prototype invoice search"], { encoding: "utf8" });
    assert.equal(routed.status, 0, routed.stderr);
    assert.equal(JSON.parse(routed.stdout).playbook, "prototype");
    assert.ok(JSON.parse(routed.stdout).principles.includes("design-economy"));
    const result = JSON.parse(routed.stdout);
    assert.deepEqual(result.principles, ["design-economy"]);
    assert.equal(result.principleReferences.length, 1);
    const reference = await readFile(path.join(root, host, result.principleReferences[0]), "utf8");
    assert.match(reference, /current requirement/);
    const entries = await readdir(path.join(root, host, "skills"));
    assert.ok(!entries.some(name => name.startsWith("pw-principle-")));
    const planned = spawnSync(process.execPath, [path.join(root, host, "scripts/model-roles.mjs"),
      "plan", "--repo", root, "--host", host, "--inventory", "inventory.json"], { encoding: "utf8" });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(JSON.parse(planned.stdout).dispatchUnverified, true);
  }
});
