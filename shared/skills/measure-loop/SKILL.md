---
name: measure-loop
description: For repeated measured optimization with explicit acceptance and regression limits.
---

# Measure loop

Use when an observed bottleneck needs iterative experiments; retain one experiment log and coordinator. Read
[performance increase](../performance-increase/SKILL.md); it owns profiling, comparable benchmarks and before/after
reporting. Preserve the user's workload and correctness requirements rather than optimizing a convenient surrogate.

Establish a reproducible baseline, artifact identity, representative inputs, measurement environment and variability.
Agree the improvement threshold, regression limits and experiment budget before changing code. Missing measurement
capability prevents a performance conclusion; it does not justify invented numbers.

Investigate one bottleneck hypothesis per iteration. Make one attributable change, rerun equivalent measurements and
applicable correctness checks, then accept only an observed useful improvement within the agreed limits. Record failed
experiments too. Stop when the goal passes, benefit becomes indistinguishable from noise or the budget is exhausted.

Rejecting an experiment means removing its own attributable edits, never resetting a shared workspace or reverting
someone else's changes. Isolate experiments when ownership overlaps. For stateful effects, preserve caller-owned data,
reconcile writes and retries, and verify recovery before another trial; use
[functional programming](../functional-programming/SKILL.md) when its trigger applies.

Deliver the retained artifact, comparable before/after results, uncertainty, regressions checked and discarded hypotheses.
Recheck the combined accepted changes; individually faster experiments may interact adversely.
