# Proofwork 0.35.0 verification

October 10, 2026. This matrix describes current evidence and its limits. Earlier release observations are preserved in [verification history](../CHANGELOG.md).

| Surface | Evidence | Limits |
| --- | --- | --- |
| Node 24.16.0 on Windows | `npm run check` runs router, runtime and packaging tests, source-width and separate 95% line/branch gates from actual V8 LCOV | Independent inventory covers canonical `scripts/*.mjs`, not instructional Markdown, generated packages or the comparative harness |
| Routing/context | 34 distinct trigger descriptions (305 discovery words); selected decision references and playbook guide counted; all 600-word entries/800-word references; 94 exact routing cases; light at most 800 initial words, standard at most 4,000; aggregate growth limited to 10% | Deferred review/report entries, conditional references and task/model tokens are additional |
| Codex and Claude package builds | Isolated version equality, skill parity and broken-reference rejection | Structural packaging does not prove task quality or live host behavior |
| Run-state evidence | Actual exits, duration and stream digests; current filesystem/Git identity; manual claims require override; killed-process stale-lock recovery tested | A successful command can prove the wrong criterion. Local coordination is not an authentication boundary |
| Installed Codex 0.34.0 | Standard hook-free CLI installation succeeded | Hook-enabled Codex installation and native event dispatch remain unverified |
| Rust atomic counter, 1.95.0/MSVC | Counter probe fails on split load/store, passes after fetch_add in debug/release; formatting and Clippy pass | Counter probe has no weak-memory proof, unsafe reclamation, Loom/Miri, cross-target or benchmark claim. See [probe](../evals/results/atomics-probe-20261010.md) |
| Codex CLI 0.150.1 | Bounded comparative pilot outcome in [evaluation report](../evals/results/improvement-evaluation.md) | An interrupted pilot cannot establish relative agent quality |
| Claude Code 2.1.296 | Exact optional handlers dispatched SessionStart and UserPromptSubmit; prompt hint advertises automatic init binding. See [native turn](../evals/results/native-claude-turn-20261010.json) | Authentication failed before a model response; native Stop blocking, subagents and goal continuation remain unverified. Earlier recovery smoke used a temporary binding wrapper |
| Rust reservation / Tokio / Miri | Committed reservation: 8 tests pass in debug/release. Async: 3 pass, intentional broken framing test fails BC vs AB. Miri rejects uninitialized bytes and passes initialized repair; see [fixture evidence](../evals/results/rust-executed-fixtures-20261010.json) | Controlled interleavings; no database/crash-recovery or networking/shutdown proof. Miri uses nightly 2026-10-10 with Linux interpreted target; no general soundness or Rust coverage claim |
| Human approval | [Review log](review-log.md) separates agent review from human approval | No human approval or signing identity invented |

Reproduce local checks with `npm run check`. Run the comparative suite using the [harness](../evals/ab/README.md), with a locally reviewed runner configuration. Export only sanitized aggregates. Fixture checks do not establish production security, visual appeal, goal continuation or real-application performance.

Current 0.31 [operator-guidance checks](../evals/results/ops-primitives-20261010.md) pass locally:
2,365/2,397 lines and 1,462/1,503 branches across 20 runtime scripts. [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38086672914)
passes full checks, standard/optional builds and generated parity. New operator-intent routing has executed
regression evidence; application supply-chain audits, drift comparisons, signal delivery and recovery drills
remain obligations for each actual release, not observations established by this plugin verification.


[Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38084811385) passes full checks, both package forms and generated parity. Historical 0.30 [consolidation checks](../evals/results/principle-consolidation-20261010.md) pass locally across 20 canonical scripts: 2,349/2,381 lines and 1,459/1,500 branches. Both packages remove the standalone principle entries; seven conditional references remain. Standard and optional-hook packages build, and Codex 0.30.0 is installed and enabled. No native adherence or comparative quality claim follows from these structural checks.

