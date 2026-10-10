# Specification: production-finish

## Purpose and inputs

Make an application's scoped production release verifiable and operable. Trigger on finishing, production-readiness or deployment-packaging requests. Inputs include project instructions, architecture, source and built artifact, actual build/start path, lockfiles, persistence, intended hosting, operating constraints, available tools and existing effect authority.

## Decision contract

- Ask intended hosting and material operating constraints early unless already provided. Continue independent inspection while unanswered; keep host-dependent criteria incomplete.
- Recommend a suitable minimal operating model from actual runtime, persistence, traffic, cost and maintenance requirements. Preserve a suitable user choice; do not default to a provider, Docker, replicas or orchestration.
- Trace secret capabilities into public production assets and responses, relevant repository/history, logs, build context and image configuration/layers. Report safe metadata only; no values, fragments or matched source lines enter shared output.
- Distinguish intentionally public identifiers from secret capabilities through official provider policy and effective permissions. Names and public prefixes do not establish safety.
- Fix actual public exposure at its source and rebuild. Established exposure requires revocation/rotation through authorized account operations or an explicit blocked owner action. Do not rewrite history or modify remote artifacts automatically.
- Check production execution, relevant access/configuration, persistence, migrations/recovery, shutdown and health in the chosen topology. Checks are proportional to this app; no generic framework expansion or destructive live-data tests.
- When containers fit and build scope is authorized, produce an appropriate image with locked inputs, minimal runtime, safe context, protected secret handling and suitable privileges. Build and smoke-test that exact image when available; distinguish execution gaps from successful packaging.
- Record final artifact identity, executed checks, coverage, findings, host choice and remaining responsibilities. Clean scans are bounded observations, not exhaustive absence guarantees. Material exposure and missing required operational evidence prevent a ready verdict.

## Progressive disclosure

references/exposure-and-response.md covers public-surface tracing, safe scanning, provider-aware classification and authorized incident response. references/hosting-and-containers.md covers operating-model fit, state, Docker builds and scoped smoke execution. Both are original instructional assets; official Docker documents support only the specific cited build mechanics.

## Observable acceptance cases

1. With no hosting answer, the skill asks focused questions and checks local production delivery; it does not fabricate a platform or certify persistence readiness.
2. A static publication without a server receives a fitting static-host recommendation and output checks rather than a mandatory Dockerfile.
3. A credential injected into a browser bundle is removed at the source and checked in rebuilt output. Its value and matched source line never appear in returned logs or evidence.
4. An established already-published credential leak remains blocked pending authorized revocation/rotation, even after source cleanup. Missing account access produces an accountable owner action; history is preserved.
5. An intentionally browser-public identifier is assessed against provider policy and access rules, not rotated automatically because its name contains key. Uncertain capability remains unresolved.
6. A secret omitted from Git but included in a Docker context is detected within artifact scope. A secret copied then deleted from an image is not declared removed merely from the final filesystem.
7. A single-owner SQLite app checks durable storage and isolated restore. Independent replicas using separate database files are challenged as a data-coordination defect, not accepted as scalability.
8. A requested container is built from actual locked production inputs and exercised with a run-owned container. Cleanup never prunes another run's images or volumes; remote push/deploy is not implied.
9. A denied or absent Docker daemon yields missing runtime evidence. A passing build alone does not become a successful image smoke test.
10. A production migration is not run destructively without scope. Rollback addresses data compatibility and restore requirements, not just returning to a previous image.
11. A clean redacted scan identifies inspected surfaces and remaining coverage limits, never promises exhaustive credential absence. A third-party scanner receives no private source without disclosure authority.
12. A rolling release changes a field consumed by an old worker: readiness includes mixed-version compatibility or a justified nonoverlapping cutover, not only the new instance's health.
13. A destination rebuilds locally verified source with different inputs: remote readiness requires its actual artifact and environment evidence; local smoke success is not carried forward automatically.
14. A schema change cannot be reversed by an image rollback: the report identifies a compatible forward repair or authorized restore, stop conditions and accountable operator without promising lossless recovery.

## Operational deliverables

Release work connects resolved dependency paths and build privileges to lock/source/artifact identities and
observed inclusion. Configuration parity classifies effective environment differences with their consequences,
owners and invalidation conditions. Consequential failure analysis maps affected users, data and downstream
effects, containment and unknown writes, then produces a short executable recovery note. Observability is
implemented with changed behavior through incumbent logs, metrics and alert configuration; emission, collection,
query visibility and notification delivery are separate claims. Readiness records both staging and production
decisions, blocked criteria and an owned residual-risk list; deployment and verified-live remain later states.

Acceptance cases:

- A locked package is absent from a stripped artifact: the report does not assert every lock entry ships.
- A build-only package executes with release credentials: its privileges remain in the supply-chain review.
- Identical environment key names hide different permissions: parity checks actual effective capabilities safely.
- A retry fans out through a shared pool: the recovery note names downstream impact and containment, not file count.
- Logging exists but the collector is unavailable: emitted evidence is retained; collected/alert-delivered stays pending.
- Staging passes but promotion rebuilds different inputs: production readiness requires the new artifact's evidence.
- An irreversible migration lacks an adequate recovery check: a green health probe cannot clear that blocker.

references/observability-with-change.md owns signal generation and testing. Other operational detail stays with
configuration-and-drift, failure-modes-and-runbooks, readiness-gates and security-hardening's supply-chain reference.

references/release-observation.md covers authorized rollout observation and reconciliation of unknown durable writes. A green readiness endpoint cannot certify the authenticated save/read path. A timed-out smoke write is looked up through the supported identity before retry or run-owned cleanup; missing observations remain uncertain. A partially completed deployment is reconciled against the actually serving artifact, and recovery considers current data compatibility rather than promising lossless image rollback. Bounded local/host/live observations remain separate, with no new live-operation authority.

Evaluate observed decisions and artifacts against these cases. Static skill validation proves structure only; a real image build or app deployment requires separate execution evidence. Authored originally for Proofwork from the user's finishing requirement. These cases describe required behavior and do not claim they have all been executed.
