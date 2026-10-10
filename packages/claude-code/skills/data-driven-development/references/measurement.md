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

## End with a decision

Accept when the relevant evidence meets the user's target and guardrails. Reject when the proposed change adds cost without its required benefit. Investigate when uncertainty prevents a meaningful decision. Record limitations in the same place as the result. Keep regression protection for correctness even when a performance experiment is inconclusive.
