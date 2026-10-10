# Performance increase specification

## Purpose and trigger

Investigate and improve measured application performance or benchmark-suite feedback time. Apply to optimization requests, demonstrably expensive code and slow benchmark workflows. Do not require a benchmark campaign for an ordinary unrelated change or authorize live load, new infrastructure or a broad rewrite.

## Inputs and scope

Inspect callers, production configuration, toolchain, existing profiling/benchmark facilities, prior evidence, representative data and user constraints. Separate product speed, resource cost and harness wall time. Ask only material unknowns; mark unsupported workload or capacity assumptions as provisional.

## Required decisions

- Establish a reproducible baseline with revision, environment, build/runtime flags, input shape and size, units, concurrency, measurement boundary, cache state and cold/warm distinction.
- Use profiles, plans, traces or counters appropriate to the symptom; connect the measured bottleneck to a falsifiable hypothesis and the smallest useful change.
- Consider algorithms, data layout, allocation, repeated parsing/serialization and batching before speculative caching, concurrency or infrastructure. Preserve validation, cancellation, errors, transactions and resource cleanup.
- Maintain pure domain decisions and explicit effects. Permit measured owned local loops or accumulators without exposing mutation or mandating a blanket functional rewrite.
- Establish correctness and ownership equivalence before trusting timings. Cover semantic risks introduced by the change; reuse meaningful existing tests.
- Measure repeated comparable runs, report the statistic and variation, and distinguish inconclusive results from demonstrated improvements. Do not cherry-pick runs or hide adverse cases.
- Reduce benchmark overhead by diagnosing compilation/setup/execution/reporting, safely amortizing owned setup, using targeted iteration and maintaining adequate confirmation.
- Preserve the measured workload, operation count, output consumption and unit definitions; prevent lazy or compiler-eliminated work and exclude changed boundaries from false speedup claims.
- Separate harness wall-time gains from per-operation gains. Shortened diagnostic samples are not full certification; sample controls and flags must match the installed harness.
- Inspect relevant memory, tail latency, write load and contention tradeoffs. Reject or revert ineffective complexity and stop at the agreed target.
- Return scoped before/after evidence, correctness checks, exact command selection, tradeoffs and unverified limits without universal speedup promises.

## Progressive disclosure

references/hotspot-investigation.md covers symptom-driven measurements, semantic constraints for candidate changes and conditional TypeScript/JavaScript, Rust, Python and SQL notes. references/benchmark-runtime.md covers overhead accounting, safe iteration shortcuts, fair comparison and result boundaries. Linked official documentation verifies measurement interfaces; no external skill prose or examples are incorporated.

## Acceptance cases

1. An ordered membership filter with repeated scans considers an owned lookup, includes construction in timing, verifies duplicate/equality/order behavior and measures small and representative large inputs.
2. A benchmark dominated by immutable fixture generation amortizes that generation only if outside the required operation, resets mutable state and reports wall-time improvement separately from operation time.
3. A request to make code “hyper performant” without workload evidence establishes the relevant target and profiles a baseline rather than introducing caches, unsafe code or services by preference.
4. A JIT-warmed candidate compared with a cold baseline is rejected as incomparable; both revisions receive the same conditions and startup remains separate if relevant.
5. A lower sample count yields overlapping noisy results; the evaluator treats this as exploratory or inconclusive and runs appropriate confirmation instead of claiming a precise speedup.
6. A Rust benchmark returns an unused constant result; the investigation ensures work is observable, validates outputs and reruns in the actual optimized target with its installed harness.
7. A Python timeit result excludes setup or collection relevant to the product; the report states the boundary and adds a relevant measurement before claiming service behavior.
8. A faster batch loses partial-failure handling, transaction behavior or cancellation; it fails equivalence despite favorable timing.
9. Parallel benchmark jobs contend for the same resource; the evaluator isolates measurements or reports interference rather than accepting contaminated samples.
10. A benchmark silently shrinks data, times asynchronous dispatch or changes units; the evaluator restores equivalent work or reruns both revisions under a disclosed legitimate workload change.
11. A private loop reduces measured allocations while retaining caller ownership; the skill permits it and does not force a chained allocating functional expression.
12. A candidate improves mean response but violates the supplied memory or tail target; it is rejected or the explicitly authorized tradeoff is recorded.
13. Profiling finds no material optimization; the evaluator reports the evidence and retains the simpler implementation without inventing a promised percentage.
14. Faster service latency excludes timeouts and failed requests: the comparison includes offered load, completed work and failures before accepting any improvement.
15. A lookup wins on a reused large fixture but loses when constructed for ordinary small requests: the report includes construction, size crossover and relevant input distributions rather than prescribing it everywhere.
16. Repeated tuning selects the best of many noisy candidates: independent confirmation and preserved raw records are required before reporting a reliable gain.

## Conditional reference expansion

Reference map: references/cache-lifecycle.md is loaded only for measured cache suitability, complete dependencies, effect ownership, invalidation, cold/miss behavior and bounded retention.

Required acceptance: A total cached only by organization ID cannot survive snapshot/policy/permission changes unchecked. Compare actual cold/warm/miss/invalidation cases including key/copy cost and retained memory; reject a faster stale or cross-caller-mutable result. Prefer local reuse when it solves the measured bottleneck.

The reference is original decision guidance. These cases specify observable acceptance; they are not claims of executed application, framework, provider or benchmark evidence. Existing strict typing, functional ownership, coverage and physical code-file limits remain in force.

## Evaluation status and authorship

Original Proofwork instructions and examples. Cargo, Python, Node and SQLite primary documentation was inspected for measurement constraints. Acceptance cases specify expected behavior; they do not assert that benchmarks or forward evaluations were executed. Executed checks and limitations belong in the parent verification record.

## User-facing benchmark contract

Load references/before-and-after-report.md for an investigation, optimization or harness result. Final delivery contains actual comparable before/after values with workload, unit and statistic, absolute difference and directional percentage, sample count/variation, environment, revisions/digests, reproduction commands and sanitized raw evidence. Include relevant resource/tail/failure tradeoffs. Explain the effect only at the measured boundary; a microbenchmark does not establish end-to-end benefit.

Additional authored acceptance cases:
- A median operation falls from 180 ms to 120 ms: report 60 ms saved, 33.3% lower duration and, if useful, 1.5x speedup; keep these hypothetical until actual samples exist.
- A faster mean accompanies a worse required tail or memory target: show both and reject the constraint violation rather than hiding the adverse row.
- Only the candidate is runnable: show its observed result, state the missing baseline and leave relative improvement unverified.
- Different cache states or completed operation counts invalidate a gain; rerun equivalently or label the observations non-comparable.
- A suite setup change saves wall time while operation measurements are unchanged: describe developer feedback improvement without claiming faster product behavior.
- Baseline zero makes a percentage undefined; show the absolute difference without division or invented infinity.
- Valid repeated samples remain noisy: report the actual observations/variation and no reliable improvement demonstrated.
- A worker measured the change: the coordinator preserves its current-artifact provenance and includes the comparison in final delivery rather than leaving it only in a private handoff.

These are report acceptance requirements, not executed application benchmarks or proof of measured improvement.
