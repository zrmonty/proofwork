import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeOutcome,compareOutcomes} from '../evals/ab/outcomes.mjs';
const row=(arm,repetition=1)=>({task:'release-config',arm,repetition,runnerExitCode:0,
 hiddenAccepted:true,regressions:0,durationMs:20});
const record=(arm,value)=>({task:'release-config',arm,repetition:1,comparisonValid:true,
 technicalDecisionsReturned:value,clarificationRounds:value,deliveredDefects:value,reworkRounds:value,
 timeToVerifiedSliceMs:value,withoutTechniqueNames:true,correctionRecoveryPassed:true,wouldShip:false});
test('unknown observations remain null, and invalid counts are never treated as zero',()=>{
 const result=normalizeOutcome({technicalDecisionsReturned:-1,clarificationRounds:NaN,
  timeToVerifiedSliceMs:Infinity,withoutTechniqueNames:'yes'});
 assert.equal(result.technicalDecisionsReturned,null);assert.equal(result.clarificationRounds,null);
 assert.equal(result.timeToVerifiedSliceMs,null);assert.equal(result.withoutTechniqueNames,null);
 assert.equal(result.source,'observer-reported');
});
test('paired comparisons report denominators and changes without exporting narrative',()=>{
 const report=compareOutcomes([row('bare'),row('proofwork')],[record('bare',3),record('proofwork',1)]);
 assert.equal(report.pairs,1);assert.equal(report.metrics.clarificationRounds.pairs,1);
 assert.equal(report.metrics.clarificationRounds.meanDelta,-2);
 assert.equal(report.metrics.wouldShip.proofworkTrue,0);
 assert.equal(JSON.stringify(report).includes('observer-reported'),true);
});
test('missing, interrupted and unequal arms remain explicitly incomplete',()=>{
 const report=compareOutcomes([row('bare'),{...row('proofwork'),runnerExitCode:null}],[]);
 assert.equal(report.successfulRunnerExitPairs,0);assert.equal(report.metrics.deliveredDefects.pairs,0);
 assert.equal(report.metrics.deliveredDefects.meanDelta,null);
 assert.equal(compareOutcomes([row('bare')],[]).unpairedRows,1);
});
test('duplicate observations or rows cannot inflate apparent sample size',()=>{
 assert.throws(()=>compareOutcomes([row('bare'),row('bare')],[]),/duplicate/);
 assert.throws(()=>compareOutcomes([row('bare')],[record('bare',1),record('bare',2)]),/duplicate/);
});

test('published release configuration repair passes the original acceptance and preservation checks', async t=>{
 const {mkdtempSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');
 const {verifyTask,tasks}=await import('../evals/ab/run.mjs');
 const root=mkdtempSync(path.join(tmpdir(),'proofwork-example-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 const result=verifyTask('evals/examples/release-config',tasks.find(t=>t.id==='release-config'),root);
 assert.equal(result.visible.passed,true);assert.equal(result.acceptance.passed,true);
 assert.equal(result.regression.passed,true);
});

test('exit zero alone never makes a usable comparison',()=>{
 const review=[record('bare',3),{...record('proofwork',1),comparisonValid:false}];
 const report=compareOutcomes([row('bare'),row('proofwork')],review);
 assert.equal(report.successfulRunnerExitPairs,1);assert.equal(report.reviewedComparablePairs,0);
 assert.equal(report.metrics.clarificationRounds.pairs,0);
});
