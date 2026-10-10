---
name: performance-increase
description: Profile and improve application performance or benchmark runtime with representative workloads, correctness checks, and comparable before/after measurements; investigate slow code rather than prescribing speculative rewrites.
---

# Performance increase

Make the required work cheaper without changing what the product promises. A fast result that omits validation, drops records, changes ordering, or measures a different workload is a defect. Pursue the largest demonstrated opportunity first, then stop when the agreed target is met or the remaining cost outweighs the benefit.

Use this skill for a performance investigation, a requested optimization, or a benchmark suite that takes too long. Ordinary implementation still deserves reasonable algorithms; it does not require a benchmark campaign. Recommendations alone do not authorize load against a live service, additional infrastructure, or unrelated rewrites.

## Establish the target and baseline

Inspect the relevant callers, implementation, existing profiling and benchmark tools, deployment mode, and previous results. Identify whose wait or resource cost matters: request latency, throughput, startup, rendering, memory, CPU, allocation, query count, or the time developers spend running benchmarks. Product runtime and benchmark-suite wall time are separate targets; improving one does not prove improvement in the other.

Ask about missing constraints that could change the decision, such as the real input sizes, target hardware, tail-latency requirement, or acceptable memory increase. Use repository evidence where available. If no target is supplied, state the current observed cost and the proposed scope instead of inventing a required speedup. A library microbenchmark does not establish an end-user response target.

Build or run in the intended production configuration. Record revision, runtime/compiler versions, relevant flags, hardware or runner, input shape and size, operation count, concurrency, and measurement boundaries. Identify cold versus warm behavior, cache state, startup, setup, and teardown. Keep both sides comparable; if a condition changes, disclose it and repeat the comparison under the same condition.

Repeat enough independent observations to distinguish a material change from run-to-run variation. Preserve results, not just the best run. A single noisy sample can identify an avenue to investigate, but cannot support a reliable speedup claim. Use the project's existing statistical method and timing tools; introduce a dependency only when the measurement genuinely needs it.

## Find and change the expensive work

Read [hotspot investigation](references/hotspot-investigation.md) when improving product code. Trace cost from the user-visible operation to the responsible work. Use CPU profiles, allocation observations, query plans, traces or counters according to the symptom. A profiler locates work; a representative benchmark tests whether changing it helps.

When caching is a measured candidate or a warm benchmark hides invalidation, retention or miss costs, read [cache lifecycle](references/cache-lifecycle.md). Per-operation reuse may solve the problem without shared cache state.

Write a short hypothesis that can fail: “Repeated membership scans dominate this input; one index per request should remove the repeated scan while preserving output order.” Choose the smallest change that addresses the measured cause. Prefer removing unnecessary work, improving an algorithm or data layout, reducing copies and allocations, batching owned effects, and avoiding repeated parsing or serialization before adding a cache, concurrent workers, or another service.

Check how cost grows, not just one favorable input size. An optimization should address the observed expensive dimension: record count, payload size, key distribution, concurrent requests or retained state. Include a small-input comparison and a representative stress shape when the algorithm's crossover or worst case could change the decision. Do not describe an empirical speedup as a complexity proof.

Keep domain decisions pure and effects explicit. A measured private loop or local accumulator can be the clearest efficient implementation; replacing it with chained transformations that allocate intermediates is not an improvement merely because it looks functional. Conversely, do not mutate caller-owned data, weaken ownership, or spread state across the application for an unmeasured micro-optimization. Preserve cancellation, errors, validation, transaction semantics and resource cleanup.

Before relying on timings, prove equivalence with focused behavior checks using representative and boundary inputs. Include the semantics the change could alter: duplicates, ordering, empty input, failure paths, numeric precision, text handling, and ownership. Reuse existing tests where they already establish these properties. Compare to an independent specification or trusted existing implementation where appropriate; avoid testing two paths that share the same newly introduced bug.

## Shorten benchmark feedback without weakening evidence

Read [benchmark runtime](references/benchmark-runtime.md) when the benchmark command itself is slow. Separate compilation, fixture generation, per-sample setup, execution and reporting before changing the harness. Reusing a compiled binary or an immutable fixture can save wall time without making the operation faster. State that distinction in the result.

Use a selected benchmark for iteration and retain the appropriate complete confirmation before declaring the task finished. A shorter exploratory run is useful when clearly labeled; it is not a substitute for the sample quality required by the reported conclusion. Preserve meaningful cold paths, contention and tail behavior when those are the product's risks. Do not obtain better numbers by trimming input, skipping output consumption, counting different units, turning off required checks, or quietly redefining the baseline.

## Compare, decide and return evidence

Run the relevant correctness checks and repeat the baseline/candidate comparison under the recorded conditions. If possible, alternate their order or otherwise account for warm-up and machine drift. Record the actual measurement statistic and its variation; do not call a mean a percentile or claim a precise improvement below the experiment's resolution. For a reduction, identify the baseline denominator: `(baseline - candidate) / baseline`. Keep suite wall time and per-operation time in separate rows.

Inspect adjacent resource costs. Faster average response can hide worse tail latency, greater memory use, increased database writes, or saturation under concurrency. Accept a tradeoff only when it fits the user's constraints, and document a limitation that matters. If the hypothesis fails, revert the ineffective change or explain why another independently demonstrated benefit justifies it. Avoid accumulating speculative tweaks.

Return the bottleneck found, the change made, commands and scoped environment, comparable results, correctness evidence, and remaining uncertainty. Distinguish executed measurements from projected capacity and diagnostic runs from confirmation. If no useful improvement is demonstrated, say so and preserve the simpler implementation. Do not promise a speedup across machines, workloads, or production deployments that were not measured.
