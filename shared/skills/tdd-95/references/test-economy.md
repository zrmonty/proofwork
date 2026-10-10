# Test economy

Read this when reducing suite size, duplication or runtime. Optimize the cost of protecting behaviors, not the test count in isolation.

## Build a behavior map

For the affected tests, record the observable guarantee, distinguishing inputs, expected outcome, effect boundary and fault it detects. Identify tests that differ only in spelling, tests with the same domain behavior but different adapters, and tests that happen to cover the same line while protecting different failures.

For example, parsing an ordinary positive amount twice with equivalent input forms may be redundant. Parsing zero, rejecting a non-finite amount and proving an input object is unchanged each protect different contracts. Sharing a line does not make them duplicates.

Preserve a small failure-mode matrix for consequential consolidation:

| Guarantee | Detector to retain | Why a happy path cannot replace it |
|---|---|---|
| Upper bound is inclusive | Named boundary case | Interior values do not detect `<` versus `<=` |
| Failed write leaves old data intact | Effect failure with state assertion | A success case never observes partial failure |
| Repeated calls do not share state | Independent calls / fresh ownership check | Single execution hides retained state |
| Unauthorized action is refused | Negative permission case | Authorized success does not prove enforcement |

Use only relevant rows and add the actual project's risks. Do not create a generic checklist suite for behavior the product does not have.

## Consolidate at the right level

1. Delete exact duplicates after showing another test detects the same fault through the same contract.
2. Parameterize true variants with readable names and independent runner results. Keep each case's assertion specific enough to diagnose its failure.
3. Share expensive read-only setup when safe. Recreate mutable fixtures or reset them with a demonstrated isolation contract; a transaction rollback does not necessarily reset sequences, filesystem writes, caches or background jobs.
4. Keep most deterministic domain cases close to pure functions. Retain a small representative adapter/integration test for each required wiring guarantee; a mock-only suite cannot prove the real adapter works.

A table of 20 independent cases replacing 20 copied test functions reduces maintenance repetition, not necessarily execution count or runtime. Report that distinction. A single test looping over those cases may stop on the first failure and conceal the rest; use the runner's native case facilities or independent subtests instead.

Check the assertion boundary after parameterization: the runner must observe each failure and wait for each asynchronous assertion or effect. A callback that schedules work and immediately returns can report success before its checks run. Avoid catching an assertion just to collect results unless the test then propagates a failing result through the runner's supported mechanism. Name cases from safe input characteristics rather than embedding private fixture values.

Do not build a generic test abstraction merely to save a few repeated assertions. Avoid one broad end-to-end test replacing several isolated detectors: it can increase diagnosis cost and introduce cascading failures. Keep a dedicated test for a distinct regression even when a shared setup helper is used.

Keep consolidated tests cohesive and independently reported. Split when responsibility or discovery becomes unclear; no arbitrary file-length threshold determines this decision.

## Reduce real elapsed cost

Measure collection, fixture initialization, application startup, I/O waits and case execution separately when they explain the delay. Prefer removing repeated setup, unnecessary network calls and fixed sleeps before adding more workers. Use a bounded condition-based wait for asynchronous behavior; a shorter arbitrary sleep can turn a slow test into a flaky one.

Cache immutable inputs only when invalidation is correct. Keep mutable state isolated across workers, test runs and retries. Parallelism that overwhelms a database or introduces ordering dependencies is not an improvement. Test selection speeds local feedback, while final coverage and required integration checks still run over the selected target.

Benchmark before and after using the same source denominator, runner configuration and environment. Repeat enough to distinguish a useful effect from noise; report the observed range and whether collection/setup was included. Do not promise a universal speedup from a single warm run. Coverage instrumentation changes cost, so compare instrumented runs with instrumented runs and ordinary runs with ordinary runs.

## Check that smaller still catches faults

For each removed unique-looking detector, explain the retained detector. When that explanation is uncertain, inject a representative temporary fault in an isolated working copy or run a narrowly targeted mutation check. Confirm that the retained suite fails for the intended reason, restore the correct implementation, then run the final suite. Report a fault that survived; do not discard it to improve a score.

Useful faults follow the contract: wrong boundary comparator, omitted permission check, forgotten cleanup, accidental input mutation or wrong error translation. Avoid mutations in irrelevant generated code or equivalent transformations that cannot change behavior. A surviving mutation may be equivalent or outside scope; investigate before calling it a test defect.

Keep consolidation reversible until the affected suite, required coverage and fault checks pass. If merged fixtures leak state, restore independent setup and fix the cause before trying a narrower sharing strategy. Never remove a failure case, disable a test, broaden a snapshot or add retries just to make a shorter suite green.

Test sharing against a plausible different order or isolated case execution when it could conceal dependence on prior cases. An immutable fixture may be shared, but lazy caches, global clocks, registered callbacks and background tasks can still retain state around it. Include teardown cost in runtime comparisons and verify owned resources are released; a faster suite that leaves workers alive has shifted its cost beyond the measured boundary.

Return before/after test function count, independent case count, elapsed measurements and retained guarantees. There is no minimum test count and no deletion quota. Keeping the same count while reducing expensive duplicated setup can be the best result.
