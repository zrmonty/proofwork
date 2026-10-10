import { readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { isReadOnlyTask } from './workflow-routing.mjs';

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const stages = ['brainstorm', 'architecture', 'production-finish', 'investigate',
  'bug-fix', 'feature', 'refactor', 'review', 'prototype'];
const fail = () => { throw new Error('Invalid .proofwork.json teamPolicy; see the team-policy contract'); };
const words = (value, maximum) => typeof value === 'string' && value.trim()
  && value.length <= maximum * 30 && value.trim().split(/\s+/u).length <= maximum;
const safePath = value => typeof value === 'string' && value.length <= 160
  && !/[:\\\0]/.test(value) && !value.startsWith('/')
  && value.split('/').every(part => part && part !== '.' && part !== '..');
function validatePolicy(policy) {
  if (!object(policy) || policy.version !== 1 || !Array.isArray(policy.rules) || policy.rules.length > 3
    || Object.keys(policy).some(key => !['version', 'rules'].includes(key))) fail();
  const names = new Set();
  for (const rule of policy.rules) {
    if (!object(rule) || !/^[a-z][a-z0-9-]{0,47}$/.test(rule.id ?? '') || names.has(rule.id)
      || !words(rule.statement, 60) || !words(rule.evidence, 40)
      || Object.keys(rule).some(key => !['id', 'statement', 'evidence', 'when', 'includeLight'].includes(key))) fail();
    if (rule.includeLight !== undefined && typeof rule.includeLight !== 'boolean') fail();
    names.add(rule.id);
    if (rule.when === undefined) continue;
    if (!object(rule.when) || Object.keys(rule.when).some(key => !['stages', 'taskTerms', 'paths'].includes(key)))
      fail();
    for (const [key, values] of Object.entries(rule.when)) {
      if (!Array.isArray(values) || !values.length || values.length > 8 || new Set(values).size !== values.length)
        fail();
      if (values.some(value => key === 'stages' ? !stages.includes(value)
        : key === 'paths' ? !safePath(value)
          : !words(value, 4) || !/^[a-z0-9 -]+$/i.test(value) || !/[a-z0-9]/i.test(value))) fail();
    }
  }
}
function readPolicy(repo) {
  let root = path.resolve(repo);
  try { root = execFileSync('git', ['-C', root, 'rev-parse', '--show-toplevel'],
    { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { /* Non-Git projects use the supplied root. */ }
  let raw;
  try {
    const file = path.join(root, '.proofwork.json');
    if (!statSync(file).isFile() || statSync(file).size > 65536) fail();
    raw = readFileSync(file, 'utf8');
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  let config;
  try { config = JSON.parse(raw); } catch { fail(); }
  if (!object(config)) fail();
  if (!Object.hasOwn(config, 'teamPolicy')) return null;
  validatePolicy(config.teamPolicy);
  return { policy: config.teamPolicy, digest: createHash('sha256').update(raw).digest('hex') };
}
function applicable(rule, plan, task, files) {
  if (plan.tier === 'light' && !rule.includeLight) return false;
  const when = rule.when ?? {};
  const normalized = ` ${task.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `;
  return (!when.stages || when.stages.includes(plan.playbook))
    && (!when.taskTerms || when.taskTerms.some(term => normalized.includes(
      ` ${term.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `)))
    && (!when.paths || files.some(file => when.paths.some(prefix =>
      file === prefix || file.startsWith(`${prefix}/`))));
}
export function withTeamPolicy(plan, repo, task, files) {
  const loaded = readPolicy(repo);
  const rules = loaded?.policy.rules.filter(rule => applicable(rule, plan, task, files)) ?? [];
  return { ...plan, teamPolicy: { source: loaded ? '.proofwork.json' : null, digest: loaded?.digest ?? null,
    mode: isReadOnlyTask(task) ? 'review-only' : 'apply', rules: structuredClone(rules) } };
}
