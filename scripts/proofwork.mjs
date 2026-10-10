import { readFile, writeFile, mkdir, rename, copyFile, realpath, lstat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.trim() ? value : fail(`${label} must be nonempty text`);
const id = (value, label) => /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(text(value,label)) ? value : fail(`unsafe ${label}`);
const relative = (value, label) => {
  text(value,label);
  if (path.isAbsolute(value) || /[\\:\x00<>"|?*]/.test(value) || value.split('/').some(part => !part || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) fail(`unsafe ${label} path`);
  return value;
};
const overlaps = (files, otherFiles) => files.some(a => otherFiles.some(b => a.toLowerCase() === b.toLowerCase() || a.toLowerCase().startsWith(`${b.toLowerCase()}/`) || b.toLowerCase().startsWith(`${a.toLowerCase()}/`)));
function checkOwnership(tasks, taskId, files) {
  if (tasks.some(task => task.id !== taskId && task.status !== 'reviewed' && overlaps(task.files,files))) fail('ownership overlap; use isolated runs/checkouts or integrate first');
}

export function route(task, files = []) {
  text(task,'task');
  const playbook = /\b(review|audit)\b/i.test(task) ? 'review' : /\b(fix|bug|regression|broken)\b/i.test(task) ? 'bug-fix' : /\b(refactor|simplify|restructure)\b/i.test(task) ? 'refactor' : /\b(investigate|diagnose|explain|research)\b/i.test(task) ? 'investigate' : 'feature';
  const skills = ['worker-mode','functional-programming','data-driven-development','clean-code'];
  if (/\b(harden(?:ing)?|vulnerabilit(?:y|ies)|ssrf|xss|csrf)\b|\bsecurity\s+(?:audit|review|hardening|scan)\b|\b(?:authorization|authentication|auth)\s+bypass\b|\b(?:sql|command|code)\s+injection\b|\b(?:exposed|leaked)\s+(?:credentials?|secrets?|keys?)\b/i.test(task)) skills.push('security-hardening');
  if ((['feature','bug-fix','refactor'].includes(playbook) && (files.some(file => /\.(?:tsx?|mts|cts|jsx?|mjs|cjs|rs|pyi?)$/i.test(file)) || /\b(implement|build|fix|bug|refactor|code)\b/i.test(task))) || /\b(tdd|coverage|tests?)\b/i.test(task)) skills.push('tdd-95');
  if (/\b(performance|benchmarks?|profil(?:e|ing)|latency|throughput|allocations?|faster|slow|optimi[sz](?:e|ation|ing))\b|\bspeed\s+up\b/i.test(task)) skills.push('performance-increase');
  if (/\b(architect(?:ure|ing)?|overengineering|stack)\b/i.test(task) || /\b(which|what|choose|select|compare|recommend|decide)\b.*\b(database|storage|tools?|technolog(?:y|ies)|sqlite|postgres(?:ql)?)\b/i.test(task) || /\bshould\b.*\b(use|choose)\b.*\b(database|storage|sqlite|postgres(?:ql)?)\b/i.test(task)) skills.push('architecture-fit');
  if (/\b(production[- ](?:finish|ready|readiness)|deployment|deploy|hosting|docker|containeri[sz](?:e|ation))\b/i.test(task) || /\b(finish|prepare|ready)\b.*\b(production|prod|release)\b/i.test(task) || /\b(finish|prepare)\s+(?:(?:this|the|our|my|an|a)\s+)?(?:app|application)\b/i.test(task)) skills.push('production-finish');
  if (files.some(file => /\.(?:tsx?|mts|cts)$/i.test(file)) || /\b(typescript|tsx)\b/i.test(task)) skills.push('typescript-best-practices');
  if (files.some(file => /\.rs$/i.test(file)) || /\brust\b/i.test(task)) skills.push('rust-best-practices');
  if (files.some(file => /\.pyi?$/i.test(file)) || /\bpython\b/i.test(task)) skills.push('python-best-practices');
  if (files.some(file => /\.(?:tsx|jsx|css|scss|html|vue|svelte)$/i.test(file)) || /\b(frontend|front.end|website|layout|browser|visual|interface)\b/i.test(task)) skills.push('frontend-design');
  if (skills.includes('frontend-design') || /\b(humani[sz](?:e|er|ing|ation)|microcopy|ux writing|empty[- ]states?)\b/i.test(task) || (/\b(copy|wording|labels?|messages?|tone|headings?|footer|header)\b/i.test(task) && /\b(app|application|page|screen|ui)\b/i.test(task)) || (/\b(buttons?|forms?|notifications?|onboarding|confirmations?|navigation)\b/i.test(task) && /\b(copy|wording|labels?|text|messages?)\b/i.test(task))) skills.push('humanizer');
  if (playbook === 'review' || playbook === 'refactor') skills.push('thermo-nuclear-code-quality-review');
  if (/\b(commit|push|github|shipping)\b/i.test(task)) skills.push('commit-features');
  return {playbook,skills};
}

export function transition(state, command, record, owner) {
  if (owner !== state.owner) fail('only the coordinator owner may update aggregate state');
  if (state.phase === 'complete') fail('completed run is immutable; initialize another run');
  const next = structuredClone(state);
  if (!record || typeof record !== 'object' || Array.isArray(record)) fail('record must be an object');
  record = structuredClone(record);
  if (command === 'assign') {
    id(record.id,'task id'); text(record.objective,'objective'); text(record.revision,'revision');
    if (!Array.isArray(record.files) || !record.files.every(file => typeof file === 'string')) fail('files must be a path array');
    record.files.forEach(file => relative(file,'ownership'));
    if (next.tasks.some(task => task.id === record.id)) fail('task already exists');
    checkOwnership(next.tasks,record.id,record.files);
    next.tasks.push({...record,status:'assigned'}); next.phase = 'executing';
  } else if (command === 'result') {
    const index = next.tasks.findIndex(task => task.id === record.id);
    if (index < 0) fail('unknown task');
    if (!['ready-for-review','needs-revision','blocked','reviewed'].includes(record.status)) fail('invalid result status');
    text(record.revision,'revision'); text(record.summary,'summary');
    if (record.status !== 'reviewed') checkOwnership(next.tasks,record.id,next.tasks[index].files);
    next.tasks[index] = {...next.tasks[index],status:record.status,result:record};
    next.phase = 'reviewing';
  } else if (command === 'evidence') {
    id(record.id,'evidence id');
    if (!next.criteria.includes(record.criterion)) fail('unknown criterion');
    for (const key of ['revision','artifact','command','environment','observed']) text(record[key],key);
    if (typeof record.passed !== 'boolean') fail('passed must be boolean');
    relative(record.artifact,'artifact');
    if (next.evidence.some(item => item.id === record.id)) fail('evidence id already exists; record a new observation id');
    next.evidence.push(record); next.phase = 'verifying';
  } else if (command === 'finding') {
    id(record.id,'finding id'); text(record.summary,'summary');
    if (typeof record.material !== 'boolean' || !['open','resolved','rejected'].includes(record.status)) fail('invalid finding');
    if (record.status !== 'open') text(record.resolution,'resolution evidence');
    next.findings = [...next.findings.filter(item => item.id !== record.id),record];
  } else if (command === 'checkpoint') {
    if (record.revision !== undefined) next.revision = text(record.revision,'revision');
    if (record.phase !== undefined) {
      if (!['preparing','executing','reviewing','verifying','awaiting-input','stopped-incomplete'].includes(record.phase)) fail('invalid phase');
      next.phase = record.phase;
    }
    for (const key of ['nextAction','hostStatus']) if (record[key] !== undefined) next[key] = text(record[key],key);
    for (const key of ['designReference','baseRevision']) if (record[key] !== undefined) next[key] = text(record[key],key);
    if (record.activeMode !== undefined && record.activeMode !== 'use-proofwork') fail('activeMode must be use-proofwork');
    for (const key of ['skills','outstandingEffects']) if (record[key] !== undefined) {
      if (!Array.isArray(record[key]) || !record[key].every(value => typeof value === 'string' && value.trim())) fail(`${key} must be a text array`);
      next[key] = [...record[key]];
    }
    if (record.playbook !== undefined) {
      if (!['investigate','bug-fix','feature','refactor','review'].includes(record.playbook)) fail('invalid playbook');
      next.playbook = record.playbook;
    }
    if (record.limits !== undefined) {
      if (!record.limits || typeof record.limits !== 'object' || Array.isArray(record.limits)) fail('limits must be an object');
      next.limits = structuredClone(record.limits);
    }
  } else if (command === 'complete') {
    if (record.revision !== next.revision) fail('completion revision differs from current checkpoint revision');
    if (!next.tasks.length || next.tasks.some(task => task.status !== 'reviewed' || task.result.revision !== next.revision)) fail('unreviewed task or stale task revision');
    if (next.findings.some(finding => finding.material && finding.status === 'open')) fail('unresolved material finding');
    if (next.outstandingEffects?.length) fail('outstanding effects require reconciliation');
    if (next.criteria.some(criterion => !next.evidence.filter(item => item.criterion === criterion && item.revision === next.revision).at(-1)?.passed)) fail('missing current passing evidence; latest observation must pass');
    next.phase = 'complete'; next.nextAction = 'Report verified result and update native goal under its live contract';
  } else fail(`unknown command ${command}`);
  return next;
}

async function safePath(root, relativePath, label) {
  relative(relativePath,label);
  let candidate = root;
  for (const part of relativePath.split('/')) {
    candidate = path.join(candidate,part);
    try { if ((await lstat(candidate)).isSymbolicLink()) fail(`${label} cannot contain symlinks`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return candidate;
}
async function digest(file) { return createHash('sha256').update(await readFile(file)).digest('hex'); }
async function save(file,state,backup) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary,`${JSON.stringify(state,null,2)}\n`,{flag:'wx'});
    if (backup) {
      const backupFile = path.join(path.dirname(file),'state.backup.json');
      try { if ((await lstat(backupFile)).isSymbolicLink()) fail('backup cannot contain symlinks'); }
      catch(error) { if(error.code !== 'ENOENT') throw error; }
      const backupTemporary = `${backupFile}.${randomUUID()}.tmp`;
      try { await copyFile(file,backupTemporary); await rename(backupTemporary,backupFile); }
      finally { await unlink(backupTemporary).catch(error => {if(error.code !== 'ENOENT') throw error;}); }
    }
    await rename(temporary,file);
  } finally { await unlink(temporary).catch(error => {if(error.code !== 'ENOENT') throw error;}); }
}

export async function execute(command, options) {
  if (command === 'route') return route(options.task,(options.files ?? '').split(',').filter(Boolean));
  const repo = await realpath(text(options.repo,'repo'));
  const run = id(options.run,'run');
  const directory = await safePath(repo,`.engineering-team/runs/${run}`,'run');
  if (command === 'status') return JSON.parse(await readFile(await safePath(repo,`.engineering-team/runs/${run}/state.json`,'state'),'utf8'));
  text(options.owner,'owner');
  await mkdir(directory,{recursive:true});
  const lock = await safePath(repo,`.engineering-team/runs/${run}/write.lock`,'lock');
  let locked = false;
  try {
    await writeFile(lock,options.owner,{flag:'wx'}); locked = true;
    const file = await safePath(repo,`.engineering-team/runs/${run}/state.json`,'state');
    if (command === 'init') {
      try { await lstat(file); fail('run already exists'); } catch(error) { if(error.code !== 'ENOENT') throw error; }
      const criteria = (options.criteria ?? '').split(',').map(value => value.trim()).filter(Boolean);
      if (!criteria.length || new Set(criteria).size !== criteria.length) fail('criteria must be unique nonempty identifiers');
      const state = {schemaVersion:1,run,owner:options.owner,activeMode:'use-proofwork',repo,baseRevision:text(options.revision,'revision'),designReference:options.design ?? null,skills:[],playbook:null,limits:{},outstandingEffects:[],objective:text(options.objective,'objective'),revision:options.revision,criteria,phase:'preparing',tasks:[],evidence:[],findings:[],nextAction:'Scope work and dispatch bounded assignments'};
      await save(file,state,false); return state;
    }
    const state = JSON.parse(await readFile(file,'utf8'));
    if (state.schemaVersion !== 1 || state.run !== run || state.repo !== repo) fail('invalid checkpoint identity');
    if (state.owner !== options.owner) fail('only the coordinator owner may update aggregate state');
    const record = command === 'complete' ? {revision:text(options.revision,'revision')} : JSON.parse(await readFile(text(options.input,'input'),'utf8'));
    if (command === 'evidence') record.digest = await digest(await safePath(repo,record.artifact,'artifact'));
    const next = transition(state,command,record,options.owner);
    if (command === 'complete') {
      for (const criterion of next.criteria) {
        const item = next.evidence.filter(item => item.criterion === criterion && item.revision === next.revision).at(-1);
        if (item.digest !== await digest(await safePath(repo,item.artifact,'artifact'))) fail(`evidence artifact changed for ${criterion}`);
      }
    }
    await save(file,next,true); return next;
  } finally { if (locked) await unlink(lock); }
}

const help = `Proofwork local tools (Node >=22). JSON on stdout; failures exit 1.
route --task TEXT [--files comma,separated,paths]
init --repo PATH --run ID --owner SESSION --objective TEXT --revision REV --criteria criterion,ids
status --repo PATH --run ID
assign|result|evidence|finding|checkpoint --repo PATH --run ID --owner SESSION --input JSON_FILE
complete --repo PATH --run ID --owner SESSION --revision REV
See scripts/README.md for schemas and safety limits.`;
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [command,...args] = process.argv.slice(2);
    if (!command || command === '--help' || command === 'help') console.log(help);
    else {
      const options = {};
      for (let index=0;index<args.length;index+=2) {
        if (!/^--[a-z]+$/.test(args[index]) || args[index+1] === undefined || args[index+1].startsWith('--')) fail('options require --name value pairs');
        if (Object.hasOwn(options,args[index].slice(2))) fail('duplicate option');
        options[args[index].slice(2)] = args[index+1];
      }
      console.log(JSON.stringify(await execute(command,options),null,2));
    }
  } catch(error) { console.error(error.message); process.exitCode = 1; }
}
