import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, symlink, mkdir, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { route, transition, execute } from '../scripts/proofwork.mjs';

test('routing loads core discipline and affected languages without mutating inputs', () => {
  const files = ['src/a.tsx', 'src/main.rs', 'tools/fix.py'];
  const result = route('Fix the article layout bug', files);
  assert.equal(result.playbook, 'bug-fix');
  for (const skill of ['worker-mode', 'functional-programming', 'data-driven-development', 'clean-code', 'typescript-best-practices', 'rust-best-practices', 'python-best-practices', 'frontend-design']) assert.ok(result.skills.includes(skill));
  assert.deepEqual(files, ['src/a.tsx', 'src/main.rs', 'tools/fix.py']);
  assert.equal(route('Review this change').playbook, 'review');
  assert.equal(route('Investigate latency').playbook, 'investigate');
  assert.equal(route('Refactor parser').playbook, 'refactor');
  assert.equal(route('Implement API').playbook, 'feature');
});

const initial = { schemaVersion: 1, owner: 'coordinator', objective: 'fix', criteria: ['works'], revision: 'r1', phase: 'preparing', tasks: [], evidence: [], findings: [] };
test('routing selects security hardening for security intent without broad audit matches', () => {
  for (const task of ['Security audit and harden vulnerable code', 'Fix authorization bypass', 'Prevent SQL injection', 'Investigate SSRF', 'Harden this application', 'Review exposed credentials']) {
    assert.ok(route(task).skills.includes('security-hardening'), task);
  }
  for (const task of ['Audit article typography', 'Improve parser performance', 'Explain the security team meeting notes']) {
    assert.ok(!route(task).skills.includes('security-hardening'), task);
  }
});
test('routing selects humanizer for interface copy without treating HTTP headers as editorial work', () => {
  assert.ok(route('Build the account settings page',['src/Settings.tsx']).skills.includes('humanizer'));
  assert.ok(route('Humanize these error messages').skills.includes('humanizer'));
  assert.ok(route('Rewrite wording in the application').skills.includes('humanizer'));
  assert.ok(route('Rewrite the empty state').skills.includes('humanizer'));
  assert.ok(route('Improve button labels').skills.includes('humanizer'));
  assert.ok(route('Rewrite notification copy').skills.includes('humanizer'));
  assert.ok(!route('Fix HTTP response headers',['src/server.ts']).skills.includes('humanizer'));
  assert.ok(!route('Explain the parser algorithm',['src/parser.rs']).skills.includes('humanizer'));
});
test('routing loads measured performance and gated TDD for matching work', () => {
  assert.ok(route('Reduce benchmark runtime and improve throughput').skills.includes('performance-increase'));
  assert.ok(route('Make the parser faster').skills.includes('performance-increase'));
  assert.ok(route('Optimize the parser',['src/parser.ts']).skills.includes('performance-increase'));
  assert.ok(route('Implement a parser',['src/parser.ts']).skills.includes('tdd-95'));
  assert.ok(route('Consolidate redundant tests and enforce coverage').skills.includes('tdd-95'));
  assert.ok(!route('Explain the README wording').skills.includes('tdd-95'));
  assert.ok(!route('Fix the parser bug').skills.includes('performance-increase'));
});
test('routing selects requirements-based architecture and production finishing only for relevant intent', () => {
  assert.ok(route('Architect a club app for about 100 people').skills.includes('architecture-fit'));
  assert.ok(route('Choose SQLite or PostgreSQL for a small app').skills.includes('architecture-fit'));
  assert.ok(route('Which database should this app use for 100 users?').skills.includes('architecture-fit'));
  assert.ok(route('Should this app use SQLite or PostgreSQL?').skills.includes('architecture-fit'));
  assert.ok(route('Finish this app for production and build a Docker image').skills.includes('production-finish'));
  assert.ok(route('Prepare for production on an existing hosting platform').skills.includes('production-finish'));
  const focused = route('Fix the parser bug and finish its unit tests', ['src/parser.ts']);
  assert.ok(!focused.skills.includes('architecture-fit'));
  assert.ok(!focused.skills.includes('production-finish'));
  assert.ok(!route('Fix the parser bug and finish unit tests for the app').skills.includes('production-finish'));
  assert.ok(!route('Fix the SQLite query bug').skills.includes('architecture-fit'));
});
test('reopening a reviewed task cannot reclaim paths assigned to another active worker', () => {
  const assigned = transition(initial,'assign',{id:'a',objective:'fix',files:['src'],revision:'r1'},'coordinator');
  const reviewed = transition(assigned,'result',{id:'a',status:'reviewed',revision:'r1',summary:'checked'},'coordinator');
  const reassigned = transition(reviewed,'assign',{id:'b',objective:'follow up',files:['SRC/main.ts'],revision:'r1'},'coordinator');
  for (const status of ['needs-revision','blocked','ready-for-review']) {
    assert.throws(() => transition(reassigned,'result',{id:'a',status,revision:'r1',summary:'reopened'},'coordinator'),/overlap/);
  }
  const independent = transition(reviewed,'assign',{id:'b',objective:'other work',files:['tests'],revision:'r1'},'coordinator');
  assert.equal(transition(independent,'result',{id:'a',status:'needs-revision',revision:'r1',summary:'reopened'},'coordinator').tasks[0].status,'needs-revision');
  assert.equal(reassigned.tasks[0].status,'reviewed');
});

