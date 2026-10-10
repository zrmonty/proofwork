# Release observation and uncertain writes

Read when verifying an authorized rollout, reconciling an interrupted release or checking a primary flow with durable effects. Keep the release's observable outcome separate from process health and transport success.

## Choose observations that mean something

A process starts, a readiness endpoint responds and an anonymous page renders. These establish those observations; they do not prove that authenticated users can save and retrieve their work. Pick a representative required flow through the actual routing, access boundary, runtime configuration and durable storage of the selected destination.

Use existing safe synthetic records and an isolated environment where possible. A production smoke test that sends messages, charges money or creates user-visible records needs authority for those effects and an owned cleanup plan. Prefer an authorized nonmutating observation when it proves the required criterion; do not disguise a live write as a health check.

Record the tested artifact, destination, relevant configuration shape without values, data compatibility and observation window. A local success is not evidence for a remote rebuild or a different route. Inspect only the environment names and safe metadata necessary for the check; never dump secrets to diagnose a readiness failure.

## Observe transitions, not just arrival

If the rollout overlaps versions, exercise the actual coexistence contract: requests, queued jobs and retained clients may reach different versions. Test only the overlap the selected host creates; a single-instance maintenance cutover need not grow a rolling-release framework.

Separate initialization failures, request errors, dependency degradation and data-integrity failures. One dependency outage may disable a feature rather than require global rollback. Conversely, an apparently healthy process writing incompatible records can require stopping traffic. Use the application's real requirements to define a bounded observation and stop condition.

Avoid inventing universal error budgets or waiting forever for certainty. State the acceptable behavior and accountable operator supplied by the project. If those facts are material and absent, leave the associated release decision incomplete while continuing independent artifact checks.

## A timeout is an unknown outcome

Suppose a release smoke request saves a synthetic record, but the response times out. Repeating the request can create another record if the first committed. Locate the operation through its supported identity or idempotency contract and observe durable state before retrying. A cancelled client request does not necessarily cancel server execution.

If lookup is unavailable, preserve the uncertain effect and identify the next required observation. Do not mark it failed, complete or safely cleaned up from missing logs alone. Cleanup must target only the run-owned record and must account for a still-running writer; otherwise cleanup can race a late completion.

For an interrupted deployment command, inspect which artifact is actually serving before replaying it. A checkpoint describing the intended release is not live state. Old and new instances can coexist after partial success; reconcile that state before choosing recovery.

## Recovery follows the data state

Compare available actions against current compatibility: previous artifact, forward repair, controlled maintenance or authorized restore. An old image can be unusable after an incompatible schema or data-format change. A restore can lose later writes. State those consequences before any separately authorized recovery action.

Keep build-secret handling in scope when diagnosing release problems. The [Docker build-secret documentation](https://docs.docker.com/build/building/secrets/) distinguishes secret mounts from inappropriate persistent build arguments/environment values. Using a mount still requires inspecting whether the build copied or logged the value into output; the mechanism alone is not evidence of safe artifacts.

## Report the reached state

Say what was locally verified, what passed at the selected host and what was observed live. Name remaining uncertain effects, propagation limits and accountable next actions. A bounded successful flow supports release readiness within its scope; it supplies no unlimited availability, lossless rollback or exhaustive exposure guarantee.
