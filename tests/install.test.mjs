import test from 'node:test';
import assert from 'node:assert/strict';
import { installPlan, install, parseInstallArgs } from '../scripts/install.mjs';
const good = (host, enabled = true) => ({status:0,stdout:JSON.stringify(host==='codex'
  ? {installed:[{pluginId:'proofwork@proofwork-local',version:'0.29.0',enabled}]}
  : [{id:'proofwork@proofwork-local',version:'0.29.0',enabled,scope:'user'}])});
test('one invocation registers, installs and verifies the qualified plugin on either host', () => {
  for (const host of ['codex','claude-code']) {
    const calls=[];
    const result=install({host,source:'.'}, (command,args,options)=>{
      calls.push({command,args,options}); return good(host);
    });
    assert.equal(result.version,'0.29.0'); assert.equal(result.host,host);
    assert.equal(result.verified,true); assert.equal(calls.length,3);
    assert.equal(calls[0].args.at(-1),'.');
    assert.equal(calls[1].args[2],'proofwork@proofwork-local');
    assert.equal(calls[1].args[1],host==='codex'?'add':'install');
    assert.equal(calls[0].options.shell,false);
    assert.equal(result.nextPrompt,host==='codex'?'$use-proofwork <your outcome>'
      : '/proofwork:use-proofwork <your outcome>');
  }
});
test('source strings stay single arguments; unknown hosts and options fail before effects', () => {
  assert.equal(installPlan('codex','path with spaces')[0].args.at(-1),'path with spaces');
  assert.throws(()=>installPlan('cursor'),/host/);
  for(const source of ['', '--evil']) assert.throws(()=>installPlan('codex',source),/source/);
  assert.deepEqual(parseInstallArgs(['--host','codex','--source','.']),{host:'codex',source:'.'});
  for(const args of [[],['--host'],['--host','codex','--host','codex'],['--yes','1']])
    assert.throws(()=>parseInstallArgs(args),/host|option/);
});
test('failed commands stop subsequent writes and surface bounded recovery', () => {
  for(const failure of [{status:1},{status:null,error:{code:'ENOENT'}},
    {status:null,error:{code:'ETIMEDOUT'}}]){
    let count=0; assert.throws(()=>install({host:'codex'},()=>{count++;return failure;}),/marketplace/);
    assert.equal(count,1);
  }
});
test('installation exit alone cannot certify enabled status or a known version', () => {
  for(const output of ['bad','{}',JSON.stringify({installed:[]}),
    JSON.stringify({installed:[{pluginId:'proofwork@proofwork-local',enabled:true}]}),
    JSON.stringify({installed:[{pluginId:'proofwork@proofwork-local',enabled:true,version:'unknown'}]}),
    good('codex',false).stdout]){
    assert.throws(()=>install({host:'codex'},()=>({status:0,stdout:output})),/verification/);
  }
});