test('a copied checkpoint cannot mutate under another repository identity', async () => {
  const repo = await mkdtemp(path.join(tmpdir(),'proofwork-source-'));
  const other = await mkdtemp(path.join(tmpdir(),'proofwork-copy-'));
  try {
    const options = {repo,run:'a',owner:'owner',objective:'test',revision:'r1',criteria:'works'};
    await execute('init',options);
    const directory = path.join(other,'.engineering-team/runs/a');
    await mkdir(directory,{recursive:true});
    await copyFile(path.join(repo,'.engineering-team/runs/a/state.json'),path.join(directory,'state.json'));
    const input = path.join(other,'checkpoint.json');
    await writeFile(input,JSON.stringify({nextAction:'continue in wrong repo'}));
    await assert.rejects(execute('checkpoint',{...options,repo:other,input}),/identity/);
    assert.equal((await execute('status',{...options,repo:other})).nextAction,'Scope work and dispatch bounded assignments');
  } finally { await rm(repo,{recursive:true,force:true}); await rm(other,{recursive:true,force:true}); }
});

test('pure transitions protect ownership, input and completion gates', () => {
  assert.throws(() => transition(initial, 'assign', {id:'a', objective:'fix', files:['a.ts'], revision:'r1'}, 'worker'), /owner/);
  const assigned = transition(initial, 'assign', {id:'a', objective:'fix', files:['a.ts'], revision:'r1'}, 'coordinator');
  assert.equal(initial.tasks.length, 0);
  assert.throws(() => transition(assigned, 'complete', {revision:'r1'}, 'coordinator'), /task/);
  assert.throws(() => transition(assigned, 'assign', {id:'b', objective:'fix', files:['a.ts'], revision:'r1'}, 'coordinator'), /overlap/);
  const reviewed = transition(assigned, 'result', {id:'a', status:'reviewed', revision:'r1', summary:'verified'}, 'coordinator');
  assert.throws(() => transition(reviewed, 'complete', {revision:'r1'}, 'coordinator'), /evidence/);
  const evidenced = transition(reviewed, 'evidence', {id:'e', criterion:'works', revision:'r1', artifact:'proof.txt', command:'test', environment:'fixture', observed:'passed', passed:true}, 'coordinator');
  assert.throws(() => transition(evidenced, 'complete', {revision:'r2'}, 'coordinator'), /revision/);
  const finding = transition(evidenced, 'finding', {id:'f', material:true, status:'open', summary:'defect'}, 'coordinator');
  assert.throws(() => transition(finding, 'complete', {revision:'r1'}, 'coordinator'), /finding/);
  assert.equal(transition(evidenced, 'complete', {revision:'r1'}, 'coordinator').phase, 'complete');
});

