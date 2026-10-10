---
name: tdd-95
description: When implementing executable behavior test-first with separate line and branch coverage gates.
---

# TDD with a 95% gate

Protect the real contract with the smallest effective suite. Require at least **95% line coverage and 95% branch coverage** of the independently selected first-party executable target, retaining stricter aggregate/per-file gates. Coverage measures execution; assertions must detect wrong behavior.

## Establish target and baseline

Inspect affected callers, configuration, collector, CI and exclusions. Select the task's application/package/module before measuring, not only convenient functions. Independently enumerate executable source, including files tests never import, and record metric definitions and thresholds. Keep before/after denominators comparable.

Exclude generated/vendor/fixture/non-executable material only for documented reasons. Do not hide live code, error paths or branches with ignores, target changes or weaker metrics. Justified dead-code deletion requires consumer checks and a disclosed inventory/denominator update.

Measure current test outcomes, coverage, elapsed time and expensive setup. A legacy target below 95% remains below gate: improve relevant work within authority and expose remaining gaps rather than silently lowering requirements or rewriting unrelated systems. Missing reports or unsupported branch collection leave the gate unverified.

Load [coverage and CI](references/coverage-and-ci.md) for collection/enforcement, [test economy](references/test-economy.md) for consolidation, and [independent oracles](references/oracles-and-properties.md) for shared expectations, weak generated assertions or lost detectors.

## Red, green, refactor

Write a focused test of the next observable behavior and run it. Establish the intended unmet assertion rather than a broken import, fixture or dependency; an absent interface can explain an initial failure but does not establish the behavior assertion.

Implement the smallest correct change, run affected checks, then refactor with protection intact. Add meaningful boundaries, invalid inputs, cleanup, cancellation, authorization and persistence failures where relevant. Explicit domain decisions and owned effect seams avoid repeatedly booting the application for pure cases.

For bugs, demonstrate failure against old behavior and success after repair. For test-only consolidation, demonstrate retained fault detection without manufacturing production changes for a red phase.

## Remove repetition without removing protection

Map cases to behaviors/failure modes before deleting tests. Shared executed lines do not imply duplicate contracts. Consolidate genuine semantic duplicates or parameterize independently reported variants; distinguish case count from test functions/files.

Reuse expensive immutable setup only where supported. Isolate mutable state and effects, keeping fresh fixtures when reset cannot preserve independence. Avoid assertion chains whose first failure suppresses remaining cases. Retain distinct boundary, failure, integration and public-contract detectors even when coverage does not increase. Fix flaky causes rather than deleting tests or hiding failures with retries.

## Verify both evidence and economy

Run the final suite and full selected target. Require exact aggregate line and branch ratios separately; rounded displays or blended scores cannot satisfy the gate. Re-run after final source/configuration edits. Verify CI invokes enforcement and propagates failure. Use bundled `scripts/check-coverage.mjs` with actual normalized collector data and independent inventory where needed.

Confirm expected cases and effective assertions execute: empty bodies, caught failures, unawaited checks, skips and missing discovery can produce false green. Compare timings and functions/cases under the same environment and source set. Use targeted fault injection when consolidation threatens a unique detector, not an incidental full mutation campaign.

Return red/green evidence, actual coverage counts/percentages, exclusions, consolidation rationale, timings and unresolved gaps. Completion requires passing behavior and coverage checks, not authored configuration.
