# Evidence

Record criterion, repository, exact revision or relevant file digests, environment, command or interaction, observed outcome, and artifact location. Include failures and limitations. Exclude credentials and unnecessary sensitive content.

Evidence covers the artifact observed, not later changes. Inspect relevant code and dependency changes before reusing a record. Re-run affected checks on the combined result; a worker summary and a build alone do not prove behavior. Frontend claims require rendered and interaction evidence when those criteria are required. Record absent capabilities as missing evidence.

Examples of distinct claims: compiler output supports build validity; regression output supports a tested behavior; a screenshot supports appearance in one viewport; a keyboard interaction supports that flow. Keep the claim within the observation.

## Choose evidence for the claim

| Claim | Suitable observation | What it leaves open |
| --- | --- | --- |
| A parser rejects malformed input | Run representative invalid inputs and observe explicit errors | Untested variants, integration and performance |
| A refactor preserves a public contract | Run its existing contract tests and meaningful boundary cases on both versions | Behaviors outside that contract |
| A failure recovers without duplicate delivery | Exercise partial failure, inspect persisted state and count actual effects | Other crash points and external service guarantees |
| A layout remains usable on narrow screens | Render representative content, inspect reflow and exercise controls | Other content, devices and assistive technology |
| A change improves latency | Repeat a comparable workload, preserve correctness and report variation | Production conditions outside the experiment |

Build, unit tests, screenshots and reviews support different claims. Combine them when the acceptance criterion crosses those boundaries. Do not make a checklist of unrelated checks to create an impression of confidence.

## Identify what was observed

For a clean checkout, a commit identifies tracked content. For a dirty checkout, include a snapshot or digest covering relevant source, dependencies, configuration and fixtures. A digest of the log identifies the log, not the implementation. Record both when the distinction matters. Evidence must be attributable to the same target repository and environment as the observed behavior.

The local CLI can execute a command and record its actual exit, duration and stream digests. It binds evidence to the checkpoint's filesystem/Git snapshot and verifies artifact hashes at completion. Manual records are marked claimed and require an explicit completion override. Neither mode establishes that a successful command proves its mapped criterion; inspect that relationship before acceptance. See [schemas and limits](tool-interface.md).

## Invalidate selectively and visibly

When a change affects a criterion, inspect its dependencies and rerun the relevant integrated check. An unrelated copy edit need not invalidate runtime behavior evidence. A shared parser, lockfile or state transition can affect several criteria. State the reasoning before reusing evidence.

Keep failed observations. Record a new evidence ID for a rerun; the latest observation for a criterion and identity controls its status. Investigate inconsistent results rather than selecting a favorable run. If the tool is unavailable, record the exact unproved claim and any partial evidence without marking the required criterion passed.
