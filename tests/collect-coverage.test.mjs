import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLcov } from '../scripts/collect-coverage.mjs';

const coverage = fields => `${fields.join('\n')}\nend_of_record\n`;
const valid = ['SF:scripts/a.mjs', 'LH:100', 'LF:100', 'BRH:100', 'BRF:100'];

test('contradictory duplicate scalar fields cannot overwrite lower coverage', () => {
  for (const field of ['SF', 'LH', 'LF', 'BRH', 'BRF']) {
    const duplicate = field === 'SF' ? 'SF:scripts/other.mjs' : `${field}:0`;
    assert.throws(() => normalizeLcov(coverage([duplicate, ...valid]), ['scripts/a.mjs'], 'fixture'),
      /duplicate LCOV field/);
  }
});

test('LCOV count fields require decimal nonnegative integers rather than JavaScript numeric coercion', () => {
  for (const invalid of ['1e2', '0x64', 'NaN', 'Infinity', ' 100', '+100', '100.0', '-1', '']) {
    const fields = valid.map(field => field.startsWith('LH:') ? `LH:${invalid}` : field);
    assert.throws(() => normalizeLcov(coverage(fields), ['scripts/a.mjs'], 'fixture'),
      /invalid LCOV count|missing/);
  }
});

test('every LCOV record needs its own complete terminator', () => {
  const unterminated = valid.join('\n');
  assert.throws(() => normalizeLcov(unterminated, ['scripts/a.mjs'], 'fixture'), /unterminated/);
  assert.throws(() => normalizeLcov(coverage(valid) + unterminated, ['scripts/a.mjs'], 'fixture'), /unterminated/);
});
