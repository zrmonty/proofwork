import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { withTeamPolicy } from '../scripts/team-policy.mjs';
import { explainRoute } from '../scripts/routing.mjs';
import { execute } from '../scripts/proofwork.mjs';
import { runHook } from '../scripts/hook-policy.mjs';

const migration = { id: 'restore-before-migrate', statement: 'All migrations include a restore test.',
  evidence: 'Link the executed restore check and observed result.', when: { taskTerms: ['migration', 'migrations'] } };
const database = { id: 'earn-database', statement: 'No new databases without an architecture decision record.',
  evidence: 'Link the decision record and compared simpler alternatives.', when: { stages: ['architecture'] } };
async function fixture(t) {
  const repo = await mkdtemp(path.join(tmpdir(), 'pw team policy '));
  t.after(() => rm(repo, { recursive: true, force: true }));
  const put = value => writeFile(path.join(repo, '.proofwork.json'), JSON.stringify(value));
  return { repo, put };
}
const configured = rules => ({ commitFormat: 'off', modelRoles: {}, teamPolicy: { version: 1, rules } });

test('opted-in team rules select evidence without changing tiers, models or input values', async t => {
  const { repo, put } = await fixture(t);
  await put(configured([database, migration]));
  const plan = explainRoute('Implement account migration', ['src/db.rs']);
  const before = structuredClone(plan);
  const result = withTeamPolicy(plan, repo, 'Implement account migration', ['src/db.rs']);
  assert.deepEqual(plan, before);
  assert.equal(result.tier, 'full');
  assert.deepEqual(result.teamPolicy.rules, [migration]);
  assert.match(result.teamPolicy.digest, /^[a-f0-9]{64}$/);
  assert.equal(result.teamPolicy.source, '.proofwork.json');
  result.teamPolicy.rules[0].statement = 'mutated';
  assert.equal(migration.statement, 'All migrations include a restore test.');
  assert.deepEqual(withTeamPolicy(explainRoute('Choose database'), repo, 'Choose database', []).teamPolicy.rules,
    [database]);
  assert.deepEqual(withTeamPolicy(plan, repo, 'Implement transmigration', []).teamPolicy.rules, []);
  const first = result.teamPolicy.digest;
  await put(configured([{ ...migration, evidence: 'Run the restore check twice.' }]));
  assert.notEqual(withTeamPolicy(plan, repo, 'Implement migration', []).teamPolicy.digest, first);
});

test('absent policy is free; light opt-in and read-only rules never authorize writes', async t => {
  const { repo, put } = await fixture(t);
  const task = 'Fix typo in guide';
  const plan = explainRoute(task, ['README.md']);
  assert.deepEqual(withTeamPolicy(plan, repo, task, []).teamPolicy.rules, []);
  for (const config of [{}, { commitFormat: 'conventional' }, configured([])]) {
    await put(config);
    assert.deepEqual(withTeamPolicy(plan, repo, task, []).teamPolicy.rules, []);
  }
  await put(configured([{ ...migration, when: {} }]));
  assert.deepEqual(withTeamPolicy(plan, repo, task, []).teamPolicy.rules, []);
  await put(configured([{ ...migration, when: {}, includeLight: true }]));
  assert.equal(withTeamPolicy(plan, repo, task, []).teamPolicy.rules.length, 1);
  const readonly = withTeamPolicy(explainRoute('Explain migration'), repo, 'Explain migration', []);
  assert.equal(readonly.teamPolicy.mode, 'review-only');
  assert.equal(readonly.tier, 'light');
});

test('selectors combine with AND and path prefixes respect directory boundaries', async t => {
  const { repo, put } = await fixture(t);
  const rule = { ...database, when: { paths: ['db'], taskTerms: ['new database'], stages: ['architecture'] } };
  await put(configured([rule]));
  const plan = explainRoute('Choose new database');
  assert.equal(withTeamPolicy(plan, repo, 'Choose new database', ['db/schema.sql']).teamPolicy.rules.length, 1);
  assert.equal(withTeamPolicy(plan, repo, 'Choose new database', ['db']).teamPolicy.rules.length, 1);
  const windowsFiles = ['db\\schema.sql'];
  assert.equal(withTeamPolicy(plan, repo, 'Choose new database', windowsFiles).teamPolicy.rules.length, 1);
  assert.deepEqual(windowsFiles, ['db\\schema.sql']);
  for (const files of [[], ['db-old/schema.sql'], ['src/db/schema.sql']]) {
    assert.equal(withTeamPolicy(plan, repo, 'Choose new database', files).teamPolicy.rules.length, 0);
  }
  assert.equal(withTeamPolicy(plan, repo, 'Choose another database', ['db']).teamPolicy.rules.length, 0);
  assert.equal(withTeamPolicy({ ...plan, playbook: 'feature' }, repo, 'Choose new database', ['db'])
    .teamPolicy.rules.length, 0);
});