test('record mutation cannot change checkpoint outputs; latest failed observation blocks completion', () => {
  const assignment = {id:'a',objective:'fix',files:['a.ts'],revision:'r1'};
  const assigned = transition(initial,'assign',assignment,'coordinator');
  assignment.files.push('surprise.ts');
  assert.deepEqual(assigned.tasks[0].files,['a.ts']);
  const reviewed = transition(assigned,'result',{id:'a',status:'reviewed',revision:'r1',summary:'checked'},'coordinator');
  const evidence = {id:'e1',criterion:'works',revision:'r1',artifact:'proof.txt',command:'test',environment:'fixture',observed:'pass',passed:true};
  const passed = transition(reviewed,'evidence',evidence,'coordinator');
  evidence.observed = 'changed outside';
  assert.equal(passed.evidence[0].observed,'pass');
  const failed = transition(passed,'evidence',{...evidence,id:'e2',observed:'fail',passed:false},'coordinator');
  assert.throws(() => transition(failed,'complete',{revision:'r1'},'coordinator'),/evidence/);
  assert.equal(failed.evidence.length,2);
});

test('checkpoints retain run context, reject unsafe paths and invalidate stale task results', () => {
  for (const file of ['../a.ts','.. /a.ts','NUL.txt','a.ts:stream','C:/a.ts','a\\b.ts']) assert.throws(() => transition(initial,'assign',{id:'a',objective:'fix',files:[file],revision:'r1'},'coordinator'),/path/);
  const assigned = transition(initial,'assign',{id:'a',objective:'fix',files:['src'],revision:'r1'},'coordinator');
  assert.throws(() => transition(assigned,'assign',{id:'b',objective:'fix',files:['src/a.ts'],revision:'r1'},'coordinator'),/overlap/);
  const checkpoint = transition(assigned,'checkpoint',{activeMode:'use-proofwork',designReference:'docs/design.md',skills:['clean-code'],playbook:'feature',limits:{workers:2},outstandingEffects:['inspect external action'],revision:'r2',hostStatus:'active'},'coordinator');
  assert.equal(checkpoint.designReference,'docs/design.md');
  assert.deepEqual(checkpoint.limits,{workers:2});
  assert.equal(checkpoint.revision,'r2');
  assert.throws(() => transition(checkpoint,'checkpoint',{activeMode:'other-mode'},'coordinator'),/activeMode/);
  const reviewed = transition(checkpoint,'result',{id:'a',status:'reviewed',revision:'r1',summary:'old result'},'coordinator');
  assert.throws(() => transition(reviewed,'complete',{revision:'r2'},'coordinator'),/stale/);
});

test('run paths reject directory junctions and a held lock rejects another writer', async () => {
  const repo = await mkdtemp(path.join(tmpdir(),'proofwork-boundary-'));
  const outside = await mkdtemp(path.join(tmpdir(),'proofwork-outside-'));
  try {
    await symlink(outside,path.join(repo,'.engineering-team'),'junction');
    await assert.rejects(execute('init',{repo,run:'a',owner:'owner',objective:'test',revision:'r1',criteria:'works'}),/symlink/);
    await rm(path.join(repo,'.engineering-team'));
    const options = {repo,run:'a',owner:'owner',objective:'test',revision:'r1',criteria:'works'};
    await execute('init',options);
    await writeFile(path.join(repo,'.engineering-team/runs/a/write.lock'),'live writer');
    const input = path.join(repo,'checkpoint.json');
    await writeFile(input,JSON.stringify({nextAction:'continue'}));
    await assert.rejects(execute('checkpoint',{...options,input}),error => error.code === 'EEXIST');
    assert.equal((await execute('status',options)).phase,'preparing');
  } finally { await rm(repo,{recursive:true,force:true}); await rm(outside,{recursive:true,force:true}); }
});

