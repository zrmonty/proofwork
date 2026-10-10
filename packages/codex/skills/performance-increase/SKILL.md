---
name: performance-increase
description: When profiling bottlenecks and measuring comparable before-and-after benchmarks.
---

# Performance increase

Reduce demonstrated product cost or benchmark-suite wall time while preserving the contract. Product runtime, microbenchmarks and harness feedback are different targets. Pursue the largest supported opportunity, then stop when the agreed target is met or further cost outweighs benefit. Optimization does not authorize live-service load, new infrastructure or unrelated rewrites.

For repeated measurable improvements, use [measure-loop](../measure-loop/SKILL.md); this skill owns benchmark validity.

## Establish comparable measurements

Inspect callers, existing profiles/benchmarks, production configuration and prior results. Identify whose latency, throughput, startup, rendering, allocation, memory, query count or feedback time matters. Resolve missing workload, hardware, tail-latency and resource constraints that would change the decision; do not invent required speedups.

Capture the baseline before editing or safely reconstruct it. Record artifact identity, compiler/runtime, flags, runner, input shape/size, operation count, concurrency and measurement boundaries. Distinguish cold/warm behavior, cache state, compilation, setup, execution and teardown. Repeat independent observations and retain variation; the fastest isolated sample cannot establish a reliable gain.

## Change the demonstrated cause

Use [hotspot investigation](references/hotspot-investigation.md) to connect user-visible cost to profiles, allocations, query plans or traces. Write a falsifiable hypothesis and choose the smallest complete correction: remove repeated work, improve the algorithm/data representation, reduce copies, or batch owned effects before adding caches, concurrency or services.

Use [cache lifecycle](references/cache-lifecycle.md) when caching affects invalidation, retention, misses or consistency. Check representative sizes and adverse distributions, including crossover where relevant. Do not present an empirical speedup as a complexity proof.

Keep domain decisions explicit and effects owned. Measured local loops or accumulators can be appropriate; functional-looking allocation chains are not inherently faster. Preserve caller ownership, ordering, duplicates, numeric/text semantics, validation, transactions, cancellation, errors and cleanup. Establish equivalence through existing or targeted distinguishing checks before trusting timings; avoid two implementations sharing the same faulty oracle.

For slow benchmark commands, load [benchmark runtime](references/benchmark-runtime.md). Separate harness savings from faster operations. Selected exploratory runs may accelerate iteration; retain complete confirmation and the sample quality needed for the final claim. Never improve numbers by trimming required input, omitting output consumption or disabling checks.

## Give the user actual before/after results

Follow [comparison reporting](references/before-and-after-report.md). The final answer must contain a table with workload, metric/statistic, actual baseline, candidate, absolute difference and directional percentage change. Include sample counts/variation, comparable conditions, revisions, reproduction commands and sanitized raw evidence. Carry worker measurements into the user-facing result.

Use the baseline denominator for reductions: `(baseline - candidate) / baseline`. Do not rename means as percentiles or claim changes below measurement resolution. Separate microbenchmark, end-to-end and harness wall-time rows; an internal gain does not establish an unmeasured user-wait improvement.

Repeat correctness checks and comparable measurements after final edits, accounting for warm-up and machine drift. Disclose tail latency, memory, concurrency saturation and other resource regressions beside benefits. Revert ineffective changes unless another demonstrated benefit justifies them.

If either side is unavailable, label observations and keep the gain unverified; historical or illustrative numbers are not task evidence. Report the bottleneck, repair, measured benefit, preserved behavior and remaining uncertainty. No useful demonstrated improvement is a valid outcome.
