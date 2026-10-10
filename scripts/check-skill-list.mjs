import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function checkDescriptions(skills) {
  const violations = [];
  const phrases = new Map();
  let words = 0;
  for (const { name, description } of skills) {
    const tokens = description.toLowerCase().match(/[a-z]+(?:-[a-z]+)*/g) ?? [];
    words += description.split(/\s+/u).filter(Boolean).length;
    if (!/^(For|When) /u.test(description) || tokens.length > 14 || !/^[^.!?]+[.]$/u.test(description)) {
      violations.push(`${name}: description must be one trigger sentence of at most 14 words`);
    }
    // shortcut: lexical collisions only; intent overlap still requires editorial review.
    for (let index = 0; index + 2 < tokens.length; index++) {
      const phrase = tokens.slice(index, index + 3).join(' ');
      const owner = phrases.get(phrase);
      if (owner && owner !== name) violations.push(`${owner}/${name}: overlapping trigger phrase "${phrase}"`);
      phrases.set(phrase, name);
    }
  }
  return { words, violations, passed: violations.length === 0 };
}

export function skillListing(repo) {
  const root = path.join(repo, 'shared/skills');
  const skills = readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => {
    const content = readFileSync(path.join(root, entry.name, 'SKILL.md'), 'utf8');
    return { name: entry.name, description: /^description: (.*)$/m.exec(content)?.[1] ?? '' };
  });
  return { skills: skills.length, ...checkDescriptions(skills) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = skillListing(path.resolve(process.argv[2] ?? '.'));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.passed ? 0 : 1;
}
