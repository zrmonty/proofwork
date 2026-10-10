import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkDescriptions, skillListing } from '../scripts/check-skill-list.mjs';
import { skillBudgets } from '../scripts/context-budget.mjs';

test('trigger descriptions reject repeated phrases, excess words and ambiguous sentences', () => {
  const valid = [{ name: 'rust', description: 'For Rust ownership changes.' },
    { name: 'python', description: 'For Python typing changes.' }];
  assert.equal(checkDescriptions(valid).passed, true);
  assert.equal(checkDescriptions(valid).words, 8);
  for (const description of ['', 'Unconditional instruction.', 'For Rust ownership changes.', 'Two sentences. Another sentence.',
    `${'word '.repeat(15)}end.`]) {
    assert.equal(checkDescriptions([...valid, { name: 'other', description }]).passed, false);
  }
  assert.equal(checkDescriptions([{ name: 'one', description: 'For code code code code.' }]).passed, true);
});

test('listing CLI and per-file budgets inspect real entries and nested references', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'pw-list-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const skill = path.join(root, 'shared/skills/example');
  mkdirSync(path.join(skill, 'references/nested'), { recursive: true });
  writeFileSync(path.join(skill, 'SKILL.md'), '---\nname: example\ndescription: For explicit setup work.\n---');
  writeFileSync(path.join(skill, 'references/nested/guide.md'), 'word '.repeat(800));
  writeFileSync(path.join(skill, 'references/nested/ignored.json'), '{}');
  const run = () => spawnSync(process.execPath, ['scripts/check-skill-list.mjs', root], { encoding: 'utf8' });
  assert.equal(run().status, 0);
  assert.equal(skillListing(root).skills, 1);
  assert.equal(skillBudgets(root).find(file => file.limit === 800).words, 800);
  writeFileSync(path.join(skill, 'SKILL.md'), 'word '.repeat(600));
  assert.equal(skillBudgets(root).find(file => file.limit === 600).words, 600);
  assert.equal(run().status, 1);
  writeFileSync(path.join(skill, 'SKILL.md'), 'word '.repeat(601));
  writeFileSync(path.join(skill, 'references/nested/guide.md'), 'word '.repeat(801));
  assert.equal(skillBudgets(root).filter(file => file.words > file.limit).length, 2);
});
