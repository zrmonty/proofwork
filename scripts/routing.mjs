const core = ['worker-mode','functional-programming','data-driven-development','clean-code'];
const taskRoutes = [
  ['review', /\b(review|audit)\b/i],
  ['bug-fix', /\b(fix|bug|regression|broken)\b/i],
  ['refactor', /\b(refactor|simplify|restructure)\b/i],
  ['investigate', /\b(investigate|diagnose|explain|research)\b/i],
];
function ordinaryPlaybook(task) {
  return taskRoutes.find(([, pattern]) => pattern.test(task))?.[0] ?? 'feature';
}
const languageChoices = /\b(?:programming languages?|languages?|runtimes?|frameworks?|fullstack|full.stack|rust|python|typescript|javascript|react|vue|svelte|angular|astro|solid|go|java|kotlin|elixir|ruby|php|zig|csharp|dotnet)\b|c\+\+|c#|\.net|\bC\b/i;
function languageChoiceIntent(task) {
  if (/\b(?:which|what)\s+language\b.*\b(?:labels?|copy|wording|translation)\b/i.test(task) && !/\blanguage[- ]fit\b/i.test(task)) return false;
  return /\blanguage[- ]fit\b/i.test(task) || ((/\b(?:which|what|choose|select|compare|recommend|decide)\b/i.test(task) || /\bshould\b.*\b(?:use|choose)\b/i.test(task)) && languageChoices.test(task));
}
function architectureIntent(task) {
  if (languageChoiceIntent(task)) return true;
  return /\b(architect(?:ure|ing)?|overengineering|stack)\b/i.test(task) || /\b(which|what|choose|select|compare|recommend|decide)\b.*\b(database|storage|tools?|technolog(?:y|ies)|sqlite|postgres(?:ql)?)\b/i.test(task) || /\bshould\b.*\b(use|choose)\b.*\b(database|storage|sqlite|postgres(?:ql)?)\b/i.test(task);
}
function productionIntent(task) {
  return /\b(production[- ](?:finish|ready|readiness)|deployment|deploy|hosting|docker|containeri[sz](?:e|ation))\b/i.test(task) || /\b(finish|prepare|ready)\b.*\b(production|prod|release)\b/i.test(task) || /\b(finish|prepare)\s+(?:(?:this|the|our|my|an|a)\s+)?(?:app|application)\b/i.test(task);
}
function newProjectIntent(task) {
  return /\bnew\s+(?:project|app|application|website|product)\b/i.test(task) && !/\bapproved\s+(?:design|plan|spec(?:ification)?)\b/i.test(task);
}
function selectPlaybook(task) {
  const ordinary = ordinaryPlaybook(task);
  if (ordinary !== 'feature') return ordinary;
  if (/\b(brainstorm(?:ing)?|ideat(?:e|ion))\b|\bexplore\s+(?:an?\s+)?idea\b/i.test(task)) return 'brainstorm';
  if (architectureIntent(task)) return 'architecture';
  if (newProjectIntent(task)) return 'brainstorm';
  if (productionIntent(task)) return 'production-finish';
  return ordinary;
}

function auditSkills(task) {
  const skills = [];
  if (/\baudit[- ]stack\b/i.test(task)) skills.push('audit-stack','security-hardening','dead-code-audit','dry-audit','performance-increase','tdd-95','architecture-fit','thermo-nuclear-code-quality-review');
  if (/\bdry[- ]audit\b|\b(?:duplicate|duplicated|duplication of)\s+(?:code|domain rules?|validation|logic|calculations?|implementations?)\b/i.test(task)) skills.push('dry-audit');
  if (/\bdead[- ]code\b|\b(?:unused|unreachable|obsolete)\s+(?:code|functions?|exports?|modules?|dependencies|tests?)\b|\borphaned\s+(?:tests?|fixtures?)\b/i.test(task)) skills.push('dead-code-audit');
  if (/\b(harden(?:ing)?|vulnerabilit(?:y|ies)|ssrf|xss|csrf)\b|\bsecurity\s+(?:audit|review|hardening|scan)\b|\b(?:authorization|authentication|auth)\s+bypass\b|\b(?:sql|command|code)\s+injection\b|\b(?:exposed|leaked)\s+(?:credentials?|secrets?|keys?)\b/i.test(task)) skills.push('security-hardening');
  return skills;
}

function qualitySkills(task, files, playbook) {
  const skills = [];
  if ((['feature','bug-fix','refactor'].includes(playbook) && (files.some(file => /\.(?:tsx?|mts|cts|jsx?|mjs|cjs|rs|pyi?)$/i.test(file)) || /\b(implement|build|fix|bug|refactor|code)\b/i.test(task))) || /\b(tdd|coverage|tests?)\b/i.test(task)) skills.push('tdd-95');
  if (/\b(performance|benchmarks?|profil(?:e|ing)|latency|throughput|allocations?|faster|slow|optimi[sz](?:e|ation|ing))\b|\bspeed\s+up\b/i.test(task)) skills.push('performance-increase');
  return skills;
}

function languageSkills(task, files) {
  const skills = [];
  if (files.some(file => /\.(?:tsx?|mts|cts)$/i.test(file)) || /\b(typescript|tsx)\b/i.test(task)) skills.push('typescript-best-practices');
  if (files.some(file => /\.rs$/i.test(file)) || /\brust\b/i.test(task)) skills.push('rust-best-practices');
  if (files.some(file => /\.pyi?$/i.test(file)) || /\bpython\b/i.test(task)) skills.push('python-best-practices');
  return skills;
}

function experienceSkills(task, files) {
  const skills = [];
  if (files.some(file => /\.(?:tsx|jsx|css|scss|html|vue|svelte)$/i.test(file)) || /\b(frontend|front.end|website|layout|browser|visual|interface)\b/i.test(task)) skills.push('frontend-design');
  if (skills.includes('frontend-design') || /\b(humani[sz](?:e|er|ing|ation)|microcopy|ux writing|empty[- ]states?)\b/i.test(task) || (/\b(copy|wording|labels?|messages?|tone|headings?|footer|header)\b/i.test(task) && /\b(app|application|page|screen|ui)\b/i.test(task)) || (/\b(buttons?|forms?|notifications?|onboarding|confirmations?|navigation)\b/i.test(task) && /\b(copy|wording|labels?|text|messages?)\b/i.test(task))) skills.push('humanizer');
  return skills;
}

function deliverySkills(task, playbook) {
  const skills = [];
  if (playbook === 'review' || playbook === 'refactor') skills.push('thermo-nuclear-code-quality-review');
  if (/\b(commit|push|github|shipping)\b/i.test(task)) skills.push('commit-features');
  return skills;
}

function domainSkills(task) {
  const skills = [];
  if (architectureIntent(task)) skills.push('architecture-fit');
  if (languageChoiceIntent(task) || /\barchitect(?:ure|ing)?\b/i.test(task)) skills.push('language-fit');
  if (productionIntent(task)) skills.push('production-finish');
  return skills;
}
function stageSkills(playbook) {
  return { brainstorm: ['brainstorm'], architecture: ['architecture-fit'], 'production-finish': ['production-finish'] }[playbook] ?? [];
}
export function route(task, files = []) {
  if (typeof task !== 'string' || !task.trim()) throw new Error('task must be nonempty text');
  const playbook = selectPlaybook(task);
  const skills = [...core, ...stageSkills(playbook), ...domainSkills(task), ...auditSkills(task), ...qualitySkills(task, files, playbook),
    ...languageSkills(task, files), ...experienceSkills(task, files), ...deliverySkills(task, playbook)];
  return { playbook, skills: [...new Set(skills)] };
}