test('filesystem boundary rejects traversal, duplicate init and changed evidence; saves backup', async () => {
  const repo = await mkdtemp(path.join(tmpdir(), 'proofwork-'));
  try {
    const options = {repo, run:'run-1', owner:'coordinator', objective:'fix', revision:'r1', criteria:'works'};
    await assert.rejects(execute('init', {...options,run:'../escape'}), /run/);
    await execute('init', options);
    await assert.rejects(execute('init', options), /exists/);
    const assignment = path.join(repo, 'assignment.json');
    await writeFile(assignment, JSON.stringify({id:'a',objective:'fix',files:['a.ts'],revision:'r1'}));
    await execute('assign', {...options,input:assignment});
    assert.equal(JSON.parse(await readFile(path.join(repo,'.engineering-team/runs/run-1/state.backup.json'),'utf8')).tasks.length,0);
    await writeFile(assignment,JSON.stringify({id:'a',status:'reviewed',revision:'r1',summary:'verified'}));
    await execute('result',{...options,input:assignment});
    await writeFile(path.join(repo,'proof.txt'),'pass');
    await writeFile(assignment,JSON.stringify({id:'e',criterion:'works',revision:'r1',artifact:'../escape',command:'test',environment:'fixture',observed:'passed',passed:true}));
    await assert.rejects(execute('evidence',{...options,input:assignment}),/artifact/);
    await writeFile(assignment,JSON.stringify({id:'e',criterion:'works',revision:'r1',artifact:'proof.txt',command:'test',environment:'fixture',observed:'passed',passed:true}));
    await execute('evidence',{...options,input:assignment});
    await writeFile(path.join(repo,'proof.txt'),'changed');
    await assert.rejects(execute('complete',options),/changed/);
    await writeFile(path.join(repo,'proof.txt'),'pass');
    assert.equal((await execute('complete',options)).phase,'complete');
  } finally { await rm(repo,{recursive:true,force:true}); }
});

test('fresh CLI processes resume a checkpoint and verify completion without bypassing ownership', async () => {
  const repo = await mkdtemp(path.join(tmpdir(),'proofwork-cli-'));
  const script = fileURLToPath(new URL('../scripts/proofwork.mjs',import.meta.url));
  const cli = (command, ...args) => spawnSync(process.execPath,[script,command,'--repo',repo,'--run','cli-run',...args],{encoding:'utf8',windowsHide:true});
  const success = result => { assert.equal(result.status,0,result.stderr); return JSON.parse(result.stdout); };
  const input = path.join(repo,'record.json');
  const record = async (command, value) => {
    await writeFile(input,JSON.stringify(value));
    return success(cli(command,'--owner','coordinator','--input',input));
  };
  try {
    success(cli('init','--owner','coordinator','--objective','CLI resume','--revision','r1','--criteria','works'));
    await record('assign',{id:'a',objective:'verify',files:['src'],revision:'r1'});
    await record('checkpoint',{phase:'stopped-incomplete',nextAction:'resume task a'});
    assert.equal(success(cli('status')).nextAction,'resume task a');
    const file = path.join(repo,'.engineering-team/runs/cli-run/state.json');
    const before = await readFile(file,'utf8');
    const rejected = cli('checkpoint','--owner','worker','--input',input);
    assert.equal(rejected.status,1);
    assert.match(rejected.stderr,/owner/);
    assert.equal(await readFile(file,'utf8'),before);
    // Inspect the backup before manually restoring a corrupted current checkpoint.
    const backup = path.join(repo,'.engineering-team/runs/cli-run/state.backup.json');
    assert.equal(JSON.parse(await readFile(backup,'utf8')).tasks[0].id,'a');
    await writeFile(file,'{corrupt');
    assert.equal(cli('status').status,1);
    await copyFile(backup,file);
    await record('checkpoint',{phase:'executing',nextAction:'verify restored task a'});
    await record('result',{id:'a',status:'reviewed',revision:'r1',summary:'independently checked'});
    await writeFile(path.join(repo,'proof.txt'),'verified artifact');
    await record('evidence',{id:'e',criterion:'works',revision:'r1',artifact:'proof.txt',command:'fixture check',environment:'Node CLI',observed:'passed',passed:true});
    assert.equal(success(cli('complete','--owner','coordinator','--revision','r1')).phase,'complete');
    const immutable = cli('checkpoint','--owner','coordinator','--input',input);
    assert.equal(immutable.status,1);
    assert.match(immutable.stderr,/immutable/);
  } finally { await rm(repo,{recursive:true,force:true}); }
});
