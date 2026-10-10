import { readFile, writeFile, mkdir, rename, copyFile, realpath, lstat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { route } from './routing.mjs';
import { acquireLock, releaseLock } from './runtime-locks.mjs';
import { snapshotIdentity, sameIdentity, ignoreHint, validateRevision } from './runtime-snapshot.mjs';
import { executeEvidence, redact } from './runtime-evidence.mjs';
export { route } from './routing.mjs';

const fail = message => { throw new Error(message); };
function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be nonempty text`);
  return value;
}
function id(value, label) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(text(value, label))) fail(`unsafe ${label}`);
  return value;
}
function unsafeSegment(part) {
  return !part || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part);
}
function relative(value, label) {
  text(value, label);
  if (path.isAbsolute(value) || /[\\:\x00<>"|?*]/.test(value) || value.split('/').some(unsafeSegment))
    fail(`unsafe ${label} path`);
  return value;
}
function pathsOverlap(left, right) {
  const a = left.toLowerCase(), b = right.toLowerCase();
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}
function checkOwnership(tasks, taskId, files) {
  const active = tasks.filter(task => task.id !== taskId && task.status !== 'reviewed');
  if (active.some(task => files.some(file => task.files.some(other => pathsOverlap(file, other)))))
    fail('ownership overlap; use isolated runs/checkouts or integrate first');
}
function textArray(value, label) {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string' && item.trim()))
    fail(`${label} must be a text array`);
  return [...value];
}
function assign(next, record) {
  id(record.id, 'task id'); text(record.objective, 'objective'); text(record.revision, 'revision');
  if (!Array.isArray(record.files) || !record.files.every(file => typeof file === 'string'))
    fail('files must be a path array');
  record.files.forEach(file => relative(file, 'ownership'));
  if (next.tasks.some(task => task.id === record.id)) fail('task already exists');
  checkOwnership(next.tasks, record.id, record.files);
  next.tasks.push({ ...record, status: 'assigned' }); next.phase = 'executing';
}
function result(next, record) {
  const index = next.tasks.findIndex(task => task.id === record.id);
  if (index < 0) fail('unknown task');
  if (!['ready-for-review', 'needs-revision', 'blocked', 'reviewed'].includes(record.status))
    fail('invalid result status');
  text(record.revision, 'revision'); text(record.summary, 'summary');
  if (record.status !== 'reviewed') checkOwnership(next.tasks, record.id, next.tasks[index].files);
  next.tasks[index] = { ...next.tasks[index], status: record.status, result: record }; next.phase = 'reviewing';
}
function evidence(next, record) {
  id(record.id, 'evidence id');
  if (!next.criteria.includes(record.criterion)) fail('unknown criterion');
  for (const key of ['revision', 'artifact', 'command', 'environment', 'observed']) text(record[key], key);
  if (typeof record.passed !== 'boolean') fail('passed must be boolean');
  relative(record.artifact, 'artifact');
  if (next.evidence.some(item => item.id === record.id))
    fail('evidence id already exists; record a new observation id');
  record.source ??= 'claimed'; next.evidence.push(record); next.phase = 'verifying';
}
function finding(next, record) {
  id(record.id, 'finding id'); text(record.summary, 'summary');
  if (typeof record.material !== 'boolean' || !['open', 'resolved', 'rejected'].includes(record.status))
    fail('invalid finding');
  if (record.status !== 'open') text(record.resolution, 'resolution evidence');
  next.findings = [...next.findings.filter(item => item.id !== record.id), record];
}
function checkpointPhase(next, record) {
  const phases = ['preparing', 'executing', 'reviewing', 'verifying', 'awaiting-input', 'stopped-incomplete'];
  if (record.phase !== undefined) {
    if (!phases.includes(record.phase)) fail('invalid phase');
    next.phase = record.phase;
  }
  if (record.activeMode !== undefined && record.activeMode !== 'use-proofwork')
    fail('activeMode must be use-proofwork');
}
function checkpointContext(next, record) {
  for (const key of ['revision', 'nextAction', 'hostStatus', 'designReference', 'baseRevision'])
    if (record[key] !== undefined) next[key] = text(record[key], key);
  for (const key of ['skills', 'outstandingEffects'])
    if (record[key] !== undefined) next[key] = textArray(record[key], key);
  if (record.limits !== undefined) {
    if (!record.limits || typeof record.limits !== 'object' || Array.isArray(record.limits))
      fail('limits must be an object');
    next.limits = structuredClone(record.limits);
  }
}
function checkpoint(next, record) {
  checkpointPhase(next, record); checkpointContext(next, record);
  if (record.playbook !== undefined) {
    const names = ['brainstorm', 'architecture', 'production-finish', 'investigate',
      'bug-fix', 'feature', 'refactor', 'review'];
    if (!names.includes(record.playbook)) fail('invalid playbook');
    next.playbook = record.playbook;
  }
}
const currentEvidence = (state, criterion) => state.evidence.filter(item =>
  item.criterion === criterion && item.revision === state.revision).at(-1);
function completionGates(next, record) {
  if (!Array.isArray(next.criteria) || !next.criteria.length ||
    next.criteria.some(criterion => typeof criterion !== 'string' || !criterion.trim()) ||
    new Set(next.criteria).size !== next.criteria.length) fail('invalid completion criteria');
  for (const field of ['tasks', 'findings', 'evidence']) {
    if (!Array.isArray(next[field]) || next[field].some(item => !item || typeof item !== 'object'))
      fail(`invalid completion ${field}`);
  }
  if (next.outstandingEffects !== undefined && !Array.isArray(next.outstandingEffects))
    fail('invalid outstanding effects');
  if (record.revision !== next.revision) fail('completion revision differs from current checkpoint revision');
  if (!next.tasks.length || next.tasks.some(task => task.status !== 'reviewed' ||
    task.result?.revision !== next.revision)) fail('unreviewed task or stale task revision');
  if (next.findings.some(item => item.material && item.status === 'open')) fail('unresolved material finding');
  if (next.outstandingEffects?.length) fail('outstanding effects require reconciliation');
  if (next.criteria.some(criterion => !currentEvidence(next, criterion)?.passed))
    fail('missing current passing evidence; latest observation must pass');
}
function completionClaims(next, record) {
  completionGates(next, record);
  const claimed = next.criteria.map(criterion => currentEvidence(next, criterion))
    .filter(item => item.source !== 'executed').map(item => item.id);
  if (!record.allowClaimed && claimed.length) fail('claimed evidence requires --allow-claimed');
  return claimed;
}
function complete(next, record) {
  next.claimedEvidence = completionClaims(next, record); next.phase = 'complete';
  next.nextAction = 'Report verified result and update native goal under its live contract';
}
export function transition(state, command, record, owner) {
  if (owner !== state.owner) fail('only the coordinator owner may update aggregate state');
  if (state.phase === 'complete') fail('completed run is immutable; initialize another run');
  if (!record || typeof record !== 'object' || Array.isArray(record)) fail('record must be an object');
  const handlers = { assign, result, evidence, finding, checkpoint, complete };
  const handler = Object.hasOwn(handlers, command) ? handlers[command] : null;
  if (!handler) fail(`unknown command ${command}`);
  const next = structuredClone(state);
  handler(next, structuredClone(record));
  return next;
}
async function rejectSymlink(file, label) {
  try { if ((await lstat(file)).isSymbolicLink()) fail(`${label} cannot contain symlinks`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
async function safePath(root, relativePath, label) {
  relative(relativePath, label);
  let candidate = root;
  for (const part of relativePath.split('/')) {
    candidate = path.join(candidate, part); await rejectSymlink(candidate, label);
  }
  return candidate;
}
async function digest(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}
async function removeTemporary(file) {
  await unlink(file).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
async function saveBackup(file) {
  const backup = path.join(path.dirname(file), 'state.backup.json');
  await rejectSymlink(backup, 'backup');
  const temporary = `${backup}.${randomUUID()}.tmp`;
  try { await copyFile(file, temporary); await rename(temporary, backup); }
  finally { await removeTemporary(temporary); }
}
async function save(file, state, backup) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { flag: 'wx' });
    if (backup) await saveBackup(file);
    await rename(temporary, file);
  } finally { await removeTemporary(temporary); }
}
function runCriteria(options) {
  const criteria = (options.criteria ?? '').split(',').map(value => value.trim()).filter(Boolean);
  if (!criteria.length || new Set(criteria).size !== criteria.length)
    fail('criteria must be unique nonempty identifiers');
  return criteria;
}
function initialState(repo, run, options) {
  return { schemaVersion: 1, run, owner: options.owner, activeMode: 'use-proofwork', repo,
    baseRevision: text(options.revision, 'revision'), designReference: options.design ?? null,
    skills: [], playbook: null, limits: {}, outstandingEffects: [], objective: text(options.objective, 'objective'),
    revision: options.revision, criteria: runCriteria(options), phase: 'preparing', tasks: [], evidence: [],
    findings: [], nextAction: 'Scope work and dispatch bounded assignments' };
}
async function initialize(file, repo, run, options) {
  try { await lstat(file); fail('run already exists'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const state = initialState(repo, run, options);
  state.snapshot = await snapshotIdentity(repo); validateRevision(repo, state.revision, state.snapshot);
  state.ignoreHint = ignoreHint(repo);
  await save(file, state, false);
  return state;
}
function validateState(state, repo, run, owner, readOnly = false) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) fail('invalid checkpoint structure');
  if (state.schemaVersion !== 1 || state.run !== run || state.repo !== repo) fail('invalid checkpoint identity');
  if (!readOnly && state.phase === 'complete') fail('completed run is immutable; initialize another run');
  if (state.owner !== owner) fail('only the coordinator owner may update aggregate state');
}
async function prepareEvidence(record, options, repo, state) {
  const artifact = await safePath(repo, record.artifact, 'artifact');
  if (options.command && !record.artifact.startsWith('.engineering-team/'))
    fail('executed observation artifact must be under .engineering-team/');
  transition(state, 'evidence', record, options.owner);
  const snapshot = await snapshotIdentity(repo);
  if (!sameIdentity(snapshot, state.snapshot)) fail('evidence identity differs from checkpoint; checkpoint first');
  if (options.command) Object.assign(record, await executeEvidence(record, options.command, repo, artifact));
  else record.source = 'claimed';
  record.snapshot = snapshot; record.digest = await digest(artifact);
  if (!sameIdentity(snapshot, await snapshotIdentity(repo))) fail('command changed codebase; checkpoint and rerun');
}
async function prepareRecord(command, options, repo, state) {
  const record = command === 'complete' ? { revision: text(options.revision, 'revision'),
    allowClaimed: options['allow-claimed'] === true }
    : JSON.parse(await readFile(text(options.input, 'input'), 'utf8'));
  if (command === 'evidence') await prepareEvidence(record, options, repo, state);
  if (command === 'checkpoint') record.snapshot = await snapshotIdentity(repo);
  return record;
}
async function verifyArtifacts(state, repo) {
  for (const criterion of state.criteria) {
    const item = currentEvidence(state, criterion);
    if (!sameIdentity(item.snapshot, state.snapshot)) fail(`stale evidence identity for ${criterion}`);
    if (item.digest !== await digest(await safePath(repo, item.artifact, 'artifact')))
      fail(`evidence artifact changed for ${criterion}`);
  }
}
async function verifyCompletion(state, record, repo) {
  if (!sameIdentity(state.snapshot, await snapshotIdentity(repo)))
    fail('codebase identity changed since checkpoint; checkpoint and verify again');
  completionClaims(state, record);
  await verifyArtifacts(state, repo);
}
async function preflight(options) {
  try {
    const repo = await realpath(text(options.repo, 'repo')), run = id(options.run, 'run');
    const file = await safePath(repo, `.engineering-team/runs/${run}/state.json`, 'state');
    const state = JSON.parse(await readFile(file, 'utf8'));
    validateState(state, repo, run, text(options.owner, 'owner'), true);
    await verifyCompletion(state, { revision: text(options.revision, 'revision'),
      allowClaimed: options['allow-claimed'] === true }, repo);
    return { ready: true, reasons: [] };
  } catch (error) { return { ready: false, reasons: [redact(error.message)] }; }
}
async function updateState(file, repo, run, command, options) {
  const state = JSON.parse(await readFile(file, 'utf8')); validateState(state, repo, run, options.owner);
  const record = await prepareRecord(command, options, repo, state);
  if (command === 'complete') await verifyCompletion(state, record, repo);
  const next = transition(state, command, record, options.owner);
  if (command === 'checkpoint') {
    validateRevision(repo, next.revision, record.snapshot); next.snapshot = record.snapshot;
  }
  await save(file, next, true);
  return next;
}
async function writeState(command, repo, run, directory, options) {
  text(options.owner, 'owner'); await mkdir(directory, { recursive: true });
  const lock = await safePath(repo, `.engineering-team/runs/${run}/write.lock`, 'lock');
  const raw = await acquireLock(lock, options.owner, options['break-lock'] === true);
  try {
    const file = await safePath(repo, `.engineering-team/runs/${run}/state.json`, 'state');
    return command === 'init' ? await initialize(file, repo, run, options)
      : await updateState(file, repo, run, command, options);
  } finally { await releaseLock(lock, raw); }
}
export async function execute(command, options) {
  if (command === 'route') return route(options.task, (options.files ?? '').split(',').filter(Boolean));
  if (command === 'preflight') return preflight(options);
  const repo = await realpath(text(options.repo, 'repo')), run = id(options.run, 'run');
  const directory = await safePath(repo, `.engineering-team/runs/${run}`, 'run');
  if (command === 'status')
    return JSON.parse(await readFile(
      await safePath(repo, `.engineering-team/runs/${run}/state.json`, 'state'), 'utf8'));
  return writeState(command, repo, run, directory, options);
}
const help = `Proofwork local tools (Node >=22). JSON on stdout; failures exit 1.
route --task TEXT [--files comma,separated,paths]
init --repo PATH --run ID --owner SESSION --objective TEXT --revision REV --criteria criterion,ids
status --repo PATH --run ID
assign|result|evidence|finding|checkpoint --repo PATH --run ID --owner SESSION --input JSON_FILE
evidence also accepts --command TEXT; command observations belong under .engineering-team/.
complete --repo PATH --run ID --owner SESSION --revision REV [--allow-claimed]
preflight --repo PATH --run ID --owner SESSION --revision REV [--allow-claimed] (read-only readiness)
Any write accepts --break-lock for explicitly verified stale/remote lock recovery.
See scripts/README.md for schemas and safety limits.`;
function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length;) {
    const name = args[index++];
    if (!/^--[a-z]+(?:-[a-z]+)*$/.test(name) || Object.hasOwn(options, name.slice(2)))
      fail('invalid or duplicate option');
    options[name.slice(2)] = ['--break-lock', '--allow-claimed'].includes(name) ? true : args[index++];
    if (options[name.slice(2)] === undefined || String(options[name.slice(2)]).startsWith('--'))
      fail('options require --name value pairs');
  }
  return options;
}
async function cli() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || command === 'help') console.log(help);
  else console.log(JSON.stringify(await execute(command, parseOptions(args)), null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  cli().catch(error => { console.error(redact(error.message)); process.exitCode = 1; });
}
