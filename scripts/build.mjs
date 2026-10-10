import { isMain } from './runtime-entry.mjs';
import { readdir, readFile, writeFile, mkdir, cp, rm, rename, lstat, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const inside = (root, target) => {
  const relative = path.relative(root, target);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`symlink forbidden in package source/output: ${full}`);
    if (entry.isDirectory()) result.push(...(await files(full)));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}
export async function validateLinks(root) {
  for (const file of (await files(root)).filter((file) => file.endsWith(".md"))) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const reference = match[1].replace(/^<|>$/g, "").split("#")[0];
      if (!reference || /^[a-z]+:\/\//i.test(reference) || reference.startsWith("mailto:")) continue;
      const destination = path.resolve(path.dirname(file), reference);
      if (!inside(root, destination)) throw new Error(`reference escapes package: ${file} -> ${reference}`);
      try {
        await access(destination);
      } catch {
        throw new Error(`missing reference: ${file} -> ${reference}`);
      }
    }
  }
}
async function removeGenerated(target, allowed) {
  if (!inside(allowed, target) || path.resolve(target) === allowed) throw new Error("unsafe package cleanup target");
  try {
    if ((await lstat(target)).isSymbolicLink()) throw new Error("generated target cannot be a symlink");
    await files(target);
    await rm(target, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
export async function build(options = {}) {
  const repository = path.resolve(options.repository ?? path.dirname(path.dirname(fileURLToPath(import.meta.url))));
  const outputRoot = path.resolve(options.outputRoot ?? path.join(repository,
    options.hooks ? '.engineering-team/hook-packages' : 'packages'));
  const metadata = JSON.parse(await readFile(path.join(repository, "package.json"), "utf8"));
  const skillRoot = path.join(repository, "shared/skills");
  const skills = (await readdir(skillRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const required = [
    "language-fit",
    "brainstorm",
    "use-proofwork",
    "pw-worker-mode",
    "pw-setup",
    "thermo-nuclear-code-quality-review",
    "functional-programming",
    "data-driven-development",
    "pw-clean-code",
    "typescript-best-practices",
    "rust-best-practices",
    "python-best-practices",
    "frontend-design",
    "commit-features",
    "architecture-fit",
    "production-finish",
    "performance-increase",
    "tdd-95",
    "humanizer",
    "security-hardening",
    "dead-code-audit",
    "dry-audit",
    "audit-stack",
  ];
  for (const name of required) if (!skills.includes(name)) throw new Error(`missing required skill ${name}`);
  for (const name of skills) {
    const content = (await readFile(path.join(skillRoot, name, "SKILL.md"), "utf8")).replace(/\r\n/g, "\n");
    if (!content.startsWith("---\n") || !content.includes(`name: ${name}\n`) || !/^description: .+/m.test(content))
      throw new Error(`invalid skill frontmatter ${name}`);
    await access(path.join(repository, "docs/skill-specs", `${name}.md`));
  }
  await files(path.join(repository, "shared"));
  await files(path.join(repository, "adapters"));
  await mkdir(outputRoot, { recursive: true });
  if ((await lstat(outputRoot)).isSymbolicLink()) throw new Error("packages directory cannot be a symlink");
  const report = [];
  for (const host of ["codex", "claude-code"]) {
    const staging = path.join(outputRoot, `.${host}-${randomUUID()}`);
    const destination = path.join(outputRoot, host);
    await mkdir(staging);
    try {
      for (const section of ["skills", "contracts", "playbooks", "principles"])
        await cp(path.join(repository, "shared", section), path.join(staging, section), {
          recursive: true,
          errorOnExist: true,
          force: false,
        });
      if (host === 'claude-code') {
        for (const name of skills) {
          const policy = path.join(staging, 'skills', name, 'agents/openai.yaml');
          let metadata;
          try { metadata = await readFile(policy, 'utf8'); }
          catch (error) { if (error.code === 'ENOENT') continue; throw error; }
          if (/^  allow_implicit_invocation: false[ \t]*\r?$/mu.test(metadata)) {
            const entry = path.join(staging, 'skills', name, 'SKILL.md');
            const source = await readFile(entry, 'utf8');
            await writeFile(entry, source.replace(/^---(\r?\n)/u, (_, newline) =>
              `---${newline}disable-model-invocation: true${newline}`));
          }
        }
      }
      await cp(path.join(repository, "adapters", host), path.join(staging, "adapters"), { recursive: true });
      await mkdir(path.join(staging, "assets/brand"), { recursive: true });
      for (const file of ["proofwork-logo.png", "proofwork-icon.png",
        "proofwork-logo-dark.png", "proofwork-icon-dark.png"])
        await cp(path.join(repository, "assets/brand", file), path.join(staging, "assets/brand", file));
      await removeGenerated(path.join(staging, 'adapters/hooks'), staging);
      if (options.hooks) await cp(path.join(repository, 'adapters', host, 'hooks'), path.join(staging, 'hooks'),
        { recursive: true });
      for (const file of ["LICENSE", "NOTICE.md", "UPSTREAM.md"]) {
        await cp(path.join(repository, file), path.join(staging, file));
      }
      await mkdir(path.join(staging, "shared"));
      await cp(path.join(repository, "shared/routing.json"), path.join(staging, "shared/routing.json"));
      await cp(path.join(repository, "shared/playbooks.json"), path.join(staging, "shared/playbooks.json"));
      await mkdir(path.join(staging, "shared/principles"));
      await cp(path.join(repository, "shared/principles/index.json"),
        path.join(staging, "shared/principles/index.json"));
      await mkdir(path.join(staging, "scripts"));
      for (const file of (await readdir(path.join(repository, "scripts"))).filter(
        (file) => (file.endsWith(".mjs") && file !== "build.mjs") || file === "README.md",
      ))
        await cp(path.join(repository, "scripts", file), path.join(staging, "scripts", file));
      const manifestDirectory = host === "codex" ? ".codex-plugin" : ".claude-plugin";
      await mkdir(path.join(staging, manifestDirectory));
      const manifest = {
        name: "proofwork",
        version: metadata.version,
        description: "Turn intent into verified software with original engineering skills and inspectable evidence.",
        author: { name: "Proofwork contributors" },
        license: "MIT",
        skills: "./skills/",
      };
      if (host === "codex")
        manifest.interface = {
          displayName: "Proofwork",
          shortDescription: "Intent into verified software",
          longDescription: "Describe an engineering outcome and Proofwork routes proportionate work through " +
            "implementation, review and verification. Includes language guidance, architecture decisions, " +
            "security and production checks, recovery workflows and inspectable evidence. " +
            "Verification reports distinguish observed results from missing checks and operator responsibilities.",
          developerName: "Proofwork contributors",
          category: "Productivity",
          logo: "./assets/brand/proofwork-icon.png",
          composerIcon: "./assets/brand/proofwork-icon.png",
          logoDark: "./assets/brand/proofwork-icon-dark.png",
          composerIconDark: "./assets/brand/proofwork-icon-dark.png",
          defaultPrompt: ["Use Proofwork to carry this engineering task through verified completion."],
        };
      await writeFile(path.join(staging, manifestDirectory, "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`);
      if (host === 'codex') {
        const { skills, interface: presentation, ...identity } = manifest;
        const portable = { $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', ...identity,
          extensions: { 'com.openai': { interface: presentation } } };
        await writeFile(path.join(staging, 'plugin.json'), `${JSON.stringify(portable, null, 2)}\n`);
      }
      const invocation =
        host === "codex"
          ? "$use-proofwork <task> (or select the skill from the host menu)"
          : "/proofwork:use-proofwork <task>";
      const install = host === 'codex' ? 'codex plugin add proofwork@proofwork-local'
        : '/plugin install proofwork --marketplace zrmonty/proofwork';
      await writeFile(
        path.join(staging, "README.md"),
        `# Proofwork ${metadata.version} for ${host}\n\n` +
          '<picture>\n' +
          '  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/proofwork-logo-dark.png">\n' +
          '  <source media="(prefers-color-scheme: light)" srcset="assets/brand/proofwork-logo.png">\n' +
          '  <img src="assets/brand/proofwork-logo.png" alt="Proofwork" width="320">\n</picture>\n\n' +
          `Install: \`${install}\` (register the Codex marketplace first).\n\n` +
          "Claude one-command marketplace install requires 2.1.292+.\n\n" +
          "Describe the outcome you want; Proofwork carries the engineering detail and verifies the result. " +
          `Start with \`${invocation}\`. Read [runtime](adapters/runtime.md) and [tools](scripts/README.md). ` +
          "These files are generated from our canonical authored source. " +
          (options.hooks ? 'Lifecycle hooks require host trust and explicit run binding. '
            : 'This package has no lifecycle hook configuration. ') +
          "Native goal support follows the live host contract. " +
          "Structural validation does not establish host behavioral certification.\n",
      );
      await validateLinks(staging);
      await removeGenerated(destination, outputRoot);
      await rename(staging, destination);
      report.push({ host, path: destination, skills: skills.length });
    } finally {
      await removeGenerated(staging, outputRoot);
    }
  }
  const marketplacePath = path.join(repository, ".claude-plugin/marketplace.json");
  const marketplace = JSON.parse(await readFile(marketplacePath, "utf8"));
  marketplace.plugins
    .filter((plugin) => plugin.name === "proofwork")
    .forEach((plugin) => {
      plugin.version = metadata.version;
    });
  await writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
  return report;
}
if (isMain(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 1 || args[0] !== '--hooks')) throw new Error('usage: build.mjs [--hooks]');
    console.log(JSON.stringify(await build({ hooks: args.includes('--hooks') }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
