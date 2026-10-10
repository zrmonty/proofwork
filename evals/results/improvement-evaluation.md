# Improvement-plan evaluation — 2026-10-10

This records executed evidence for Proofwork 0.17.0 and the remaining gates. It does not establish that Proofwork improves agent quality or application performance.

## Initial guidance measurement

The identical prompt, “Fix the parser bug”, with `src/parser.ts`, was routed against the previous committed source (0.16.1) and current source. Word counts include the root entry and selected skill entries, using nonempty whitespace-separated words.

| Source | Initial words | Route |
| --- | ---: | --- |
| 0.16.1 | 7,036 | bug-fix with shared discipline, TypeScript and TDD |
| 0.17.0 | 2,534 | standard bug-fix with the same substantive skill categories |

This is 4,502 fewer initial words, approximately 64%. Detailed procedures remain conditional references and add context when loaded. This measurement is neither model-token savings nor proof of unchanged agent effectiveness. The current corpus has 70 exact routing cases and enforces light ≤800 / standard ≤4,000 initial words; the aggregate baseline is 162,098 words, with a 10% growth guard.

## Real Codex pilot

The runner used Codex CLI 0.150.1 with the previously authorized per-invocation gpt-5.6-sol model. User configuration and rules were ignored for that subprocess, plugins/skill-search/hooks were disabled, and workspace-write was requested. Default user settings, credentials and account configuration were not changed.

Both processes returned exit zero, but their final reports stated that shell access was blocked and their workspace was read-only. Independent inspection found no changed files and failing original/hidden behavior. Both preserved-contract regression checks still passed: zero introduced regressions, despite the unresolved requested behavior. Exit zero therefore did not establish task completion. The reports accurately disclosed their lack of implementation and verification.

| Arm | Task / attempts | Usable completed runs | Wall time | CLI reported input / output tokens | Files changed | Observation |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Bare | last-page / 1 | 0 | 21.00 s | 64,988 / 705 | 0 | Host blocked execution; fixture remained unfixed |
| Proofwork | last-page / 1 | 0 | 29.36 s | 120,426 / 899 | 0 | Same host limitation; fixture remained unfixed |
| Local reference profile | Not attempted | — | — | — | — | No valid comparison possible after the host failure |

Token values are the CLI's turn-completed usage fields, including its reported cached-input accounting; they are not a billing estimate or the size of skill instructions. Host/system context may contaminate arm separation, which was not certified. Raw outputs and prompts remain ignored local artifacts.

The required full experiment—eight tasks, three arms, three repetitions each—has **not been completed**. Running the remaining 70 attempts under the same restriction would not measure software-engineering quality. The harness is ready for a supported, isolated runner; the local reference profile stays outside the repository and no external skill text is bundled.

## Harness checks

Eight original fixtures begin with failing requested behavior. Independent acceptance and passing baseline-regression tests are withheld from each agent workspace, and verification restores original tests rather than trusting edited tests. Fake-runner tests exercise three repetitions per arm, no-op output, contradictory claims, missing metrics, runner failure, local helper files and deleted modules. These prove harness mechanics, not model effectiveness. Withholding is logical, not an operating-system boundary against a hostile same-account process.

## Host and approval gaps

Claude Code 2.1.296 accepts the current package and marketplace manifests. A fresh authentication status reports loggedIn false. Authenticated Claude tasks, native subagent dispatch and goal continuation remain unverified. No credentials were provisioned.

The [review log](../../docs/review-log.md) records independent agent findings and leaves human approval pending. It does not invent a person, signature or approval from automation commit identity.

New atomic guidance is motivated by the actual [counter regression probe](atomics-probe-20261010.md), not by an agent-improvement claim. Further skill expansions should cite a motivating evaluation; repeated text growth is not evidence of better outcomes.