Historical 0.29 [systems-outcome checks](../evals/results/systems-outcomes-20261010.json) pass locally across 20 canonical scripts:
2,346/2,378 lines (98.65%) and 1,461/1,502 branches (97.27%). The single-invocation Codex installer shows an enabled
0.29.0; Claude installation remains unexecuted. Twelve focused checks cover installer verification/failure behavior,
operational routing, missing/invalid observations, duplicate pairing, example repair and exit-zero eligibility.
The 92-case initial corpus totals 159,484 words (0.75% above 0.28), with 19,022 report/review entry words deferred;
light/standard maxima are 679/2,761. All existing context limits remain. The executed configuration fixture fails its
baseline public/acceptance checks and passes all three after repair. This is local fixture evidence, not deployment.
The two-row native pilot changed no files and lacks valid plugin/tool isolation; user-outcome metrics remain unknown.
[Windows/Linux CI](https://github.com/zrmonty/proofwork/actions/runs/38084090159) passes source checks, standard/optional package builds and generated parity
on 5e58a26. Per-platform coverage and source-byte identities are recorded separately in the evidence file.

Historical 0.28 [integrated-flow checks](../evals/results/integrated-flow-20261010.json) pass across 19 canonical scripts:
2,282/2,311 lines (98.75%) and 1,424/1,464 branches (97.27%). Seven new integration tests exercise shared intent,
read-only decisions, mixed repair, coordinator ownership, resume guidance, stage handoffs and an executed export
criterion through checkpoint, evidence, read-only preflight and completion. Both built host layouts execute seven
representative routes. The same 92-case initial corpus totals 158,304 words, down 6.71% from 0.27; light/standard
maxima are 672/2,754. Another 14,790 entry words are deferred. Required recovery and selected guide costs count
initially; other conditional references and task/model tokens are additional. [Windows/Linux CI](https://github.com/zrmonty/proofwork/actions/runs/38082851449) passes source checks, both standard packages, optional hook builds and generated-package parity
on commit d943842. Ubuntu coverage is 98.70% lines/97.26% branches; Windows CI is recorded separately
in the evidence file. Two earlier failed runs exposed a packaged documentation link added after local checks;
the corrected packaged reference was rebuilt, reinstalled and reverified.

Historical 0.27 [named-playbook checks](../evals/results/named-playbooks-20261010.json) pass across 19 canonical scripts:
2,262/2,291 lines (98.73%) and 1,412/1,450 branches (97.38%). Eight named-playbook tests cover all 13 guides,
explicit full floors, read-only authority, wrapper invocations and compatible stages. Both package layouts execute
a full Coordinated Audit route. The 92-case initial corpus totals 169,692 words; light/standard maxima are 627/2,917.
Another 14,640 entry words are deferred. Guide cost is included; conditional references and task/model tokens are additional.

Historical 0.26 [context-skill checks](../evals/results/context-skills-20261010.json) pass across 19 canonical scripts:
2,213/2,240 lines (98.79%) and 1,362/1,399 branches (97.36%). All 49 descriptions total 380 words.
The 92-scenario initial-context corpus totals 163,019 words; maximum light/standard loads are 578/2,870 words.
Review/report entries add 12,822 deferred words across that corpus. Twelve workflow regressions verify phase placement,
read-only behavior and false-positive exclusions. Worked guides are illustrative; live skill adherence is unverified.

Historical 0.25 [model-role checks](../evals/results/model-roles-20261010.json) pass across 18 canonical scripts:
2,133/2,160 lines (98.75%) and 1,282/1,319 branches (97.19%). Both built host layouts execute explained routing
and read-only role planning. All 39 skill descriptions total 285 words. The 92-scenario initial-context corpus,
including selected principles, totals 168,410 words; maximum light/standard loads are 702/2,902 words.
No usable live multi-model comparison or quality gain is claimed. See the [comparison protocol](model-role-evaluation.md).

Historical 0.24 [snapshot checks](../evals/results/git-snapshot-20261010.json) record 17-script coverage: 1,822/1,849 lines (98.54%) and 1,028/1,062 branches (96.80%). The standalone Windows 20000-ignored-file snapshot fell from 5036 ms to 129 ms, excluding setup. Earlier [evidence-hardening checks](../evals/results/evidence-hardening-20261010.json), [hook-fix evidence](../evals/results/lifecycle-hook-fixes-20261010.json), [hook evidence](../evals/results/lifecycle-hooks-20261010.json), [0.19 candidate evidence](../evals/results/package-efficiency-20261010.json), [0.18 conditional-routing evidence](../evals/results/conditional-functional-20261010.json) and [0.17.0 evidence](../evals/results/improvement-checks.json) remain historical. Coverage describes instrumented executable checks, not instructional quality.

See [first-outcome and recovery evidence](../evals/results/first-outcome-recovery-20261010.md) for the executed export repair and explicit checkpoint recovery, with native-host limits.

See [team-policy verification](../evals/results/team-policy-20261010.md) for repository-local rule selection, unchanged light budgets and enforcement limits.
