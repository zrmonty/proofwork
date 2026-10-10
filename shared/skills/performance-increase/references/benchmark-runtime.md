# Reduce benchmark wall time without changing its meaning

Separate diagnostic feedback from final confirmation. Measure dependency/build work, data generation, startup/warm-up, sample setup, measured operations, cleanup and reporting. Identify costs per command, case, sample or operation. Do not exclude startup when startup is the requirement.

Record suite wall time including required preparation and operation duration per completed unit. Faster suite time with unchanged operation time is a valid harness improvement; fixed-duration harnesses may collect more samples instead.

## Remove repeated overhead

- Reuse unchanged build artifacts; cold-build claims need separate cold measurements.
- Generate immutable input once only outside the product operation. Reset mutable state: warm caches, drained queues and sorted arrays change workloads.
- Batch tiny operations, normalize by actual count and consume/validate outputs so optimization or laziness cannot erase work.
- Select affected cases during iteration; retain final confirmation including plausible regressions. Shared fixtures preserve isolation and independent diagnostics.
- Parallelize only without interference; competing CPU, disk, network, memory or database work is not isolated sampling.
- Inspect installed sampling controls. Short exploratory runs need adequate independent confirmation; never silently loosen thresholds, drop warm-up or truncate unfavorable samples.

Rust cargo bench --no-run isolates compilation but executes no benchmarks. Arguments after -- belong to the actual, possibly custom, harness. See [Cargo's command contract](https://doc.rust-lang.org/cargo/commands/cargo-bench.html).

## Defensible comparison

Choose representative/boundary/adversarial cases before favorable results. Baseline and candidate use identical fixtures, configuration, counts and statistics with independently verified outputs. Legitimate workload updates require rerunning the baseline.

Keep cold/warm observations separate. Alternate/randomize revision order and repeat independent runs when drift matters. Report interference and uncertainty if an idle runner is unavailable. Retain distributions: minimum is best case, median is not a tail percentile, overlapping small samples may be inconclusive. Do not invent confidence intervals.

Throughput needs duration and completed-successful-unit definition. Timing dispatch, counting attempts or changing units invalidates comparisons. Place instrumentation outside timing only when required product validation remains inside.

For services, record offered load, completed successes, failures, timeouts and queues together. Excluding slow failures can disguise degradation. State whether clients await responses before submitting again: closed models reduce load as service slows and cannot alone substantiate independent bursts. End-to-end claims include queue wait. Never generate live traffic merely for comparison. See [open versus closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/); do not add a new harness dependency by default.

Keep distinct cases visible; averages can hide regressions. Choose acceptance/tradeoffs before favorable runs. Confirm exploratory choices with fresh observations. Archive actual timings with units/revisions privately where needed.

## Claim boundary

Return commands/cases, environment, measured boundary, identities, wall time, operation statistics, sampling/variation, correctness, resource tradeoffs and gaps. One machine/workload does not prove production capacity, tails or other platforms. Inconclusive exploratory runs need longer confirmation; retain a simpler change for another demonstrated benefit without advertising an unproved speedup.
