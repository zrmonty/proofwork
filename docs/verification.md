# Proofwork 0.19.0 verification

October 10, 2026. This matrix describes current evidence and its limits. Earlier release observations are preserved in [verification history](../CHANGELOG.md).

| Surface | Evidence | Limits |
| --- | --- | --- |
| Node 24.16.0 on Windows | `npm run check` runs router, runtime and packaging tests, source-width and separate 95% line/branch gates from actual V8 LCOV | Independent inventory covers canonical `scripts/*.mjs`, not instructional Markdown, generated packages or the comparative harness |
| Routing/context | 23 distinct trigger descriptions; all 600-word entries/800-word references; 82 exact routing cases; light at most 800 initial words, standard at most 4,000; aggregate growth limited to 10% | Conditional references and task/model tokens are additional |
| Codex and Claude package builds | Isolated version equality, skill parity and broken-reference rejection | Structural packaging does not prove task quality or live host behavior |
| Run-state evidence | Actual exits, duration and stream digests; current filesystem/Git identity; manual claims require override; killed-process stale-lock recovery tested | A successful command can prove the wrong criterion. Local coordination is not an authentication boundary |
| Installed Codex 0.19.0 | CLI installation succeeded; all 158 package files match the rebuilt source; installed routing returned the renamed skills | Installation and tool execution do not establish fresh-session model execution or automatic goal continuation |
| Rust 1.95.0/MSVC | Counter probe fails on split load/store, passes after fetch_add in debug/release; formatting and Clippy pass | No weak-memory proof, unsafe reclamation, Loom/Miri, cross-target or benchmark claim. See [probe](../evals/results/atomics-probe-20261010.md) |
| Codex CLI 0.150.1 | Bounded comparative pilot outcome in [evaluation report](../evals/results/improvement-evaluation.md) | An interrupted pilot cannot establish relative agent quality |
| Claude Code 2.1.296 | Prior strict validation and isolated installation; fresh auth status reports loggedIn false | Authenticated execution, subagent dispatch and goal continuation remain unverified |
| Human approval | [Review log](review-log.md) separates agent review from human approval | No human approval or signing identity invented |

Reproduce local checks with `npm run check`. Run the comparative suite using the [harness](../evals/ab/README.md), with a locally reviewed runner configuration. Export only sanitized aggregates. Fixture checks do not establish production security, visual appeal, goal continuation or real-application performance.

Current listing/content budgets, exact coverage counts and package verification are recorded in [candidate evidence](../evals/results/package-efficiency-20261010.json). Earlier [0.18 conditional-routing evidence](../evals/results/conditional-functional-20261010.json) remains historical. Earlier [0.17.0 evidence](../evals/results/improvement-checks.json) remains historical. Coverage describes instrumented executable checks, not instructional quality.
