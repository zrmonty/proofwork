# Measurement and decisions

Collect evidence sufficient for the performance, reliability or product decision; avoid experiments larger than their uncertainty requires.

## Question and denominator

Name user outcome, realistic inputs, operation and time/resource. Select primary outcome/guardrails before exploring; do not switch to throughput when latency worsens. Define errors per request, successful comparable attempts or memory under specified concurrency. Totals may reflect traffic rather than improvement. Keep supplied targets; without one, label investigation exploratory rather than inventing pass/fail requirements.

## Comparable conditions

Record relevant artifact, build/runtime, runner, input distribution, concurrency, cache/warm-up and commands. Deterministic assertions need no irrelevant environment dossier.

Distinguish cold/warm questions. Repeat to assess variation, retain sanitized raw evidence, report spread and avoid best-run selection. Measure requested paths alongside micro-operations where work could move into setup, serialization, allocation, network or user delay. Preserve correctness/error semantics.

Chronology does not establish causality: traffic, seasonality, selection or deployment may change. Means hide tails/groups; failures and missing measurements belong in outcomes. Label exploratory metric searches and confirm selected results separately. Fixtures do not prove production benefit or general language/runtime rankings.

## Selection and leakage

Record inclusion/exclusions, not only counts. Opt-in or successful/completed-only samples can omit affected people/failures. Compare relevant segments; changed workload mix can reverse aggregates. Failure-related missing observations need defensible policy before dropping or replacing with zero.

Identify assignment/measurement units: ten requests from one person are not independent people. Shared caches, inventory or team behavior can cause interference. Use appropriate design or narrower claims; randomization is not automatically feasible/authorized.

For predictions/tuned heuristics, split evaluation before preprocessing fit, threshold choice or tuning. Keep related entities together and respect temporal order. Confirm against untouched representative data; benchmark optimization can overfit without machine learning.

Preselect confirmatory windows/stopping rules. Repeated inspection until favorable differs from planned comparison. Record exploratory changes and seek fresh confirmation proportionate to stakes. Percent differences/arbitrary samples alone do not justify significance claims.

## Safe replayable evidence

Prefer synthetic/aggregated evidence. Removing names can leave identifying text, rare combinations or keys. Preserve permitted scope/access/retention; do not expose production records in prompts, logs or reports. Keep sanitized provenance without unnecessary private data.

Preserve observations unchanged; return analysis with denominators, exclusions, missing/failure counts and uncertainty. Pass policy, thresholds and reference time explicitly rather than collecting rows or consulting hidden globals inside summarizers. Same snapshot/policy should reproduce results. Publication/persistence belongs at an authorized disclosure boundary.

Separate pure training-data fit from applying returned parameters to evaluation. Own collection, splits and sampling. This exposes leakage without proving unbiased selection: pure calculations can still encode bad denominators or causal assumptions.

Accept evidence meeting targets/guardrails, reject cost without required benefit, or investigate uncertainty. Keep limitations beside results and retain correctness regressions when performance evidence is inconclusive.
