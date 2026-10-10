import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { explainRoute } from '../scripts/routing.mjs';

const cases = [
 ['Fix typo', ['README.md'], 'quick-fix', 'light'],
 ['How does the parser reject invalid input?', ['parser.rs'], 'clarify-path', 'light'],
 ['Fix export dropping the final page', ['export.ts'], 'repair-behavior', 'standard'],
 ['Implement invoice validation', ['invoice.py'], 'add-or-change-behavior', 'standard'],
 ['Simplify parser structure', ['parser.rs'], 'simplify-structure', 'standard'],
 ['Measure and reduce checkout latency', ['checkout.ts'], 'improve-measurement', 'standard'],
 ['Choose a database for the invoice app', [], 'justify-structure', 'standard'],
 ['Prepare production release', [], 'harden-and-finish', 'standard'],
 ['Run audit-stack on this service', [], 'coordinated-audit', 'full'],
 ['Compare implementations of the parser', ['parser.rs'], 'explore-options', 'standard'],
 ['Use Long Task to implement the invoice workflow', [], 'long-task', 'full'],
 ['I want an app to track my invoices', [], 'shape-intent', 'standard'],
 ['Resume work on the interrupted export run', [], 'resume-work', 'standard'],
];
test('named procedures cover every requested workflow with real packaged guide paths', () => {
 for (const [task, files, id, tier] of cases) {
  const p=explainRoute(task,files); assert.equal(p.procedure.id,id,task); assert.equal(p.tier,tier,task);
  assert.ok(existsSync('shared/'+p.procedure.path),p.procedure.path);
  assert.equal(p.procedure.actualTier,p.tier);
 }
});
test('explicit full playbooks select full coordination and may not discard behavioral floors', () => {
 for(const name of ['Justify Structure','Harden and Finish','Coordinated Audit','Explore Options','Long Task']) {
  const p=explainRoute('Use '+name+' for this service'); assert.equal(p.tier,'full',name);
  assert.equal(explainRoute('Use '+name+' for this service',[],'light').tier,'full',name);
 }
 const p=explainRoute('Use Quick Fix to implement parser validation',['parser.rs'],'light');
 assert.equal(p.tier,'standard'); assert.ok(p.skills.includes('tdd-95'));
});
test('read-only and quoted documentation mentions never request operational authority', () => {
 for(const task of ['Explain Harden and Finish','Write documentation about Long Task']) {
  const p=explainRoute(task,['README.md']); assert.equal(p.procedure.explicit,false);
  assert.notEqual(p.procedure.id,'long-task');
 }
 const p=explainRoute('Use Clarify Path to explain concurrent queue',['queue.rs']);
 assert.equal(p.tier,'light'); assert.equal(p.procedure.id,'clarify-path');
 assert.ok(!p.skills.includes('tdd-95'));
});
test('full audit and finishing defer independent review and map impact before edits', () => {
 for(const task of ['Use Coordinated Audit for this service','Use Harden and Finish for this app']) {
  const p=explainRoute(task); assert.ok(p.workflow.beforeWork.includes('impact-map'));
  assert.ok(p.workflow.review.includes('challenge-review'));
 }
 assert.ok(explainRoute('Use Coordinated Audit for this service').skills.includes('audit-stack'));
 const finish=explainRoute('Use Harden and Finish for this app');
 assert.ok(finish.skills.includes('production-finish')); assert.ok(finish.skills.includes('security-hardening'));
});
test('all canonical guides are bounded and legacy persisted stages remain stable', () => {
 const names=['quick-fix','clarify-path','repair-behavior','add-or-change-behavior','simplify-structure',
 'improve-measurement','justify-structure','harden-and-finish','coordinated-audit','explore-options','long-task','shape-intent','resume-work'];
 for(const name of names) assert.ok(readFileSync('shared/playbooks/'+name+'.md','utf8').split(/\s+/).length<=120,name);
 assert.equal(explainRoute('Fix export dropping the final page',['export.ts']).playbook,'bug-fix');
});

test('explicit clarification and read-only qualifiers exclude effects and behavioral testing', () => {
 for(const task of ['Use Clarify Path to explain uncertain prototype behavior',
   'Use Harden and Finish for this service in read-only mode']) {
  const p=explainRoute(task,['service.rs']);
  assert.equal(p.playbook,'investigate'); assert.ok(!p.skills.includes('tdd-95'));
  assert.deepEqual(p.workflow.options,[]); assert.ok(!p.workflow.beforeWork.includes('probe-first'));
 }
});
test('every explicit standard or special playbook honors its named stage', () => {
 for(const [name,id,stage] of [['Repair Behavior','repair-behavior','bug-fix'],
 ['Add or Change Behavior','add-or-change-behavior','feature'],['Simplify Structure','simplify-structure','refactor'],
 ['Improve Measurement','improve-measurement','investigate'],['Shape Intent','shape-intent','brainstorm'],
 ['Resume Work','resume-work','feature']]) {
  const p=explainRoute('Use '+name+' for this task'); assert.equal(p.procedure.id,id); assert.equal(p.playbook,stage);
 }
});

test('documented root invocations preserve explicit procedure requests', () => {
 for(const prefix of ['Use Proofwork. ', '/proofwork:use-proofwork ', '$use-proofwork ']) {
  const p=explainRoute(prefix+'Follow Explore Options for the parser',['parser.rs']);
  assert.equal(p.procedure.id,'explore-options'); assert.equal(p.procedure.explicit,true); assert.equal(p.tier,'full');
 }
});
