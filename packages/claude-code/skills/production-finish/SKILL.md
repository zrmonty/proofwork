---
name: production-finish
description: When preparing hosting, deployment artifacts, secret handling and recovery.
---

# Production finish

Prepare a verified production artifact, suitable hosting plan and accountable operational responsibilities. A development server or built image does not establish deployment readiness. Identify whether the request authorizes local cleanup, packaging, environment changes or deployment; building does not authorize publishing.

Use [impact-map](../impact-map/SKILL.md) for affected deployment contracts and
[challenge-review](../challenge-review/SKILL.md) for consequential release assumptions.

## Choose the destination

Inspect instructions, architecture, locked dependencies, production build/start paths, configuration, persistence and the primary flow. Ask how the user will host the app unless already known, resolving only decision-relevant budget, maintenance ownership, traffic, concurrent writes, jobs and external services. Continue independent local work while answers are pending; unknown hosting keeps host-dependent readiness incomplete.

Recommend the least demanding suitable deployment. Load [hosting and containers](references/hosting-and-containers.md) for tradeoffs and Docker work. Containers can provide a portable runtime or satisfy image-based hosting; they do not themselves create scalability. Respect a suitable existing choice and avoid speculative orchestration.

## Inspect real public delivery

Trace secrets and configuration through source, substitutions, public/static assets, browser bundles, source maps, image/build contexts, debug routes, errors and logs. Inspect the release artifact as well as tracked source; ignored files can enter delivery.

Load [exposure checks and response](references/exposure-and-response.md). Redact before scanner output reaches tools, transcripts or evidence. Record safe location, rule, capability and disposition without credentials, fragments or matching lines. Classify intentionally public identifiers using authoritative provider policy and actual access rules; uncertainty is not permission to publish values.

Remove real secret capabilities from delivery and rebuild. Deletion does not revoke an exposed credential. Authorized rotation/revocation remains separate; leave unavailable response pending and preserve public history unless history changes are authorized. An unresolved exposed capability blocks release readiness. Use [security-hardening](../security-hardening/SKILL.md) for deeper requested audits or demonstrated vulnerabilities.

For configuration changes or environment mismatches, read [configuration and drift](references/configuration-and-drift.md). For consequential operational paths, read [failure modes and runbooks](references/failure-modes-and-runbooks.md) and update the actual code-linked recovery procedure. For build/dependency trust, read [delivery integrity](../security-hardening/references/supply-chain.md). These are conditional lenses of this release, not new coordinators.

## Verify operation and rollout

Build and start the locked production artifact; exercise its primary flow. Fail safely for missing required configuration, preserve redacted diagnostics, and remove development paths only after checking consumers. Verify applicable authorization, cookies/proxies, TLS termination, exposure, scoped identities, limits, graceful shutdown, health and readiness with incumbent mechanisms.

For persistent data, verify restart/replacement survival, release migrations and an isolated representative backup restore. State recovery time and acceptable loss. Do not run destructive migrations or change retention incidentally. Check old/new instances, jobs and clients during rollout; distinguish reversible application promotion from irreversible data changes. Recovery needs stop criteria, artifact/data state and an owner.

When containers fit and local building is authorized, build, inspect and smoke-test the actual image. Missing daemons or denied execution remain gaps. Recheck combined-artifact changes.

Load [readiness gates](references/readiness-gates.md) for release decisions and [release observation](references/release-observation.md) for live checks or uncertain writes. Reconcile unknown effects before retrying; promote only with deployment authority.

## Return the reached release state

Report hosting rationale, changes, artifact identity, executed checks/environment, resolved findings and pending answers, credentials, restore checks or external actions. Distinguish locally verified, host-ready, deployed and verified live states. Finish only when scoped requirements pass and material issues have accountable dispositions. A clean scan is bounded evidence, not exhaustive security certification.
