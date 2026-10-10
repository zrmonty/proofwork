# Hosting and containers

Choose deployment from actual requirements and verify its artifact. Ask who maintains it/where it runs; clarify jobs, WebSockets, storage, duration, bursts, geography, accounts and cost. Verify current platform capabilities/prices from official documentation.

## Operating model

Static hosting needs public-output/routing inspection and external privilege boundaries. Managed services need build/start, secrets, persistence, restart and limits. Serverless needs durable state, duration/connection/cold-start/retry checks. Single servers need updates, firewall/TLS, supervision, restore and replacement ownership. Containers need configuration, storage, shutdown, health and network policy.

These are alternatives, not rankings. Preserve adequate existing hosting. User count establishes neither load nor reliability needs; justify each added service.

## Durable state and release

List database, uploads, queues, sessions and job progress with owners/storage guarantees. Never keep the only authoritative copy on disposable storage. SQLite can fit durable single-owner applications: assess contention, access and backup paths. Independent replicas cannot each create authoritative files; shared mounts do not solve coordination. Distributed writers need supported storage/coordination.

Restore representative backups into isolated destinations; check migrations, integrity and queries. Never overwrite live data for testing. Old images cannot reverse destructive schema changes. Verify shutdown/admission/in-flight effects within termination windows.

Where needed, plan compatible configuration/schema preparation, switch, health observation and later retirement. Agreed maintenance windows can be simpler than zero-downtime machinery. Test old/prepared, new/migrated and relevant mixed versions, including long-lived jobs/clients. Separate code rollback from forward repair/approved restore with known loss. Identify cutover, stop conditions and operator. Do not invent rollback SQL, restore live data or replay writes without authority and demonstrated models.

Readiness means serving required work, not process existence. Bounded probes avoid user-data mutation/disclosure. Distinguish startup/routing blockers from degraded features. Retain tested artifact identity, safe configuration shape and compatible data state through promotion; remote rebuilds need their own observed artifacts/checks.

## Minimal image

Inspect existing Docker/build configuration. Use production entrypoint, locked dependencies and maintained compatible base with resolved identity/update policy. Separate build/runtime stages when removing development tools without breaking required libraries.

Limit context/copies. Inspect .dockerignore negations and Dockerfile-specific rules: exclude credentials, .env, databases, backups, Git metadata and unrelated output appropriately. Copy only required output/safe examples. Use unprivileged identity unless justified, allow intended writes, and handle signals through the real entrypoint.

Build credentials use temporary mounts, never Dockerfile ARG/ENV, copies or command-line literals. Runtime secrets use protected configuration/mounts. Scripts can write mounted secrets into output: inspect that path and earlier layers, not just final filesystem. Follow [Docker build guidance](https://docs.docker.com/build/building/best-practices/) and [secret guidance](https://docs.docker.com/build/building/secrets/).

## Prove execution

When authorized/Docker available, build and record image/source identities. Review logs/config/layers locally before export; commands can emit secrets. Run with unique owned name, minimal permissions, isolated data and local-only ports. Supply protected test configuration; exercise readiness/representative flow, shutdown and required persistence across replacement. Preserve incumbent health mechanisms.

Clean only owned containers/artifacts, including on failure; never prune shared images, volumes or builders. Build-only proves packaging; unavailable daemon leaves runtime unverified. Publication, deployment, domains and public ports require effect authority.

Replicas require shared-state, session/job, persistence and coordination decisions. Add them for measured needs; images alone do not justify load balancers, database clusters or orchestration.