test('invalid, oversized or executable-shaped policy is visible rather than silently ignored', async t => {
  const { repo, put } = await fixture(t);
  const plan = explainRoute('Implement migration');
  const invalid = [null, [], { teamPolicy: null }, { teamPolicy: { version: 2, rules: [] } },
    configured([migration, migration]), configured([migration, database, { ...database, id: 'third' },
      { ...database, id: 'fourth' }]), configured([{ ...migration, statement: 'word '.repeat(61) }]),
    configured([{ ...migration, evidence: 'word '.repeat(41) }]), configured([{ ...migration, id: 'Bad ID' }]),
    configured([{ ...migration, includeLight: 'yes' }]), configured([{ ...migration, command: 'rm -rf' }]),
    configured([{ ...migration, when: [] }]), configured([{ ...migration, when: { regex: '.*' } }]),
    configured([{ ...migration, when: { paths: ['../secret'] } }]),
    configured([{ ...migration, when: { stages: ['unknown'] } }]),
    configured([{ ...migration, when: { taskTerms: ['bad(term)'] } }]),
    configured([{ ...migration, when: { taskTerms: [] } }]),
    configured([{ ...migration, when: { taskTerms: ['one', 'one'] } }]),
    configured([{ ...migration, when: { taskTerms: 'migration' } }]),
    { teamPolicy: { version: 1, rules: [], unknown: true } }];
  for (const config of invalid) {
    await put(config);
    assert.throws(() => withTeamPolicy(plan, repo, 'Implement migration', []), /Invalid .*teamPolicy/);
  }
  await writeFile(path.join(repo, '.proofwork.json'), '{malformed');
  assert.throws(() => withTeamPolicy(plan, repo, 'Implement migration', []), /Invalid/);
  await writeFile(path.join(repo, '.proofwork.json'), ' '.repeat(65537));
  assert.throws(() => withTeamPolicy(plan, repo, 'Implement migration', []), /Invalid/);
  await rm(path.join(repo, '.proofwork.json'));
  await mkdir(path.join(repo, '.proofwork.json'));
  assert.throws(() => withTeamPolicy(plan, repo, 'Implement migration', []), /Invalid/);
});

test('CLI and both prompt adapters read repository policy without modifying it or creating a ledger', async t => {
  const { repo, put } = await fixture(t);
  await put(configured([migration]));
  const file = path.join(repo, '.proofwork.json');
  const before = await readFile(file, 'utf8');
  const result = await execute('route', { repo, explain: true, task: 'Implement migration' });
  assert.deepEqual(result.teamPolicy.rules, [migration]);
  const cli = spawnSync(process.execPath, [path.resolve('scripts/proofwork.mjs'), 'route', '--repo', repo,
    '--explain', '--task', 'Implement migration'], { encoding: 'utf8', windowsHide: true });
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(JSON.parse(cli.stdout).teamPolicy.rules[0].id, migration.id);
  for (const host of ['codex', 'claude-code']) {
    const hint = await runHook(host, { cwd: repo, session_id: 'policy-session', hook_event_name: 'UserPromptSubmit',
      prompt: '$use-proofwork Implement migration' });
    assert.match(hint.hookSpecificOutput.additionalContext, /restore-before-migrate/);
  }
  assert.equal(await readFile(file, 'utf8'), before);
  await assert.rejects(readFile(path.join(repo, '.engineering-team/runs/state.json')), /ENOENT/);
  await put({ teamPolicy: { version: 3 } });
  await assert.rejects(execute('route', { repo, explain: true, task: 'Fix typo' }), /Invalid/);
});

test('Git subdirectory invocation resolves the repository policy once', async t => {
  const { repo, put } = await fixture(t);
  const initialized = spawnSync('git', ['-C', repo, 'init', '--quiet'], { encoding: 'utf8', windowsHide: true });
  assert.equal(initialized.status, 0);
  await put(configured([database]));
  const child = path.join(repo, 'src');
  await mkdir(child);
  const result = withTeamPolicy(explainRoute('Choose database'), child, 'Choose database', []);
  assert.deepEqual(result.teamPolicy.rules, [database]);
});
