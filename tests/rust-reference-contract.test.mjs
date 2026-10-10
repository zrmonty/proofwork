import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const root = new URL('../shared/skills/rust-best-practices/references/', import.meta.url);
test('every Rust reference starts with five to seven explicit must rules', () => {
  const references = readdirSync(root).filter(file => file.endsWith('.md'));
  assert.ok(references.length >= 25);
  for (const file of references) {
    const text = readFileSync(new URL(file, root), 'utf8').replace(/\r\n/g, '\n');
    const list = text.match(/^# [^\n]+\n\n## Must\n\n((?:- Must [^\n]+\n){5,7})\n/);
    assert.ok(list, `${file}: put five to seven Must bullets immediately below the title`);
  }
});
