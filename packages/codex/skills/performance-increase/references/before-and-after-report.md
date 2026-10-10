# Before-and-after benchmark reporting

Read when returning a performance investigation, optimization or benchmark-harness change. The user needs actual comparable observations and their practical meaning, not a description of an allegedly faster algorithm.

## Measure both artifacts

Capture the baseline before changing the relevant implementation, then measure the candidate under equivalent conditions. Identify both content revisions/digests, workload, completed operation count, build/runtime, machine/runner, concurrency, cold/warm/cache state and measurement boundary. Preserve commands, representative inputs and raw sample artifacts with secrets redacted before output.

If the baseline was not captured, reconstruct it in an isolated checkout or use a safe preserved implementation and rerun the same workload. Preserve the user's working changes and configured toolchain. Existing historical results are comparable only when their environment, workload and measurement boundaries are established; otherwise label them historical context. No accessible baseline means no verified before-and-after gain. Report the limitation and the candidate observation without inventing numbers.

Use repeated observations and the project's supported statistic/variation method. Name the sample/repetition count and warm-up separately for each side. Keep operation latency, throughput, end-to-end wait and benchmark-suite wall time distinct. Include failed operations/timeouts and offered versus completed work when concurrency makes survivor-only results misleading. Do not average away a material regression on another required workload.

## Put the comparison in the user-facing result

Include a compact table in the final answer, not only in a worker handoff, attachment or raw log. Use measured units and the same named statistic for both sides. Include relevant small/large, cold/warm or contention cases when they materially change the conclusion. Select metrics that answer the user's performance question and expose consequential adjacent resource costs.

| Workload / metric / statistic | Before | After | Absolute change | Relative change |
| --- | --- | --- | --- | --- |
| <representative operation, median, ms> | <measured baseline> | <measured candidate> | <time saved or added> | <percent lower or higher> |
| <same workload, p95 or relevant resource> | <measured baseline> | <measured candidate> | <difference with units> | <percent and direction> |
| <benchmark suite wall time, when in scope> | <measured baseline> | <measured candidate> | <seconds saved or added> | <percent lower or higher> |

These are placeholders, not observations. Omit irrelevant rows rather than imply they were measured. Put unavailable required metrics in the report as unavailable with the reason; a missing row cannot become a silent pass.

For lower-is-better costs, reduction is (before - after) / before times 100. For higher-is-better capacity, increase is (after - before) / before times 100. State direction explicitly. A latency speedup ratio is before / after; a throughput ratio is after / before. Do not interchange percentage reduction and ratio. If the baseline is zero or a denominator is unsupported, report the absolute change and say the relative change cannot be computed. Negative improvements are regressions, not values to hide.

Show appropriate precision: report round-to-round variation or the supported confidence interval alongside the main statistic and label unresolved noise. A best-of-many run does not substantiate a reliable gain. If a valid repeated comparison remains inconclusive, say "no reliable improvement demonstrated" and explain the next useful measurement. If timing setup changed, rerun both sides under that setup or present them as non-comparable observations.

## Explain what the numbers mean

Follow the table with a concrete statement connecting the measured boundary to the person's task. For an end-to-end export measurement, describe how much earlier that representative export finishes. For an internal lookup microbenchmark, explain the operation saving and explicitly leave overall export/request benefit unmeasured. Do not multiply a microbenchmark improvement into a user-wait claim or extrapolate to production traffic without measurements.

For illustration only, a measured median dropping from 180 ms to 120 ms would save 60 ms per stated operation, a 33.3% reduction and 1.5x speedup. These hypothetical numbers are not a Proofwork benchmark. A 120-to-90-second suite change would save 30 seconds of benchmark feedback; it would not prove faster application execution. Actual reports must replace examples with collected observations.

Explain the bottleneck removed and cite the distinguishing correctness check. State relevant tradeoffs, including worse tail latency, memory retention, CPU, writes, concurrency or error behavior. A gain that violates an agreed constraint fails acceptance even if its mean looks attractive. A smaller improvement can still be useful when reliable and within scope; do not manufacture a target multiplier.

Finish with reproduction commands, sample counts, scoped environment, artifact identities and links to sanitized raw results. Keep the main explanation readable; specialist details can follow. Say which outcome is demonstrated, inconclusive, regressed or unmeasured. An investigation-only task can return an honest baseline and proposed experiment without a fabricated candidate gain.
