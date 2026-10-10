# Release readiness gates

Read when deciding whether an artifact can advance toward production. Record each applicable gate as passed with evidence, failed, not applicable with reason, or pending with an owner. These are distinct environments, not permission to deploy. Never convert missing staging or live evidence into a pass.

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

Use current primary provider documentation for consequential platform claims. Check only patterns actually selected.

## Credential lifecycle

Name the owner and delivery mechanism of each secret without recording its value. Check least privilege, environment separation and logs/artifact exposure. For authorized rotation, verify replacement access, update dependent consumers, revoke the old capability and observe failures; follow provider ordering when overlap is unavailable. Rotation and live policy changes require their own authority. Redacted scan output does not prove revocation, and deletion from source does not remove prior exposure.

Return the reached gate, artifact/environment identities, evidence and pending operator actions.
