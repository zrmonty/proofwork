# Release readiness gates

For release decisions, record each criterion as passed with evidence, failed, not applicable with reason, or pending
with an owner. Missing evidence cannot pass; readiness grants no deployment authority.

## Declare the decision

| State | Minimum basis | What remains |
|---|---|---|
| Ready for staging | Exact local artifact starts and its required flow passes; delivery/secret checks pass; resolved inputs are identified; staging configuration and migration/recovery plan are usable. | Staging execution and live-specific checks. |
| Ready for production | Required staging or justified equivalent checks pass on the intended artifact; production parity, compatibility, containment, signals and recovery have evidence and owners; no blockers remain. | Authorized promotion and live observation. |
| Deployed | The destination is observed serving the intended artifact after an authorized promotion. | Required live flow and observation window. |
| Verified live | Authorized journey and consequential durable effects pass through real routing for the agreed observation scope. | Sampling limits and ongoing operations. |

Return both readiness decisions as yes, no or pending with reasons. A unavailable staging environment is pending,
not automatically not applicable. If the hosting pattern has no separate staging, explain the equivalent isolated
checks and remaining live-only uncertainties; do not silently lower the standard. An open exposed capability,
unknown incompatible migration or missing mandatory recovery check blocks production readiness.

## Local artifact

- Record source revision, dependency lock and artifact digest. Start the production artifact, not the development server, and exercise the primary journey with isolated data.
- Inspect delivered assets, configuration substitutions, source maps, image layers and build logs for secret capabilities. An ignored file may still enter the artifact.
- Check missing configuration, dependency failure, resource bounds, shutdown and retry behavior. Restore representative data into an isolated destination and verify integrity and application reads.
- Record required host features, migration compatibility, recovery action and irreversible effects. A build pass establishes packaging only.

## Staging destination

- Use the intended hosting pattern, routing, identity boundaries and production-shaped configuration with protected test credentials. Document differences in data volume, capacity, permissions and external integrations.
- Exercise authenticated work through real routing and storage. Check schema preparation, old/new overlap where it exists, durable job ownership and duplicate delivery handling.
- Verify the operator can find a failed request or job using safe correlation identifiers, bounded logs and useful error/latency/queue metrics. Ensure an alert names a meaningful symptom, an owner and a recovery procedure; do not add a monitoring stack without need.
- Rehearse the supported recovery into isolated infrastructure. Measure restore duration and latest recoverable data against agreed recovery time/loss. Distinguish code rollback from schema repair or data restore.

Connect supply-chain findings to resolved lock inputs and the inspected artifact. Classify environment parity
differences, exercise the selected failure/containment paths, and verify the generated signals at their actual
collection and alert boundaries. Reuse their reference records; do not repeat scans merely to fill a checklist.

## Authorized live release

- Confirm authority, tested artifact identity, compatible data/configuration and cutover owner. Define observation duration, abort criteria and the concrete action for each failure before promotion.
- Verify public routing, authentication and an authorized representative flow. Record what effects a synthetic check creates and reconcile ambiguous writes before retrying or cleanup.
- Observe serving artifact, error rate, latency and required durable effects through the agreed window. State propagation and sampling limits. A local or staging success is not a live result.

## Hosting-specific checks

| Pattern | Evidence that changes readiness |
|---|---|
| Static/CDN | Public output contains no server secrets; origin/access rules, cache invalidation, asset-version compatibility and rollback propagation are checked. |
| Serverless | Duration/concurrency limits, cold starts, connection reuse, durable state, retries and deployment permissions match the workload. |
| Containers | Actual image, scoped runtime identity, signal handling, resource limits, writable mounts, readiness and replacement persistence are checked. |
| VM/single server | Service supervision, patch/TLS ownership, firewall exposure, disk capacity, backup and replacement procedure are demonstrated. |
| Managed services | Shared-responsibility boundaries, access policy, backup/export, provider limits and service-degradation response have named owners. |

Use primary provider documentation for consequential platform claims. Check only selected patterns.

## Credential lifecycle

Follow [exposure and response](exposure-and-response.md); unrevoked exposure blocks production readiness.

## Short operator handoff

Keep one release note with artifact/source/lock/configuration identities, both readiness decisions, dependency and
parity dispositions, failure/containment map, signal evidence, recovery procedure and live observation/abort owner.

List each material residual risk as consequence, affected users/data, evidence or unknown, mitigation, accountable
owner, blocked gate, next check and reopening condition. Include accepted nonblocking risks and who accepted
them; the agent cannot grant acceptance. An accepted risk is not a passed check. Unknown authority or a missing
required observation remains pending. Explain what an operator must do next, without burying blockers in prose.
