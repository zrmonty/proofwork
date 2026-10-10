# Storage and deployment fit

Use this reference when a database choice depends on writes, storage topology, or the host. Compare complete operating arrangements rather than brand names.

## The discriminating questions

| Constraint | What to establish | Consequence for the decision |
| --- | --- | --- |
| Writes | Peak overlapping transactions, their duration, imports and background work | User count alone says little about contention; long write transactions can delay other writers. |
| Persistence | Where durable data lives; behavior on restart, replacement and deploy | A writable container directory or temporary function filesystem is not a persistence plan. |
| Replicas | Which instances must read or write shared data, and how | Independent local files do not become a coherent shared database by running more instances. |
| Data features | Concrete queries, constraints, integrations and required extensions | Check the feature actually needed rather than choosing a database from an anticipated checklist. |
| Recovery | Acceptable data loss and recovery time; backup and restore owner | A small deployment still needs recoverable data; the simplest acceptable plan may use a managed service. |
| Maintenance | Team familiarity, access administration, upgrades and cost | A demonstrated incumbent can beat a nominally smaller alternative after migration and operating costs. |

SQLite is appropriate for application-local data in many modest web deployments. Its official [usage guidance](https://www.sqlite.org/whentouse.html) recommends evaluating writer concurrency and storage arrangement. Treat examples of traffic capacity as context, never a guarantee for this project's workload.

With WAL, readers can proceed alongside a writer, but writers remain serialized. Read [the isolation explanation](https://sqlite.org/isolation.html) before treating WAL as a contention fix. Design short transactions and observe actual waits; retries need bounded failure behavior, not a promise that contention vanishes. Do not perform slow remote work inside a write transaction without a justified reason.

Place an ordinary SQLite database on storage local to the process opening it. Many machines directly accessing a shared database file introduce filesystem locking and reliability concerns described in [SQLite's network-storage guidance](https://www.sqlite.org/useovernet.html). An application server exposing domain operations over HTTP is a different architecture. A specialized remote database service must be evaluated on its own documented guarantees, not assumed equivalent to a local file.

## Same audience size, different choices

These examples illustrate reasoning, not executed capacity tests.

**A club directory for roughly 100 members.** Members read the directory and occasionally update their details. One administrator performs a short weekly import. A single app runs on a host with durable local storage; a maintainer accepts brief downtime and owns scheduled backups and restore checks. Recommend a modular application with SQLite as a strong candidate. Confirm transaction behavior and the host's persistence contract; keep database files out of public/static directories. No cache or broker is justified by the described workload. A restore exercise remains required before making a recovery claim.

**A dispatch tool for roughly 100 operators.** Independent application instances must keep accepting updates during another instance's replacement, and several workers write shared assignments. The requirement is shared durable writes across instances, not merely 100 accounts. A managed client/server relational database, such as PostgreSQL, is a credible choice. Compare it with the provider's existing supported database and team expertise; do not add a distributed database if an ordinary managed service satisfies the requirement. Running SQLite in each instance with no synchronization fails the shared-state contract.

**A small form on ephemeral hosting.** Writes are infrequent, but instances can disappear and have no supported durable local volume. Ordinary local SQLite persistence is not an adequate deployment plan. Compare supported remote storage with a single durable host if changing hosting is within scope. Do not quietly save submissions to temporary disk because traffic is low.

**An established application already using PostgreSQL.** A 100-person audience supplies no reason to migrate it to SQLite. If the current service is affordable, understood, backed up, and meets requirements, keeping it can be the least complex decision. A migration needs a concrete benefit large enough to justify conversion, verification, cutover and rollback.

## Verification before a capacity or recovery claim

Use the representative interaction, including writes and jobs, rather than a synthetic read-only throughput number. Observe latency and failures alongside transaction duration and contention where relevant. Preserve the agreed target and workload in the decision record. Run backup and restore through the chosen tool's supported mechanism and check application-level data afterwards. Do not claim that copying a live database file or having a volume proves recoverability; use the database's documented consistent-backup procedure.
