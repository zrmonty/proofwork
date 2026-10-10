# Reduce benchmark wall time while preserving its meaning

Read this reference when developers or CI spend too long running benchmarks. The target is faster useful feedback, with sufficient evidence for the decision. Separate a diagnostic command from the benchmark used to substantiate a release claim.

## Account for elapsed time

Measure where the command spends time: dependency resolution or compilation, generating data, startup and warm-up, sample setup, measured operations, cleanup and reporting. Identify whether a cost repeats per command, per case, per sample, or per operation. Avoid timing the process launcher when the intended measurement is an already-running function, and avoid excluding launch when startup is the requirement.

Record two quantities where relevant:

```text
Suite wall time: from command start to successful completion, including required preparation.
Operation statistic: duration per stated unit under the documented measurement boundary.
```

Improved suite time with unchanged operation time is a valid harness improvement. Report it that way. Faster code may also shorten the suite, but a harness with fixed minimum measurement duration may instead collect more samples.

## Remove repeated overhead carefully

- Reuse unchanged compilation artifacts through the existing build tool. Include a cold-build result separately if clean build speed is in scope; a warm cache does not prove a faster compiler or cold build.
- Generate immutable representative input once when generation is outside the product operation. Reset mutable state between samples so a warmed cache, drained queue or already-sorted array cannot make later samples easier. If building the input is part of the product operation, keep it timed.
- Batch enough tiny operations inside a sample to reduce clock overhead, then normalize by the actual operation count. Vary or reset inputs when repeated work would exploit an unrealistic cache. Validate the work and consume the output; check that compiler elimination or lazy execution cannot erase it.
- Select the affected cases during iteration using the existing runner. Keep a documented full or appropriately scoped confirmation for the final claim, including cases that could regress. Label selected-case results as such.
- Avoid repeating identical setup across equivalent cases when an owned shared fixture is safe. Preserve isolation and per-case diagnostics; joining cases must not conceal a failure or stop subsequent cases from running.
- Parallelize unrelated preparation or separate jobs only when resource interference does not spoil measurements. Benchmarks competing for CPU, disk, network, memory or a shared database cannot be treated as isolated samples.
- Use the runner's supported sampling controls after checking its installed version and help. Shorter exploratory runs may reduce sample count or duration, but retain enough confirmation data to detect the relevant change. Do not silently loosen regression thresholds, drop warm-up, or truncate samples to obtain the desired result.

If compilation dominates a Rust suite, `cargo bench --no-run` can isolate the build stage for diagnosis; it does not execute benchmarks. Arguments after `--` go to the actual benchmark harness, which may be custom. Check that harness rather than assuming libtest flags apply. See [Cargo's command contract](https://doc.rust-lang.org/cargo/commands/cargo-bench.html).

## Keep the comparison defensible

Choose representative cases before seeing the candidate's favorable result. Include a boundary or adversarial case when the changed algorithm has a known weakness. Run both revisions with the same fixture, configuration, operation count and statistical method; independently verify identical outputs. When a legitimate workload update is needed, rerun the baseline with the new workload and describe the update.

Allow warm-up appropriate to the runtime, but retain a separate cold measurement when the product relies on it. Avoid blending cold and warm samples into one unexplained number. Where machine drift matters, alternate or randomize baseline/candidate order and repeat independent runs. Prefer an idle controlled runner; if unavailable, report interference and uncertainty rather than manufacturing precision.

Keep meaningful distributions. A minimum can help estimate an uncontended best case but does not describe a typical request or a tail. A median cannot stand in for a required high percentile. Comparing small samples that overlap substantially supports an inconclusive result, not a guaranteed improvement. Do not invent confidence intervals unsupported by the runner or analysis.

Check total work. A throughput figure needs its duration and completed-unit definition. Timing asynchronous dispatch instead of completion, counting attempted rather than successful operations, or changing bytes to records between runs invalidates the comparison. Confirm that instrumentation and output checks do not consume the bottleneck being measured; place invariant checks outside timing when safe and retain required product validation inside it.

For service measurements, record offered load, completed successful work, failures, timeouts and queued work together. Discarding slow failures can improve reported latency while making the service worse. State whether each simulated client waits for a response before submitting its next request: that model reduces offered load as the service slows and cannot alone substantiate behavior under an independently arriving burst. Include queue waiting in an end-to-end latency claim. Never generate live traffic merely to complete this comparison.

The [k6 load-model documentation](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) explains why request scheduling changes the question a load test answers. Use the existing harness's appropriate model rather than adding k6 as a dependency by default.

Keep a case table when workloads differ: typical, small, large, cold or contention-heavy as applicable. Do not average distinct cases into a single gain that hides a material regression. Choose the acceptance target and permitted tradeoffs before selecting favorable runs; if exploratory tuning used these data, confirm the chosen candidate with new independent observations. Archive the actual raw timing records with their units and revision so the summary can be checked.

## Finish with an explicit claim boundary

Return the command and case selection, environment, measured boundary, baseline and candidate identities, wall time, operation statistic, sample method and observed variation. State correctness checks, changed resource costs and remaining gaps. A result from one machine and workload establishes that scoped observation. Capacity, production tails and other supported platforms require their own evidence.

When a shortened run cannot resolve the expected difference, use it for iteration and run a longer confirmation. If confirmation remains inconclusive, retain the simpler change only when another demonstrated benefit justifies it; do not advertise it as a performance win.
