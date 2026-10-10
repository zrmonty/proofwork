import { readFileSync } from 'node:fs';
import { workflowFor, explicitPlaybook, playbookPlan } from './workflow-routing.mjs';

const rules = JSON.parse(readFileSync(new URL('../shared/routing.json', import.meta.url)));
const testPattern = (pattern, value) => new RegExp(pattern, 'i').test(value);
const matches = (name, task) => testPattern(rules.patterns[name], task);
const hasExtension = (name, files) => files.some(file => testPattern(rules.extensions[name], file));
const docsOnly = files => files.length > 0 && files.every(file => testPattern(rules.extensions.docs, file));
const readonly = task => explicitPlaybook(task)?.id === 'clarify-path' ||
  matches('readOnly', task) || matches('dryRun', task) ||
  /\b(?:read[- ]only|report[- ]only|do not (?:edit|change))\b/i.test(task) ||
  /^\s*how\s+(?:does|do)\b.*\b(?:work|behave|handle|reject|process|flow)\b/i.test(task) ||
  /^\s*why\s+(?:was|is|does|did|were)\b.*\b(?:chosen|introduced|designed|decided|constraint|decision)\b/i.test(task);

function languageChoice(task) {
  if (matches('copyLanguage', task) && !matches('languageFit', task)) return false;
  return matches('languageFit', task) || (matches('choose', task) && matches('languageWords', task));
}
const componentNecessity = task => /\bdo\s+we\s+need\s+(?:an?\s+)?(?:database|service|cache|queue)\b/i.test(task);
const architecture = task => languageChoice(task) || matches('architecture', task) || componentNecessity(task);
const prototypePattern = '\\b(?:prototype|explore (?:options|alternatives)|' +
  'compare (?:approaches|implementations|candidates))\\b';
const prototype = task => testPattern(prototypePattern, task);
const operationalPattern = [
  '\\b(?:staging|release)\\s+readiness\\b', '\\b(?:recovery|rollback)\\s+plans?\\b',
  '\\bplan\\s+(?:recovery|rollback)\\b', '\\b(?:set\\s+up|setup|configure)\\s+observability\\b',
  '\\bobservability\\s+setup\\b', '\\bsecret\\s+rotation\\b', '\\brotate\\s+(?:production\\s+)?secrets\\b',
  '\\bget\\b.{0,120}\\bready\\b.{0,80}\\b(?:host|hosting)\\b',
].join('|');
const operationalPreparation = task => testPattern(operationalPattern, task);
const production = task => !readonly(task) && (matches('production', task) || operationalPreparation(task));
const activePreparation = task => production(task) &&
  /\b(?:prepare|finish|check|plan|configure|rotate|set\s+up|get)\b/i.test(task) &&
  !matches('small', task) && !/\b(?:documentation|docs|guides?)\b/i.test(task);
