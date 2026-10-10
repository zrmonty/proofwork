import { readFileSync } from 'node:fs';

const rules = JSON.parse(readFileSync(new URL('../shared/routing.json', import.meta.url)));
const testPattern = (pattern, value) => new RegExp(pattern, 'i').test(value);
const matches = (name, task) => testPattern(rules.patterns[name], task);
const hasExtension = (name, files) => files.some(file => testPattern(rules.extensions[name], file));
const docsOnly = files => files.length > 0 && files.every(file => testPattern(rules.extensions.docs, file));
const readonly = task => matches('readOnly', task) || matches('dryRun', task);

function languageChoice(task) {
  if (matches('copyLanguage', task) && !matches('languageFit', task)) return false;
  return matches('languageFit', task) || (matches('choose', task) && matches('languageWords', task));
}
const architecture = task => languageChoice(task) || matches('architecture', task);
const production = task => !matches('dryRun', task) && matches('production', task);
function security(task) {
  return matches('security', task) || (matches('review', task) && matches('securityToken', task));
}
function playbookFor(task) {
  if (readonly(task)) return 'investigate';
  const ordinary = rules.ordinary.find(rule => matches(rule.pattern, task));
  if (ordinary) return ordinary.playbook;
  if (matches('brainstorm', task)) return 'brainstorm';
  if (architecture(task)) return 'architecture';
  if (matches('newProject', task) && !matches('approved', task)) return 'brainstorm';
  return production(task) ? 'production-finish' : 'feature';
}
function tierFor(task, files) {
  if (security(task) || matches('auditStack', task)) return 'full';
  if (!readonly(task) && matches('fullRisk', task)) return 'full';
  if (files.length > 2 || languagesFor(task, files).length > 1) return 'standard';
  const mechanical = matches('small', task) && !matches('behaviorMarkers', task) && !matches('performance', task);
  if (mechanical || (docsOnly(files) && !matches('review', task))) return 'light';
  if (readonly(task) && !matches('performance', task) && !matches('dryRun', task)) return 'light';
  return 'standard';
}
function languagesFor(task, files) {
  if (docsOnly(files)) return [];
  const affected = rules.extensions.languages.filter(rule => files.some(file => testPattern(rule.files, file)));
  const selected = affected.length ? affected
    : rules.extensions.languages.filter(rule => testPattern(rule.keywords, task));
  return selected.map(rule => rule.skill);
}
function domainSkills(task, playbook) {
  const skills = [];
  if (playbook === 'brainstorm') skills.push('brainstorm');
  if (architecture(task) && !readonly(task)) skills.push('architecture-fit');
  if (!readonly(task) && (languageChoice(task) || matches('architect', task))) skills.push('language-fit');
  if (production(task)) skills.push('production-finish');
  return skills;
}
function auditSkills(task) {
  const skills = matches('auditStack', task) ? [...rules.auditStack] : [];
  if (matches('dryAudit', task)) skills.push('dry-audit');
  if (matches('deadCode', task)) skills.push('dead-code-audit');
  if (security(task)) skills.push('security-hardening');
  return skills;
}
function qualitySkills(task, files, playbook) {
  const skills = [];
  const behavior = ['feature', 'bug-fix', 'refactor'].includes(playbook);
  const executable = hasExtension('executable', files) || matches('codeRequest', task);
  const needsTests = (behavior && (executable || matches('tests', task))) || matches('coverage', task);
  if (!docsOnly(files) && !readonly(task) && needsTests) skills.push('tdd-95');
  if (matches('performance', task)) skills.push('performance-increase');
  return skills;
}
function experienceSkills(task, files) {
  const frontend = hasExtension('frontend', files) || matches('frontend', task);
  const skills = frontend ? ['frontend-design', 'humanizer'] : [];
  if (matches('humanizer', task)) skills.push('humanizer');
  return skills;
}
function selectedSkills(task, files, tier, playbook) {
  const languages = languagesFor(task, files);
  if (tier === 'light') return languages;
  const skills = [...rules.core, ...languages, ...domainSkills(task, playbook), ...auditSkills(task),
    ...qualitySkills(task, files, playbook), ...experienceSkills(task, files)];
  const statefulWork = matches('stateful', task) &&
    (!matches('statefulCosmetic', task) || matches('statefulBehavior', task));
  if (!docsOnly(files) && statefulWork) skills.push('functional-programming');
  if (tier === 'full') skills.push('thermo-nuclear-code-quality-review');
  if (matches('commit', task)) skills.push('commit-features');
  return [...new Set(skills)].filter(skill => !docsOnly(files) || skill !== 'tdd-95');
}
export function route(task, files = []) {
  if (typeof task !== 'string' || !task.trim()) throw new Error('task must be nonempty text');
  if (!Array.isArray(files) || files.some(file => typeof file !== 'string')) {
    throw new Error('files must be text paths');
  }
  const playbook = playbookFor(task);
  const tier = tierFor(task, files);
  return { tier, playbook, skills: selectedSkills(task, files, tier, playbook) };
}
