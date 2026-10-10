---
name: tdd-95
description: "Use for test-first implementation, a 95% coverage gate, or reducing redundant tests while preserving fault detection and independent cases."
---

# TDD with a 95% gate

Build the smallest test suite that protects the real contract. Require at least **95% line coverage and 95% branch coverage** of the selected first-party executable target, while retaining any stricter existing thresholds. Coverage is a floor for execution evidence; assertions must still detect incorrect behavior.

## Establish the target and the baseline

Inspect the requested change, affected callers, test configuration, coverage collector, CI command and existing exclusions. Select the target before measuring: ordinarily the application, package or module the task concerns, not just the functions convenient to exercise. Record its source set, metric definitions and thresholds. Include executable sources that tests never import. Preserve the same denominator for before/after comparisons.

Keep generated code, vendored dependencies, test fixtures and non-executable declarations out only for a documented reason. Do not exclude error paths, add ignore annotations, reduce the target or alter the metric to obtain a passing number. Dead production code may be removed after checking its callers; hiding live code is not removal.

Measure the current suite's outcome, coverage, elapsed time and slow setup. A legacy target below 95% remains below the required gate. Make relevant progress within authorized scope and report the remaining gap; do not silently lower the threshold or start an unrelated rewrite. Unsupported branch collection or absent reports mean the gate is unverified, even if line coverage is 100%.

Read [Coverage and CI](references/coverage-and-ci.md) when configuring measurement or interpreting a report. Read [Test economy](references/test-economy.md) when consolidating cases or improving suite time.

## Test a behavior before implementing it

Write one focused failing test for the next observable behavior. Run it and establish that the failure is the intended unmet assertion, rather than a missing dependency, bad import or broken fixture. An absent interface can explain an initial failure, but reach the behavior assertion before treating the contract as demonstrated.

Implement only what makes that behavior correct, then run the test and affected checks. Refactor with the behavior still protected. Repeat for meaningful alternatives: boundary values, invalid input, resource cleanup, cancellation, authorization or persistence failures when relevant. Keep pure decisions separate from effect adapters so ordinary domain cases do not repeatedly boot the whole application.

For a bug, show the regression fails against the old behavior and passes after the fix. For test-only consolidation, demonstrate preserved detection of relevant faults rather than manufacturing production changes to enact a red phase.

## Consolidate overlapping tests without hiding cases

Map existing tests to behaviors and failure modes before deleting them. Two tests that execute the same lines may protect different contracts. Distinguish cases from test functions and files: parameterization can reduce repetition without reducing the number of independent cases.

Merge true semantic duplicates or express input/output variants as named, independently reported cases. Reuse costly immutable setup where the runner supports it, then isolate each case's mutable state and effects. Keep a fresh fixture when rollback or reset cannot preserve independence. Do not replace several independent tests with one chain whose first failure prevents later checks from running.

Retain boundary, failure and integration cases that protect distinct risks even when they add no coverage percentage. Remove implementation-mirroring assertions when the public contract already detects the fault; retain a direct assertion when removing it would conceal a required guarantee. Fix a flaky test's cause rather than adding retries or deleting it to improve timings.

## Prove both protection and economy

Run the final affected suite and the full selected target with coverage. Require the target's aggregate line ratio and aggregate branch ratio to each meet the gate; a combined line-and-branch score or a rounded display alone is insufficient. Preserve existing stricter per-file gates. Re-run after the final source or configuration change. Verify CI actually invokes the threshold check and propagates its failure. Where the runner lacks separate thresholds, use Proofwork's bundled `scripts/check-coverage.mjs` over a normalized collector report and independently enumerated source inventory, as described in [Coverage and CI](references/coverage-and-ci.md).

Compare before/after under the same runner configuration, source set and environment. Report elapsed time, repeated measurements when meaningful, test functions and independent cases separately. A shorter suite is a useful result only if behavior protection remains. Use a small fault-injection check or targeted mutation run when deletion could remove a unique detector; avoid adding a costly full mutation campaign to a trivial change.

Deliver the behavior changes, observed red/green evidence, coverage counts and percentages, exclusions, consolidation rationale, suite timings and unresolved gaps. State which faults were exercised and which were not. The workflow is complete only when the required gate and relevant behavior checks pass; authored instructions or an unexecuted CI configuration do not constitute a passing gate.
