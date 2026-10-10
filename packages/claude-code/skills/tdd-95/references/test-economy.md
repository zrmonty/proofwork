# Test economy

Reduce the cost of protecting behaviors, not test count in isolation.

## Map retained guarantees

For affected tests, identify observable guarantees, distinguishing inputs/outcomes, effect boundaries and detected faults. Equivalent positive-input spelling can duplicate coverage; zero boundaries, non-finite rejection, input preservation, permission denial and failed-write state protect distinct failures even when sharing lines.

Retain relevant boundary comparators, failed-effect state assertions, independent-call ownership and negative authorization checks. Add only actual product risks, not a generic checklist.

## Consolidate carefully

1. Delete exact duplicates only after identifying the same fault detector through the same contract.
2. Parameterize true variants with readable names, independent runner results and diagnostic assertions.
3. Share expensive immutable setup where safe. Recreate/reset mutable fixtures with demonstrated isolation; transaction rollback may not reset sequences, files, caches or jobs.
4. Keep deterministic domain checks close to pure functions; retain representative real-adapter/integration checks for wiring. Mock-only suites cannot prove adapters.

Twenty independently reported parameter cases replacing twenty functions reduce repetition, not necessarily execution count/time. A single loop can stop after its first assertion; prefer native cases/subtests. The runner must await async assertions/effects and observe every failure. Never swallow assertions; report safe case characteristics rather than private values.

Avoid generic abstractions to save a few assertions, or one broad end-to-end replacement that creates cascading failures. Keep distinct regressions even with shared setup. Cohesion/discovery determine splitting, not arbitrary length ceilings.

## Reduce elapsed cost

Measure collection, fixtures, startup, waits and execution. Remove repeated setup, needless network calls and fixed sleeps before adding workers. Condition-based bounded waits preserve behavior; shorter arbitrary sleeps introduce flakiness.

Immutable caches need correct invalidation; mutable state remains isolated across workers/runs/retries. Parallelism that saturates databases or creates ordering dependence is no improvement. Local selection speeds feedback; final coverage/required integrations still cover the selected target.

Compare before/after using identical source denominator, configuration/environment and sufficient repetitions; state variation and whether collection/pw-setup/teardown are included. Instrumented timings compare with instrumented timings. One warm run establishes no universal gain.

## Prove smaller still detects faults

Explain the retained detector for each removed unique-looking check. If uncertain, inject a representative temporary fault in an isolated copy or use narrow mutation testing. Confirm intended failure, restore correct code and run final checks. Report surviving faults; investigate equivalent/out-of-scope mutations before diagnosing a defect.

Useful faults include wrong bounds, omitted permission checks, forgotten cleanup, input mutation and error translation. Avoid irrelevant generated/equivalent mutations. Preserve reversibility until suite, coverage and fault checks pass. Restore independent setup if merged fixtures leak; never delete failures, disable checks, broaden snapshots or add retries merely for green results.

Test plausible reordered/isolated execution when sharing may conceal dependence. Lazy caches, clocks, callbacks and background tasks can retain state around immutable fixtures. Verify resource teardown; surviving workers shift cost beyond the measurement.

Return before/after function count, independent case count, elapsed evidence and retained guarantees. There is no minimum count/deletion quota; reducing setup cost while retaining every case can be best.
