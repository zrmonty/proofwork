# Measurement and decisions

Use this reference for performance comparisons, reliability experiments, and measured product outcomes. The procedure should be just large enough to make the decision credible.

## Choose the question and denominator

State the outcome in terms the user cares about. “The cache is faster” leaves the workload, latency definition, and correctness ambiguous. A useful hypothesis names the repeated operation, realistic inputs, observed end-to-end time or resource, and the required improvement.

Choose a primary outcome and guardrails before exploring results. Do not switch from latency to throughput after discovering that latency got worse. Define denominators: errors per request, memory under a given concurrency, or successful tasks among comparable attempts. A larger total may simply reflect more traffic.

Keep the user's target. If none exists and the assignment authorizes investigation, describe an exploratory comparison and avoid a fabricated pass/fail threshold.

## Control what can change

Compare artifacts with the same input and relevant environment. Record runtime/build mode, hardware or execution environment, data size/distribution, concurrency, cache state, warm-up policy, and the measurement command where they influence the claim. Do not require an environment dossier for a deterministic correctness test.

Cold-start and warm behavior may answer different questions; state which you measured. Repeat enough to see whether the result exceeds ordinary variation. Retain raw observations or a sanitized equivalent, report spread, and do not choose only the best run. Very noisy data supports a narrower conclusion or more investigation.

Measure the full requested path as well as a micro-operation when local savings could shift work elsewhere. Check setup, serialization, network, allocation, and user-visible delays as relevant. A faster parser with changed error behavior is not automatically an improvement.

## Avoid misleading conclusions

- A before/after production trend can be affected by traffic mix, seasonality, deployment changes, or selection. Describe the observation and uncertainty; do not claim causality from chronology alone.
- A mean can hide slow tails or changes among different user groups. Examine the distribution or meaningful segments when the decision depends on them.
- Missing and failed measurements are part of the outcome. Excluding failures can make an unreliable change appear faster.
- Repeatedly searching many metrics for a positive result increases the chance of a misleading story. Label exploratory findings and confirm the decision with a focused follow-up.
- A test fixture supports that workload. It does not establish production benefit or a broad language/runtime ranking.

## Prevent leakage and selection from choosing the answer

Record how observations entered the dataset, not just its row count. Opt-in telemetry, only completed tasks or only successful responses can exclude the people and failures the change affects. Compare relevant segments and account for exclusions; an aggregate improvement can reverse when the workload mix changes. Missing observations may have a cause related to failure, so replacing them with zero or silently dropping them needs a defensible policy.

For experiments, identify the unit receiving the change and the unit measured. Ten requests from one user are not automatically ten independent users. Where concurrent variants can interfere through shared caches, team behavior or inventory, assignment and interpretation need to account for that interaction. Use an appropriate design or narrow the causal claim; do not prescribe randomization when it is infeasible or unauthorized.

For predictive systems or tuned heuristics, split evaluation data before fitting preprocessing, selecting thresholds or tuning the implementation. Keep related users/entities together when overlap would leak their information; respect time order when predicting future behavior. Evaluate the selected candidate on untouched representative data. Repeatedly optimizing against the same benchmark can overfit its fixture even without machine learning.

Choose the observation window and stopping rule before interpreting a confirmatory test. Repeatedly checking until a favorable result appears does not provide the same evidence as a planned comparison. If the experiment changes during exploration, record that change and seek fresh confirmation proportional to the decision's stakes. Do not manufacture a significance claim from an arbitrary sample size or a percentage difference alone.

## Collect the minimum useful evidence

Prefer synthetic or aggregated inputs when they answer the question. Removing names alone may leave identifiers, rare combinations or free text that expose individuals. Keep permitted data scope, retention and access with the experiment; do not paste raw production rows into prompts, logs or published evidence. Preserve enough sanitized provenance to reproduce the conclusion without retaining private content unnecessarily.

## End with a decision

Accept when the relevant evidence meets the user's target and guardrails. Reject when the proposed change adds cost without its required benefit. Investigate when uncertainty prevents a meaningful decision. Record limitations in the same place as the result. Keep regression protection for correctness even when a performance experiment is inconclusive.
