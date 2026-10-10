# Proofwork 0.23.1 verification

October 10, 2026. This matrix describes current evidence and its limits. Earlier release observations are preserved in [verification history](../CHANGELOG.md).

| Surface | Evidence | Limits |
| --- | --- | --- |
| Node 24.16.0 on Windows | `npm run check` runs router, runtime and packaging tests, source-width and separate 95% line/branch gates from actual V8 LCOV | Independent inventory covers canonical `scripts/*.mjs`, not instructional Markdown, generated packages or the comparative harness |
| Routing/context | 23 distinct trigger descriptions; all 600-word entries/800-word references; 92 exact routing cases; light at most 800 initial words, standard at most 4,000; aggregate growth limited to 10% | Conditional references and task/model tokens are additional |
| Codex and Claude package builds | Isolated version equality, skill parity and broken-reference rejection | Structural packaging does not prove task quality or live host behavior |
| Run-state evidence | Actual exits, duration and stream digests; current filesystem/Git identity; manual claims require override; killed-process stale-lock recovery tested | A successful command can prove the wrong criterion. Local coordination is not an authentication boundary |
| Installed Codex 0.23.1 | Standard hook-free CLI installation succeeded | Hook-enabled Codex installation and native event dispatch remain unverified |
| Rust atomic counter, 1.95.0/MSVC | Counter probe fails on split load/store, passes after fetch_add in debug/release; formatting and Clippy pass | Counter probe has no weak-memory proof, unsafe reclamation, Loom/Miri, cross-target or benchmark claim. See [probe](../evals/results/atomics-probe-20261010.md) |
| Codex CLI 0.150.1 | Bounded comparative pilot outcome in [evaluation report](../evals/results/improvement-evaluation.md) | An interrupted pilot cannot establish relative agent quality |
| Claude Code 2.1.296 | Exact optional handlers dispatched SessionStart and UserPromptSubmit; prompt hint advertises automatic init binding. See [native turn](../evals/results/native-claude-turn-20261010.json) | Authentication failed before a model response; native Stop blocking, subagents and goal continuation remain unverified. Earlier recovery smoke used a temporary binding wrapper |
| Rust reservation / Tokio / Miri | Committed reservation: 8 tests pass in debug/release. Async: 3 pass, intentional broken framing test fails BC vs AB. Miri rejects uninitialized bytes and passes initialized repair; see [fixture evidence](../evals/results/rust-executed-fixtures-20261010.json) | Controlled interleavings; no database/crash-recovery or networking/shutdown proof. Miri uses nightly 2026-10-10 with Linux interpreted target; no general soundness or Rust coverage claim |
| Human approval | [Review log](review-log.md) separates agent review from human approval | No human approval or signing identity invented |

Reproduce local checks with `npm run check`. Run the comparative suite using the [harness](../evals/ab/README.md), with a locally reviewed runner configuration. Export only sanitized aggregates. Fixture checks do not establish production security, visual appeal, goal continuation or real-application performance.

Current [evidence-hardening checks](../evals/results/evidence-hardening-20261010.json) record 17-script coverage: 1,759/1,782 lines (98.71%) and 998/1,025 branches (97.37%). Earlier [hook-fix evidence](../evals/results/lifecycle-hook-fixes-20261010.json), [hook evidence](../evals/results/lifecycle-hooks-20261010.json), [0.19 candidate evidence](../evals/results/package-efficiency-20261010.json), [0.18 conditional-routing evidence](../evals/results/conditional-functional-20261010.json) and [0.17.0 evidence](../evals/results/improvement-checks.json) remain historical. Coverage describes instrumented executable checks, not instructional quality.
