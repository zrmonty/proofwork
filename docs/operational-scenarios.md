# Worked operational scenarios

These scenarios are illustrative decision and verification procedures, not reports of executed deployments or measured performance. Replace the stated assumptions with project evidence. A recommendation does not grant permission to migrate, publish, rotate credentials or create live effects.

## Invoice tracker: make infrastructure earn its place

**Outcome:** roughly 100 account holders can save invoices, view totals and download records. Assume one maintainable application, a durable single-server destination, short transactions, occasional scheduled reminders and one operator. Account count alone establishes no storage capacity.

Use [architecture-fit](../shared/skills/architecture-fit/SKILL.md) to challenge a proposed database service, cache, broker and separate automation service. Compare the incumbent with a single application using embedded storage and scheduled work, and a managed relational service. Keep the language already supported by the operator unless [language-fit](../shared/skills/language-fit/SKILL.md) finds a workload or deployment mismatch.

| Requirement | Measurement procedure | Decision consequence |
|---|---|---|
| Concurrent writes | Replay the expected peak overlapping invoice saves and reminder updates; report latency distribution, lock waits and failures. | Embedded storage remains provisional until the actual transaction pattern meets the agreed target. |
| Data survival | Replace the application instance, then restore a representative backup into isolated storage and verify totals and invoice retrieval. | Disposable-only storage excludes the embedded arrangement. |
| Operational burden | Record provider cost, backup/update tasks, operator time and migration effort for each arrangement. | A managed service may be simpler even with more components. |
| Reminder reliability | Interrupt processing after an external send and before recording success; reconcile via supported operation identity. | A scheduler suffices only if its durable progress and uncertain-effect handling meet the requirement. |

Expected artifacts: a decision record with facts/unknowns, an equivalent load fixture, raw local timings plus a sanitized summary, restore evidence, and dispositions for each proposed component. Thresholds come from the owner; do not infer them from this example. Reopen the decision if measured contention, deployment topology, recovery obligations or required data features invalidate it. Do not switch an adequate incumbent merely to shrink the diagram.

For a consequential unresolved assumption, a configured independent challenger may propose a falsifying test within an agreed time/spend cap. Record actual model identities and limitations. Review votes cannot substitute for the write/load/restore observations.

## Invoice release: distinguish packaged, staged and live

**Outcome:** deliver the accepted invoice application to an image-based host without exposing credentials or losing invoices. Assume packaging is authorized; live promotion still needs existing authority. Use [production-finish](../shared/skills/production-finish/SKILL.md) and its [readiness gates](../shared/skills/production-finish/references/readiness-gates.md).

1. Build locked production output and the image. Record source and image identities. Inspect static assets, source maps, build context, layers and redacted logs for capabilities. Verify runtime secrets arrive through the selected protected mechanism, not browser bundles or image build arguments.
2. Run the actual image with local-only ports and isolated data. Save/retrieve an invoice through authentication, exercise missing configuration and graceful shutdown, replace the container and verify persistence. Restore a representative backup separately and check totals. Record measured restore time and backup age; compare with the owner's recovery goals.
3. In authorized staging, deploy the same artifact. Check real proxy/cookie behavior, durable mounts, job ownership and migration compatibility. Rehearse a dependency failure and locate the failed operation through safe request/job identifiers. Assign alert and recovery ownership; document staging differences.
4. Before authorized promotion, record the migration's reversibility, cutover owner, observation window, stop criteria and supported recovery. If an old artifact cannot read the new schema, label image rollback insufficient. Do not invent reverse migrations or overwrite live data for a drill.
5. After authorized promotion, confirm the serving artifact through real routing. Use an authorized nonmutating observation or owned synthetic invoice flow. If a save times out, reconcile durable state before retrying. Observe the agreed error/latency window and report propagation/sampling limits.

Expected artifacts: artifact manifest, sanitized exposure findings, local/staging/live gate table, migration compatibility record, isolated restore results, operational runbook and unresolved effects with owners. A blocked deployment leaves a useful locally verified artifact; it does not become “verified live.” Credential exposure requires separately authorized replacement and revocation, with consumer verification. Removing the value from the current image does not invalidate earlier copies.

## Reminder-job change: produce the operator handoff

Assume reminders call a provider, then persist delivery state; an existing scheduler, structured logger and metrics
collector are available. This is an illustrative workflow, not executed notification or recovery evidence.

Bind the chosen provider client and transitive resolved versions to the lock digest and built image inventory.
Record build-only inputs separately. Compare local/staging/live provider endpoint classification, credential
presence/validation, timeout, retry budget, worker ownership and schema compatibility without exporting values.
An intended sandbox endpoint difference still needs a contract check; unknown production permissions stay pending.

Map the partial-failure boundary: provider accepts the send but the response times out. Retrying can duplicate a
reminder, and retry fan-out can exhaust a shared worker pool. Identify affected jobs/users, durable operation IDs,
provider lookup capability and the containment action: pause the affected queue while reconciliation runs.

Generate logs for attempt category, safe operation ID and known/unknown outcome; counters for resolved outcomes;
queue-age and durable-progress metrics. Keep IDs out of metric labels. Derive alert windows and thresholds from
the agreed reminder deadline and measured normal behavior. Route a sandbox alert only with existing authority;
an emitted counter cannot prove collector visibility or operator notification.

Write a short recovery note pointing to actual pause/reconcile/resume commands and code. Rehearse synthetic
timeout and replacement, inspect durable state before retry, and verify duplicate prevention and resumed progress.
If provider lookup is unavailable, unknown sends require an owned reconciliation decision; invent no safe replay.

Return ready-for-staging after the local artifact and required checks pass. Return ready-for-production only when
required environment, alert and recovery checks pass with no blockers. A residual-risk row for unavailable
provider lookup identifies duplicate-send consequence, affected jobs, containment, owner, blocking gate and next
verification. Deployment and live verification remain separate observations.
