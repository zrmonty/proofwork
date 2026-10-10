import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const counts = ['technicalDecisionsReturned', 'clarificationRounds', 'deliveredDefects', 'reworkRounds'];
const flags = ['withoutTechniqueNames', 'correctionRecoveryPassed', 'wouldShip'];
const numeric = [...counts, 'timeToVerifiedSliceMs'];
const validCount = value => Number.isSafeInteger(value) && value >= 0;
export function normalizeOutcome(record = {}) {
  const result = { source: 'observer-reported', comparisonValid: record.comparisonValid === true };
  for (const key of counts) result[key] = validCount(record[key]) ? record[key] : null;
  const time = record.timeToVerifiedSliceMs;
  result.timeToVerifiedSliceMs = typeof time === 'number' && Number.isFinite(time) && time >= 0 ? time : null;
  for (const key of flags) result[key] = typeof record[key] === 'boolean' ? record[key] : null;
  return result;
}
function index(records) {
  const result = new Map();
  for (const record of records) {
    if (!['bare', 'proofwork'].includes(record.arm)) continue;
    if (!/^[a-z0-9-]{1,64}$/.test(record.task) || !validCount(record.repetition) || record.repetition < 1) {
      throw new Error('invalid outcome task identity');
    }
    const key = `${record.task}:${record.repetition}:${record.arm}`;
    if (result.has(key)) throw new Error('duplicate outcome identity');
    result.set(key, record);
  }
  return result;
}
export function compareOutcomes(rows, observations) {
  const runs = index(rows);
  const reviewed = index(observations);
  const pairs = [...runs].filter(([key]) => key.endsWith(':bare') &&
    runs.has(key.replace(/:bare$/, ':proofwork'))).map(([key, bare]) => {
    const other = key.replace(/:bare$/, ':proofwork');
    return { bare, proofwork: runs.get(other),
      observations: [normalizeOutcome(reviewed.get(key)), normalizeOutcome(reviewed.get(other))] };
  });
  const completed = pairs.filter(pair => pair.bare.runnerExitCode === 0 && pair.proofwork.runnerExitCode === 0);
  const eligible = completed.filter(pair => pair.observations.every(record => record.comparisonValid));
  const metrics = {};
  for (const key of [...numeric, ...flags]) {
    const values = eligible.map(pair => pair.observations.map(record => record[key]))
      .filter(pair => pair.every(value => value !== null));
    metrics[key] = numeric.includes(key) ? {
      pairs: values.length,
      meanDelta: values.length ? values.reduce((total, [a, b]) => total + b - a, 0) / values.length : null,
    } : { pairs: values.length, bareTrue: values.filter(([a]) => a).length,
      proofworkTrue: values.filter(([, b]) => b).length };
  }
  return { schemaVersion: 1, source: 'observer-reported; runner exit independently recorded',
    pairs: pairs.length, successfulRunnerExitPairs: completed.length, reviewedComparablePairs: eligible.length,
    acceptedPairs: pairs.filter(pair => pair.bare.hiddenAccepted && pair.proofwork.hiddenAccepted &&
      pair.bare.regressions === 0 && pair.proofwork.regressions === 0).length, unpairedRows: runs.size - pairs.length * 2,
    metrics, limits: ['Missing observations remain unknown; deltas require successful exits and an explicit valid-comparison review for both arms.',
      'Observer records require trace/artifact review; this module does not authenticate a human reviewer.',
      'Fixture acceptance failures are not counted as production defect rates or ship approval.'] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!['--results', '--observations', '--out'].includes(args[i]) || !args[i + 1] || options[args[i]]) {
        throw new Error('use unique --results, --observations and --out paths');
      }
      options[args[i]] = args[i + 1];
    }
    const read = file => JSON.parse(readFileSync(file, 'utf8'));
    const report = compareOutcomes(read(options['--results']).rows, read(options['--observations']));
    writeFileSync(options['--out'], JSON.stringify(report, null, 2) + '\n');
    console.log('Outcome comparison written. Review evidence and privacy before public export.');
  } catch { console.error('Outcome comparison failed: check input schemas, identities and output path.');
    process.exitCode = 1; }
}
