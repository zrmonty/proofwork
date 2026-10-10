import test from 'node:test';
import assert from 'node:assert/strict';
import {explainRoute} from '../scripts/routing.mjs';
test('operational requests load accountable release/security guidance without technique names',()=>{
 for(const task of ['Compare configuration drift between staging and live',
  'Write an operational runbook for restoring invoices',
  'Rehearse recovery after the database stops responding', 'Run failure-mode analysis on the export job']){
  const plan=explainRoute(task);assert.ok(plan.skills.includes('production-finish'),task);
  assert.notEqual(plan.tier,'light',task);
 }
 assert.ok(explainRoute('Check supply-chain integrity for the release image').skills.includes('security-hardening'));
});
test('operational vocabulary in cosmetic work does not impose release ceremony',()=>{
 for(const task of ['Fix a typo in the operational runbook','Fix spelling in the supply-chain guide']){
  const plan=explainRoute(task,['docs/operations.md']);assert.equal(plan.tier,'light');
  assert.equal(plan.skills.includes('production-finish'),false);
  assert.equal(plan.skills.includes('security-hardening'),false);
 }
 assert.equal(explainRoute('Explain how configuration drift is detected').tier,'light');
});
