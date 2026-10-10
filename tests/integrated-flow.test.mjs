import test from 'node:test';
import assert from 'node:assert/strict';
import { route, explainRoute } from '../scripts/routing.mjs';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { transition, execute } from '../scripts/proofwork.mjs';

const subjects=[['Fix export rejection',['export.rs']],['How does the parser reject invalid input?',['parser.rs']],
 ['Why was this cache limit chosen?',['cache.rs']],['Choose a framework and compare implementations',[]]];
test('root invocation wrappers preserve the same intent, stage and phases as ordinary task text',()=>{
 for(const [task,files] of subjects)for(const prefix of ['Use Proofwork. ','Use Proofwork to ',
 '/proofwork:use-proofwork ','/use-proofwork ','$use-proofwork ']){
  assert.deepEqual(explainRoute(prefix+task,files),explainRoute(task,files),prefix+task);
 }
});
test('question-shaped decision requests keep experimental options rather than becoming read-only explanations',()=>{
 const p=explainRoute('What framework should we choose? Compare implementations for this app.');
 assert.ok(p.workflow.options.includes('option-arena')); assert.ok(p.skills.includes('language-fit'));
});
test('ordinary coordinator work never loads worker-only assignment instructions',()=>{
 for(const task of ['Implement invoice validation','Fix export rejection','Implement concurrent export',
 'Run audit-stack','Choose a database'])assert.ok(!explainRoute(task,['src/export.ts']).skills.includes('pw-worker-mode'),task);
});
test('mixed review and repair receives a modifying guide and matching verification in both route APIs',()=>{
 for(const task of ['Review and fix parser rejection','Review and refactor parser ownership','Review and rework parser ownership','Review and implement parser validation']){
  const p=explainRoute(task,['parser.rs']);assert.notEqual(p.procedure.id,'clarify-path');
  assert.ok(p.skills.includes('tdd-95'));assert.ok(route(task,['parser.rs']).skills.includes('tdd-95'));
 }
});
test('explicit measurement, alternatives and recovery wire in the actual next guidance',()=>{
 const measured=explainRoute('Use Improve Measurement for checkout', ['checkout.ts']);
 assert.ok(measured.workflow.options.includes('measure-loop'));
 const arena=explainRoute('Use Explore Options for invoice serialization', ['invoice.py']);
 assert.ok(arena.workflow.options.includes('option-arena'));
 const resumed=explainRoute('Resume work on the interrupted run');
 assert.ok(resumed.continuation.references.includes('skills/use-proofwork/references/recovery.md'));
});
test('a stage handoff updates guidance without replacing the objective, criteria or ownership',()=>{
 let state={owner:'root',objective:'Deliver an invoice tracker',criteria:['Invoices survive restart'],
  phase:'preparing',tasks:[],evidence:[],findings:[],revision:'snapshot',outstandingEffects:[]};
 const stages=[['I want an app to track my invoices','brainstorm'],['Choose persistence for this invoice app','architecture'],
 ['Implement invoice validation','feature'],['Fix export rejection','bug-fix'],['Prepare production release','production-finish']];
 for(const [task,stage] of stages){const plan=explainRoute(task);assert.equal(plan.playbook,stage);
  state=transition(state,'checkpoint',{playbook:plan.playbook,skills:plan.skills,nextAction:task},'root');
  assert.equal(state.objective,'Deliver an invoice tracker');assert.deepEqual(state.criteria,['Invoices survive restart']);
  assert.equal(state.owner,'root');
 }
});

test('a disposable run resumes, records executed journey evidence and completes without another scheduler',async t=>{
 const repo=await mkdtemp(path.join(tmpdir(),'pw flow '));t.after(()=>rm(repo,{recursive:true,force:true}));
 await writeFile(path.join(repo,'export.cjs'),'module.exports = rows => JSON.stringify(rows);');
 await writeFile(path.join(repo,'verify.cjs'),
  'const assert=require("node:assert/strict");const serialize=require("./export.cjs");'+
  'const rows=[{id:1},{id:2}];assert.deepEqual(JSON.parse(serialize(rows)),rows);console.log("final row preserved");');
 const options={repo,run:'journey',owner:'root',revision:'fixture'};
 await execute('init',{...options,objective:'Preserve every exported invoice',criteria:'final row survives'});
 const record=async(command,value,extra={})=>{
  const input=path.join(repo,'.engineering-team/record.json');await writeFile(input,JSON.stringify(value));
  return execute(command,{...options,input,...extra});
 };
 await record('assign',{id:'export',objective:'Check invoice export',files:['export.cjs'],revision:'fixture'});
 await record('checkpoint',{phase:'stopped-incomplete',playbook:'bug-fix',nextAction:'verify the final row'});
 const restored=await execute('status',options);assert.equal(restored.nextAction,'verify the final row');
 assert.equal(restored.objective,'Preserve every exported invoice');
 await record('result',{id:'export',status:'reviewed',revision:'fixture',summary:'Fixture contract inspected'});
 await record('checkpoint',{});
 await record('evidence',{id:'journey',criterion:'final row survives',revision:'fixture',
  artifact:'.engineering-team/journey.txt',command:'node verify.cjs',environment:'isolated Node fixture',
  observed:'pending execution',passed:false},{command:'node verify.cjs'});
 const before=await readFile(path.join(repo,'.engineering-team/runs/journey/state.json'),'utf8');
 assert.equal((await execute('preflight',options)).ready,true);
 assert.equal(await readFile(path.join(repo,'.engineering-team/runs/journey/state.json'),'utf8'),before);
 assert.equal((await execute('complete',options)).phase,'complete');
});
