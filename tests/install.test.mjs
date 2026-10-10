import test from 'node:test';
import assert from 'node:assert/strict';
import { installPlan, install, parseInstallArgs, cliInvocation } from '../scripts/install.mjs';
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


test('explicit CLI files bypass shell wrappers and select loaded folder versions', () => {
  const args = ['plugin', 'list', '--json'];
  assert.deepEqual(cliInvocation('codex', args), { command: 'codex', args });
  for (const cli of ['host.js', 'host.cjs', 'host.mjs']) {
    const resolved = cliInvocation('codex', args, cli);
    assert.equal(resolved.command, process.execPath);
    assert.deepEqual(resolved.args.slice(1), args);
  }
  assert.notEqual(cliInvocation('codex', args, 'host.exe').command, 'codex');
  for (const cli of ['', '-invalid', '\0', 1, 'host.cmd', 'host.bat', 'host.ps1'])
    assert.throws(() => cliInvocation('codex', args, cli), /cli/);
  assert.equal(parseInstallArgs(['--host', 'codex', '--cli', 'host.js']).cli, 'host.js');
  const listing = [{id:'proofwork@proofwork-local',enabled:true,version:'0.1.0',
    readFromFolder:'/fixture',folderVersion:'0.35.0'}];
  const run = () => ({status:0,stdout:JSON.stringify(listing)});
  assert.equal(install({host:'claude-code',cli:'host.js'},run).version,'0.35.0');
  delete listing[0].folderVersion;
  assert.throws(() => install({host:'claude-code'},run), /known version/);
});
