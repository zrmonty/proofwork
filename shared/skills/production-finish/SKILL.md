---
name: production-finish
description: When preparing hosting, deployment artifacts, secret handling and recovery.
---

# Production finish

Prepare an operable release with artifact-bound evidence. Identify authority for cleanup, packaging, environment changes and deployment; readiness does not authorize publishing.

Use [impact-map](../impact-map/SKILL.md) for affected deployment contracts and
[challenge-review](../challenge-review/SKILL.md) for consequential release assumptions.

## Choose the destination

Inspect instructions, build/start paths, locks, configuration, persistence and the primary flow. Ask intended hosting unless known; resolve relevant budget, operator, traffic, writes, jobs and dependencies. Continue independent work while answers are pending; unknown hosting keeps host-dependent readiness incomplete.

Recommend the least demanding suitable deployment. Load [hosting and containers](references/hosting-and-containers.md) for tradeoffs and Docker work. Containers can provide a portable runtime or satisfy image-based hosting; they do not themselves create scalability. Respect a suitable existing choice and avoid speculative orchestration.

## Inspect real public delivery

Trace secrets and configuration through source, substitutions, public/static assets, browser bundles, source maps, image/build contexts, debug routes, errors and logs. Inspect the release artifact as well as tracked source; ignored files can enter delivery.

Load [exposure checks and response](references/exposure-and-response.md). Redact before scanner output reaches tools, transcripts or evidence. Record safe location, rule, capability and disposition without credentials, fragments or matching lines. Classify intentionally public identifiers using authoritative provider policy and actual access rules; uncertainty is not permission to publish values.

Remove real secret capabilities from delivery and rebuild. Deletion does not revoke an exposed credential. Authorized rotation/revocation remains separate; leave unavailable response pending and preserve public history unless history changes are authorized. An unresolved exposed capability blocks release readiness. Use [security-hardening](../security-hardening/SKILL.md) for deeper requested audits or demonstrated vulnerabilities.

For release preparation, read [delivery integrity](../security-hardening/references/supply-chain.md) and
[configuration parity](references/configuration-and-drift.md): connect resolved inputs to the built artifact and
classify effective environment differences. For consequential operational paths, read
[failure modes and runbooks](references/failure-modes-and-runbooks.md) and
[observability with the change](references/observability-with-change.md). Produce a short code-linked recovery note
and implement needed signals with the changed behavior using existing tooling. These lenses share one release record.

## Verify operation and rollout

Build and start the locked production artifact; exercise its primary flow. Fail safely for missing required configuration, preserve redacted diagnostics, and remove development paths only after checking consumers. Verify applicable authorization, cookies/proxies, TLS termination, exposure, scoped identities, limits, graceful shutdown, health and readiness with incumbent mechanisms.

For persistent data, verify restart/replacement survival, release migrations and an isolated representative backup restore. State recovery time and acceptable loss. Do not run destructive migrations or change retention incidentally. Check old/new instances, jobs and clients during rollout; distinguish reversible application promotion from irreversible data changes. Recovery needs stop criteria, artifact/data state and an owner.

When containers fit and local building is authorized, build, inspect and smoke-test the actual image. Missing daemons or denied execution remain gaps. Recheck combined-artifact changes.

Load [readiness gates](references/readiness-gates.md) for release decisions and [release observation](references/release-observation.md) for live checks or uncertain writes. Reconcile unknown effects before retrying; promote only with deployment authority.

## Return the reached release state

Return explicit ready-for-staging and ready-for-production decisions, then distinguish deployed from verified-live.
Link artifact/lock identities, parity differences, the recovery note and exercised log/metric/alert signals. List
residual risks with consequence, mitigation, owner, blocking gate and next check; unknowns remain pending.
Finish when scoped criteria pass with accountable dispositions. A clean scan proves only its inspected scope.

Write and link the reusable [systems outcome](../../contracts/systems-outcome.md); its reached state, gaps and owners must match the release record.
