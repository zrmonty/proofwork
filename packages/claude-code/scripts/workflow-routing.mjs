const matches = (pattern, task) => pattern.test(task);
const readonly = task => matches(/^\s*(?:explain|describe|summari[sz]e|how|why|which|what)\b/i, task) ||
  matches(/\b(?:report[- ]only|read[- ]only|dry[- ]run|do not (?:edit|change))\b/i, task);
const docsOnly = files => files.length > 0 && files.every(file => /\.(?:md|txt|rst|adoc)$/i.test(file));
const mechanical = task => /\b(?:typo|spelling|rename)\b/i.test(task) &&
  !/\b(?:behavior|behaviour|logic|validation|handling|migration)\b/i.test(task);
const pureCopy = task => /\b(?:write|revise|rewrite|edit|polish)\b.*\b(?:copy|labels?|wording|headings?)\b/i.test(task);
const proseWork = task => pureCopy(task) ||
  /\b(?:write|revise|rewrite|edit|polish)\b.*\b(?:docs|documentation|comments?|prose)\b/i.test(task);
const newProject = task => /\bnew\s+(?:project|app|product|website)\b/i.test(task);
const traceRequest = task => /\btrace[- ]path\b/i.test(task) ||
  /\btrace\b.*\b(?:flow|path|request|checkout|handlers?|behavior|behaviour)\b/i.test(task) ||
  /^\s*how\s+(?:does|do)\b.*\b(?:parser|system|code|module|function|request|checkout|app)\b/i.test(task);
const originRequest = task =>
  /\b(?:origin[- ]check|rationale|earlier constraint)\b/i.test(task) ||
  /\b(?:history|historical)\b.*\b(?:code|git|commits?|constraints?|decisions?|implementation)\b/i.test(task) ||
  /\b(?:code|git|commits?|constraints?|decisions?)\b.*\bhistory\b/i.test(task) ||
  /\bwhy\b.*\b(?:chosen|introduced|designed|decided|constraint|decision)\b/i.test(task);
const impactRequest = task => /\b(?:impact[- ]map|blast radius|affected callers|shared contracts?)\b/i.test(task) ||
  /\b(?:assess|trace|map|review)\b.*\bimpact\b/i.test(task);
const crossBoundary = task =>
  /\b(?:cross[- ]boundary|across (?:service )?boundaries|api contracts?|schema migration)\b/i
  .test(task);
const probeRequest = task => /\b(?:probe[- ]first|throwaway|runnable probe|uncertain(?:ty)?)\b/i.test(task) ||
  /\b(?:probe|sketch)\b.*\b(?:settle|uncertainty|unknown|hypothesis)\b/i.test(task);
const arenaRequest = task => /\b(?:option[- ]arena|parallel candidates)\b/i.test(task) ||
  (/\barena\b/i.test(task) && /\b(?:compare|evaluate|compete)\b/i.test(task) &&
    /\b(?:implementation|candidate|approach)s?\b/i.test(task));
const measuredWork = task => /\b(?:optimi[sz](?:e|ation)|performance|faster|latency|throughput)\b/i.test(task) &&
  /\b(?:measure(?:d|ment)?|baseline|benchmarks?|profil(?:e|ing)|target|p95|p99)\b/i.test(task);
const novelProcedure = task => /\b(?:procedure[- ]draft|procedure|workflow)\b/i.test(task) &&
  /\b(?:novel|unmatched|no existing workflow|no adequate (?:procedure|workflow))\b/i.test(task);
const explicitChallenge = task => /\b(?:challenge[- ]review|adversarial|multi[- ]angle)\b/i.test(task);
const integratedWork = task => /\b(?:integrated|substantial|combined|release|migration)\b/i.test(task);

export function workflowFor(task, files, tier, playbook) {
  const result = { beforeWork: [], options: [], review: [], report: ['clear-voice', 'evidence-surface'] };
  const readOnly = readonly(task);
  const origin = originRequest(task);
  if (docsOnly(files) || proseWork(task)) result.beforeWork.push('clear-voice');
  const substantive = !docsOnly(files) && !mechanical(task) && !proseWork(task);
  const contextual = substantive && !newProject(task);
  const existingStage = ['feature', 'bug-fix', 'refactor', 'review', 'investigate', 'architecture'].includes(playbook);
  const existingCode = files.some(file => /\.(?:[cm]?[jt]sx?|rs|py|vue|svelte|go|c|cpp|rb)$/i.test(file)) ||
    /\b(?:existing|codebase|repository|repo|callers|source|module|function|handler)\b/i.test(task) ||
    /\b(?:harden|audit)\b.*\b(?:app|application|service|system|code)\b/i.test(task) ||
    crossBoundary(task) ||
    ['bug-fix', 'refactor', 'review', 'investigate'].includes(playbook);
  if (!(tier === 'light' && origin) &&
    (traceRequest(task) || (tier !== 'light' && contextual && existingStage && existingCode))) {
    result.beforeWork.push('trace-path');
  }
  if (origin) result.beforeWork.push('origin-check');
  const needsImpact = impactRequest(task) || (tier !== 'light' && !readOnly && substantive && crossBoundary(task));
  if (needsImpact) result.beforeWork.push('impact-map');
  if (!readOnly && substantive && probeRequest(task)) result.beforeWork.push('probe-first');
  if (!readOnly && tier !== 'light') {
    if (arenaRequest(task) || playbook === 'prototype') result.options.push('option-arena');
    if (measuredWork(task)) result.options.push('measure-loop');
    if (novelProcedure(task)) result.options.push('procedure-draft');
  }
  if (needsImpact) {
    result.review.push('impact-map');
  }
  if (explicitChallenge(task) || (tier === 'full' && substantive && integratedWork(task))) {
    result.review.push('challenge-review');
  }
  return result;
}
