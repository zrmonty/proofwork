import { readdir, readFile, writeFile, mkdir, cp, rm, rename, lstat, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const inside = (root,target) => { const relative = path.relative(root,target); return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative); };
async function files(root) {
  const result = [];
  for (const entry of await readdir(root,{withFileTypes:true})) {
    const full = path.join(root,entry.name);
    if (entry.isSymbolicLink()) throw new Error(`symlink forbidden in package source/output: ${full}`);
    if (entry.isDirectory()) result.push(...await files(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}
export async function validateLinks(root) {
  for (const file of (await files(root)).filter(file => file.endsWith('.md'))) {
    const content = await readFile(file,'utf8');
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const reference = match[1].replace(/^<|>$/g,'').split('#')[0];
      if (!reference || /^[a-z]+:\/\//i.test(reference) || reference.startsWith('mailto:')) continue;
      const destination = path.resolve(path.dirname(file),reference);
      if (!inside(root,destination)) throw new Error(`reference escapes package: ${file} -> ${reference}`);
      try { await access(destination); } catch { throw new Error(`missing reference: ${file} -> ${reference}`); }
    }
  }
}
async function removeGenerated(target) {
  const allowed = path.join(repository,'packages');
  if (!inside(allowed,target) || path.resolve(target) === allowed) throw new Error('unsafe package cleanup target');
  try {
    if ((await lstat(target)).isSymbolicLink()) throw new Error('generated target cannot be a symlink');
    await files(target);
    await rm(target,{recursive:true,force:true});
  } catch(error) { if(error.code !== 'ENOENT') throw error; }
}
export async function build() {
  const metadata = JSON.parse(await readFile(path.join(repository,'package.json'),'utf8'));
  const skillRoot = path.join(repository,'shared/skills');
  const skills = (await readdir(skillRoot,{withFileTypes:true})).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  const required = ['brainstorm','use-proofwork','worker-mode','setup','thermo-nuclear-code-quality-review','functional-programming','data-driven-development','clean-code','typescript-best-practices','rust-best-practices','python-best-practices','frontend-design','commit-features','architecture-fit','production-finish','performance-increase','tdd-95','humanizer','security-hardening','dead-code-audit','dry-audit','audit-stack'];
  for (const name of required) if (!skills.includes(name)) throw new Error(`missing required skill ${name}`);
  for (const name of skills) {
    const content = await readFile(path.join(skillRoot,name,'SKILL.md'),'utf8');
    if (!content.startsWith('---\n') || !content.includes(`name: ${name}\n`) || !/^description: .+/m.test(content)) throw new Error(`invalid skill frontmatter ${name}`);
    await access(path.join(repository,'docs/skill-specs',`${name}.md`));
  }
  await files(path.join(repository,'shared'));
  await files(path.join(repository,'adapters'));
  await mkdir(path.join(repository,'packages'),{recursive:true});
  if ((await lstat(path.join(repository,'packages'))).isSymbolicLink()) throw new Error('packages directory cannot be a symlink');
  const report = [];
  for (const host of ['codex','claude-code']) {
    const staging = path.join(repository,'packages',`.${host}-${randomUUID()}`);
    const destination = path.join(repository,'packages',host);
    await mkdir(staging);
    try {
      for (const section of ['skills','contracts','playbooks','principles']) await cp(path.join(repository,'shared',section),path.join(staging,section),{recursive:true,errorOnExist:true,force:false});
      await cp(path.join(repository,'adapters',host),path.join(staging,'adapters'),{recursive:true});
      for (const file of ['LICENSE','NOTICE.md','UPSTREAM.md']) {
        await cp(path.join(repository,file),path.join(staging,file));
      }
      await mkdir(path.join(staging,'scripts'));
      for (const file of ['proofwork.mjs','routing.mjs','check-commits.mjs','check-coverage.mjs','check-file-lines.mjs','README.md']) await cp(path.join(repository,'scripts',file),path.join(staging,'scripts',file));
      const manifestDirectory = host === 'codex' ? '.codex-plugin' : '.claude-plugin';
      await mkdir(path.join(staging,manifestDirectory));
      const manifest = {name:'proofwork',version:metadata.version,description:'Turn intent into verified software with original engineering skills and inspectable evidence.',author:{name:'Proofwork contributors'},license:'MIT',skills:'./skills/'};
      if (host === 'codex') manifest.interface = {displayName:'Proofwork',shortDescription:'Your intent. Verified software.',developerName:'Proofwork contributors',category:'Productivity',defaultPrompt:['Use Proofwork to carry this engineering task through verified completion.']};
      await writeFile(path.join(staging,manifestDirectory,'plugin.json'),`${JSON.stringify(manifest,null,2)}\n`);
      const invocation = host === 'codex' ? '$use-proofwork <task> (or select the skill from the host menu)' : '/proofwork:use-proofwork <task>';
      await writeFile(path.join(staging,'README.md'),`# Proofwork ${metadata.version} for ${host}\n\nDescribe the outcome you want; Proofwork carries the engineering detail and verifies the result. Start with \`${invocation}\`. Read [runtime](adapters/runtime.md) and [tools](scripts/README.md). These files are generated from our canonical authored source. No global configuration or continuation hooks are installed. Native goal support follows the live host contract. Structural validation does not establish host behavioral certification.\n`);
      await validateLinks(staging);
      await removeGenerated(destination);
      await rename(staging,destination);
      report.push({host,path:destination,skills:skills.length});
    } finally { await removeGenerated(staging); }
  }
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(await build(),null,2)); }
  catch(error) { console.error(error.message); process.exitCode=1; }
}
