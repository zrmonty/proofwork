# Required functional naming verification

Date: 2026-10-10. Version: 0.16.1. Scope: functional-programming skill instructions and specification; no runtime behavior or public application API changed.

Clear domain naming is now mandatory for changed functions, parameters, bindings, types, fields, events and effect requests. Names must distinguish calculations/proposals from commits/execution/observations, relevant lifecycle states, units and absolute-versus-delta intent. Vague placeholders and unexplained abbreviations fail where they conceal responsibility. Contextually clear concise names remain acceptable; this is not a word blacklist. Genuine uncertainty remains truthfully named. Internal renames must update callers; public/wire/persisted contracts need authorized compatibility handling.

The specification adds acceptance cases for a misleading sendDelivery proposal name, ambiguous quantity/delta/time units and uncertain delivery observations. These are authored scenarios, not an executed agent evaluation. Naming defects block affected completion until resolved or explicitly reported as an unresolved compatibility/scope constraint.

Executed: npm run check passed all 56 tests, both twenty-three-skill builds and the 500-line file check over 25 default discovered files. Changed skill validator and strict Claude plugin validation passed; the latter retained informational marketplace-install README advice. Version 0.16.1 was installed in Codex. All 103 canonical skill/reference files matched both generated packages and the installed copy byte-for-byte.

No automated naming linter, style-word tests, repository-wide naming refactor or host behavioral evaluation was added or performed. The requirement is enforced through the skill's changed-code and call-site review, not a claim of mechanical ambiguity detection.
