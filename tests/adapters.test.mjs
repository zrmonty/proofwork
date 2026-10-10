import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const hosts = ['codex','claude-code'];
const documents = ['runtime.md','control-cli.md','control-ui.md','goal.md'];
const requiredHeadings = {
  'runtime.md': ['Proofwork runtime','Entry and discovery','Shell, subagents and browser capabilities',
    'Models and evidence','Installation and host contract','Invocation policy'],
  'control-cli.md': ['CLI verification','Commands and processes','Interactive verification and cleanup'],
  'control-ui.md': ['Browser verification','Capability discovery','Rendered verification and limits'],
  'goal.md': ['Goal lifecycle','Native ownership','Continuation and recovery','Completion and limits','Host contract'],
};
const requirements = {
  'runtime.md': [/shell/i,/subagents/i,/browser/i,/goal/i,/discover/i,/supported|available/i,/explicit/i],
  'control-cli.md': [/shell/i,/interactive/i,/incomplete|unverified/i,/exit status/i,/cleanup/i],
  'control-ui.md': [/browser/i,/connected|available/i,/missing|unavailable/i,/incomplete/i,/keyboard/i,/screenshots/i],
  'goal.md': [/native/i,/unavailable/i,/manual resume/i,/checkpoint/i,/completion|complete/i,/permission|host rules/i],
};

async function readAdapters() {
  const entries = await Promise.all(hosts.flatMap(host => documents.map(async document => {
    return [`${host}/${document}`,await readFile(new URL(`../adapters/${host}/${document}`,import.meta.url),'utf8')];
  })));
  return Object.fromEntries(entries);
}

function adapterProblems(contents) {
  return hosts.flatMap(host => documents.flatMap(document => {
    const key = `${host}/${document}`;
    const content = contents[key] ?? '';
    const headings = [...content.matchAll(/^#{1,6} (.+)$/gm)].map(match => match[1].trim());
    const expected = requiredHeadings[document];
    const errors = JSON.stringify(headings) === JSON.stringify(expected) ? [] : [`${key}: heading drift`];
    return errors.concat(requirements[document].filter(pattern => !pattern.test(content))
      .map(pattern => `${key}: missing capability contract ${pattern}`));
  }));
}

test('both host adapters retain the same document sections and capability contracts', async () => {
  assert.deepEqual(adapterProblems(await readAdapters()),[]);
});

test('adapter parity rejects omitted sections, missing capabilities and missing documents', async () => {
  const original = await readAdapters();
  for (const host of hosts) {
    const missingSection = {...original};
    missingSection[`${host}/runtime.md`] = missingSection[`${host}/runtime.md`]
      .replace('## Shell, subagents and browser capabilities','## Tools');
    assert.ok(adapterProblems(missingSection).some(problem => problem.includes('heading drift')));
    const missingCapability = {...original};
    missingCapability[`${host}/control-ui.md`] = missingCapability[`${host}/control-ui.md`]
      .replace(/keyboard/gi,'pointer');
    assert.ok(adapterProblems(missingCapability).some(problem => problem.includes('keyboard')));
    const missingDocument = {...original};
    delete missingDocument[`${host}/goal.md`];
    assert.ok(adapterProblems(missingDocument).some(problem => problem.includes(`${host}/goal.md`)));
  }
});

test('manual invocation policies use each host documented metadata format', async () => {
  const contents = await readAdapters();
  const codex = contents['codex/runtime.md'];
  const claude = contents['claude-code/runtime.md'];
  assert.match(codex,/policy\.allow_implicit_invocation: false/);
  assert.match(codex,/agents\/openai\.yaml/);
  assert.match(codex,/explicit.*\$skill/is);
  assert.doesNotMatch(codex,/disable-model-invocation: true/);
  assert.match(claude,/disable-model-invocation: true.*SKILL\.md frontmatter/s);
  assert.match(claude,/preloading into subagents/);
  assert.doesNotMatch(claude,/policy\.allow_implicit_invocation: false/);
});