function security(task) {
  return matches('security', task) || (matches('review', task) && matches('securityToken', task));
}
function playbookFor(task) {
  if (readonly(task)) return 'investigate';
  const explicit = explicitPlaybook(task);
  if (explicit) return explicit.stage;
  if (prototype(task)) return 'prototype';
  const ordinary = rules.ordinary.find(rule => matches(rule.pattern, task));
  if (ordinary) return ordinary.playbook;
  if (matches('brainstorm', task)) return 'brainstorm';
  if (architecture(task)) return 'architecture';
  if (matches('newProject', task) && !matches('approved', task)) return 'brainstorm';
  return production(task) ? 'production-finish' : 'feature';
}
const explicitFull = task => !readonly(task) && explicitPlaybook(task)?.tier === 'full';
function tierFor(task, files) {
  if (explicitFull(task)) return 'full';
  if (security(task) || matches('auditStack', task)) return 'full';
  if (!readonly(task) && matches('fullRisk', task)) return 'full';
  if (activePreparation(task)) return 'standard';
  if (prototype(task) && !readonly(task)) return 'standard';
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
  const skills = readonly(task) ? [] : [...(explicitPlaybook(task)?.skills ?? [])];
  if (playbook === 'prototype') skills.push('explore-options');
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

const tiers = ['light', 'standard', 'full'];
const mechanical = task => matches('small', task) &&
  !matches('behaviorMarkers', task) && !matches('performance', task);

function minimumTier(task, files, playbook) {
  if (explicitFull(task)) return 'full';
  if (security(task) || matches('auditStack', task) || (!readonly(task) && matches('fullRisk', task))) return 'full';
  if (activePreparation(task)) return 'standard';
  const behavioral = ['feature', 'bug-fix', 'refactor'].includes(playbook) ||
    matches('performance', task) || matches('behaviorMarkers', task) || matches('codeRequest', task);
  const executable = hasExtension('executable', files) || matches('codeRequest', task);
  return !readonly(task) && !docsOnly(files) && !mechanical(task) && behavioral && executable
    ? 'standard' : 'light';
}

function recommendationReasons(task, files, recommendation) {
  if (explicitFull(task)) return ['The explicitly requested playbook requires full coordination.'];
  if (security(task)) return ['The task mentions security-sensitive work requiring the full review tier.'];
  if (matches('auditStack', task)) return ['The task requests the combined audit stack requiring the full tier.'];
  if (!readonly(task) && matches('fullRisk', task)) {
    const risk = new RegExp(rules.patterns.fullRisk, 'i').exec(task)[0].toLowerCase();
    return [`The task mentions ${risk}, requiring the full risk tier.`];
  }
  if (activePreparation(task)) return ['The task requests operational preparation requiring production checks.'];
  if (files.length > 2) {
    return [`The supplied scope contains ${files.length} paths, recommending standard coordination.`];
  }
  if (languagesFor(task, files).length > 1) return ['The supplied scope spans multiple language guides.'];
  if (mechanical(task)) {
    return ['The task describes a bounded mechanical edit without matched behavior or risk markers.'];
  }
  if (docsOnly(files) && !matches('review', task)) return ['The supplied paths are documentation-only.'];
  if (recommendation === 'light') {
    return ['The task requests a read-only explanation without matched performance work.'];
  }
  if (matches('performance', task)) return ['The task requests performance work requiring measured verification.'];
  return ['The task requires standard stage guidance rather than a bounded mechanical edit.'];
}

function principleSlugs(task, tier, playbook, skills) {
  if (tier === 'light') return ['proportionate-effort'];
  let pair;
  if (readonly(task) || playbook === 'investigate') pair = ['explain-what-is-proved', 'no-concealment-risk'];
  else if (playbook === 'bug-fix') pair = ['reproduce-before-fix', 'prove-the-journey'];
  else if (playbook === 'architecture') {
    pair = ['earn-the-component', skills.includes('language-fit') ? 'language-fit' : 'smallest-adequate'];
  } else if (playbook === 'production-finish') pair = ['production-artifact-first', 'boundary-discipline'];
  else if (playbook === 'brainstorm') pair = ['intent-stays-with-user', 'smallest-adequate'];
  else if (playbook === 'prototype') pair = ['smallest-adequate', 'earn-the-component'];
  else pair = ['preserve-contracts', 'prove-the-journey'];
  return [...new Set(tier === 'full' ? [...pair, 'sequence-verifiable-units', 'no-concealment-risk'] : pair)];
}

export function explainRoute(task, files = [], requestedTier) {
  const recommendation = route(task, files);
  if (requestedTier !== undefined && !tiers.includes(requestedTier)) {
    throw new Error('requested tier must be light, standard, or full');
  }
  const minimum = minimumTier(task, files, recommendation.playbook);
  const tier = requestedTier === undefined ? recommendation.tier
    : tiers[Math.max(tiers.indexOf(requestedTier), tiers.indexOf(minimum))];
  const skills = selectedSkills(task, files, tier, recommendation.playbook);
  const changesBehavior = !mechanical(task) && (matches('codeRequest', task) || matches('behaviorMarkers', task));
  const executable = hasExtension('executable', files) || matches('codeRequest', task);
  if (tier !== 'light' && !readonly(task) && !docsOnly(files) && executable && changesBehavior &&
    recommendation.playbook === 'review' && !skills.includes('tdd-95')) skills.push('tdd-95');
  const tierReasons = recommendationReasons(task, files, recommendation.tier);
  const constrained = requestedTier !== undefined && tier !== requestedTier;
  if (constrained) tierReasons.push(`The requested ${requestedTier} tier is constrained by the ${minimum} risk floor.`);
  else if (requestedTier !== undefined && tier !== recommendation.tier) {
    tierReasons.push(`The requested ${tier} tier replaces the ${recommendation.tier} recommendation.`);
  }
  const index = JSON.parse(readFileSync(new URL('../shared/principles/index.json', import.meta.url)));
  const principles = principleSlugs(task, tier, recommendation.playbook, skills).map(slug => {
    const entry = index.principles.find(principle => principle.slug === slug);
    if (!entry) throw new Error(`principle missing from index: ${slug}`);
    return entry.skill;
  });
  const procedure = playbookPlan(task, tier, recommendation.playbook, skills);
  return {
    tier, playbook: recommendation.playbook, skills, recommendedTier: recommendation.tier, tierReasons, principles,
    tierOverride: { requested: requestedTier ?? null, applied: tier, minimum, constrained },
    procedure,
    workflow: workflowFor(task, files, tier, recommendation.playbook, procedure.id),
  };
}
