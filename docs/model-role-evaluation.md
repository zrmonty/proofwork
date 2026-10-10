# Measuring model-role value

This is a reproducible protocol, not an improvement claim. Compare identical Proofwork instructions with single-model execution against configured role execution. A bare-versus-Proofwork comparison answers a different question because its instructions change too. Current public evidence has no usable completed live model-role comparison: the [Codex pilot](../evals/results/improvement-evaluation.md) lacked writable execution, and the [Claude attempt](../evals/results/native-claude-turn-20261010.json) failed authentication before a model response. Fake runners verify harness mechanics only.

## Freeze and pilot

Record repository revision, package/host versions, fixture and acceptance identities, selected skills/references, runner configuration digest and authority boundaries. Keep credentials and raw transcripts local. Use the same task, initial source, tools, time limit and acceptance in both conditions.

- **Single:** one specified model and reasoning setting handles implementation, alternatives and review.
- **Roles:** use the same workflow with explicit role mappings and a fixed dispatch/time/spend cap. Record actual host-supported execution, not just requested labels.

Hold the base implementation model constant where possible. If reasoning budgets or total spend differ, identify those as confounders; the result measures the complete configured package rather than model diversity alone. Do not force panels onto light tasks just to increase dispatch count.

Run a bounded paired pilot before the full suite. A permission/authentication failure is a feasibility result, not evidence of inferior engineering. Stop and repair isolation/execution prerequisites before spending on repeated blocked attempts. Do not provision credentials or change defaults as part of an evaluation without authority.

## Repeated paired tasks

The [existing harness](../evals/ab/README.md) provides nine executable fixtures: `last-page`, `chunks`, `pricing`, `safe-path`, `theme-control`, `retry-policy`, `measurement` `patch-presence` and `release-config`. Freeze their original visible, hidden acceptance and baseline regression checks. Run at least three repetitions per task and condition in separate output roots, alternating condition order per pair. Both conditions use the harness's `proofwork` arm with different local runner configs. Set optional `modelPlanPath` to a saved planner result: all-inherit for single-model, configured roles for the other condition. The harness validates five resolved roles, no missing capabilities and bounded advisory budgets; it injects requested policy without dispatching. There is no dedicated model-role arm or seed flag.

Record provider sampling parameters and seed if exposed; otherwise mark them unavailable. Fresh workspaces and sessions prevent candidate/history leakage. Disable unintended installed guidance in both arms and record remaining host context. Hidden tests are logically withheld, not protected from a hostile same-account process. Mark suspected oracle access or contamination invalid, preserving its count and reason.

Give graders anonymized candidates and the same criteria, without role/model identities or author claims. First run restored original checks in independent verification directories. Then review predefined properties that tests do not establish: contract preservation, failure recovery, unnecessary components, exposure and evidence honesty. Different-model agreement is not an acceptance oracle. Reconcile grader disagreements against artifacts; retain unresolved disagreements visibly.

## Realistic extensions

These cases are proposed manual extensions, not tasks accepted by the current nine-fixture CLI. Freeze supplied facts and grading criteria before executing them.

| Plain outcome prompt | Fixed acceptance and expected artifacts |
|---|---|
| “I want an app to track my invoices.” | Provide the same owner, hosting and workload answers when asked. Expect newcomer brainstorming followed by a bounded verified save/retrieve slice; require input preservation, totals correctness and explicit gaps. Measure unnecessary questions, technique names required from the user and unauthorized effects. |
| “Do we need a database service, cache and queue for this invoice tracker?” | Use the same single-server topology, overlapping-write fixture and recovery targets. Expect an incumbent/simpler/managed comparison with component dispositions, measured deciding constraints and a reopening condition; no migrations without authority. |
| “Get this invoice app ready for its image-based host.” | Supply isolated credentials/data and packaging-only authority. Expect artifact identity, exposure inspection, restart/restore checks and distinct local/staging/live states. Live promotion remains pending; claiming it occurred fails evidence honesty. |

Use the [operational scenarios](operational-scenarios.md) for reproducible checks. They contain illustrative procedures, not observed outcomes. Add frozen fixtures and independent acceptance before incorporating extensions into an automated success-rate headline.

## Measure and report

Report all attempted, completed, invalid and blocked rows by condition and task. Predeclare success as independent acceptance plus original tests and no newly failed baseline checks. Report unresolved defects separately from introduced regressions: a no-op can introduce zero regressions while failing the task. Defect rate needs a stated unit and denominator, such as completed artifacts with an independently confirmed material defect divided by completed artifacts reviewed. Include a fixed follow-up review window if delayed defects count.

Report paired success and rubric differences, variation and sample size. Small repeated fixtures cannot establish broad production-quality gains. Include runner elapsed time and its distribution. Time-to-first-verified-slice requires an independently observed acceptance timestamp relative to task start; final runner time is only a proxy and currently excludes post-run grading. Include total verification time separately.

Runner metadata supports `requestedModelId`, `actualModelId`, and `modelRoles` records with `role`, `requested: {model, reasoning}` and `observed: {model, reasoning}`. Invalid/missing observations remain null; normalized records identify their runner-reported source. It also accepts finite nonnegative `costUsd`, labeled runner-reported when valid. Record fallbacks, calls, budget observations and provider receipts beside each row. Costs require dated rates and cached-token accounting; reported costs are not independently verified billing. Missing identities, usage or prices remain `null`/unknown, not zero. Publish sanitized aggregates and reviewed artifact references, never secret-bearing output, account identifiers or private paths.

| Reporting field | Expected before execution | Observed afterward |
|---|---|---|
| Conditions/tasks | Frozen single/roles mappings; identical task IDs | Actual models/fallbacks; completed, invalid and blocked counts |
| Quality | Fixed acceptance and blind-review rubric | Passes, unresolved defects, introduced regressions and disagreements |
| Time | Time limit and slice criterion | Runner time, verification time, verified-slice time or unknown |
| Cost | Dispatch/spend cap | Observed tokens/cost with source, or unknown |
| Conclusion | Hypothesis: role specialization may improve risky decisions | Measured paired result with limits; no conclusion before usable pairs |

An honest first report may say “comparison blocked; no quality difference measured.” Keep that finding in the self-audit trail rather than replacing it with a projected gain.
