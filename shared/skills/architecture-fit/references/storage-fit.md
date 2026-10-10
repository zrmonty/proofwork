# Storage and deployment fit

Use this reference when a database choice depends on writes, storage topology, or the host. Compare complete operating arrangements rather than brand names.

## Challenge the storage requirement first

Before choosing a database, establish whether the product needs mutable persistent data and what guarantees it needs. A static publication with content managed in files may need no runtime database. A transactional booking flow requires a supported persistence and concurrency model; do not replace it with ad hoc JSON file writes merely to remove a dependency. Existing platform storage, an embedded database and a client/server service are candidates only when their actual contracts fit.

If PostgreSQL is proposed, identify its earned reason: a concrete data feature, supported shared persistence, write behavior, recovery arrangement or existing operating advantage. Ask which simpler arrangement fails that requirement. “Standard choice,” “100 users” and “room to scale” do not settle it. If no discriminating need emerges, recommend a simpler adequate storage/deployment arrangement and name its obligations. If a reason does emerge, support PostgreSQL with that reason rather than apologizing for complexity that is needed.

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

**A club directory for roughly 100 members.** Members read the directory and occasionally update their details. One administrator performs a short weekly import. A single app runs on a host with durable local storage; a maintainer accepts brief downtime and owns scheduled backups and restore checks. If the proposal contains PostgreSQL, Redis and a broker, challenge all three: what needs shared server-side storage, caching or durable asynchronous delivery? The described data is mutable, so persistence is needed; a modular app with SQLite may meet it without a separate database service. Confirm transactions, persistence and recovery rather than choosing by member count. No cache or broker is justified by the described workload. Keep database files out of public/static directories; restore evidence remains required.

**A dispatch tool for roughly 100 operators.** Independent application instances must keep accepting updates during another instance's replacement, and several workers write shared assignments. The requirement is shared durable writes across instances, not merely 100 accounts. A managed client/server relational database, such as PostgreSQL, is a credible choice. Compare it with the provider's existing supported database and team expertise; do not add a distributed database if an ordinary managed service satisfies the requirement. Running SQLite in each instance with no synchronization fails the shared-state contract.

**A small form on ephemeral hosting.** Writes are infrequent, but instances can disappear and have no supported durable local volume. Ordinary local SQLite persistence is not an adequate deployment plan. Compare supported remote storage with a single durable host if changing hosting is within scope. Do not quietly save submissions to temporary disk because traffic is low.

**An established application already using PostgreSQL.** Examine its purpose and real burden instead of skipping the question because it exists. If it is affordable, understood, backed up and provides required shared persistence, explain why retaining it beats a migration. If it adds avoidable administration and no required capability beyond a simpler fit, propose that alternative with conversion, verification, cutover and rollback costs. Neither audience size nor a desire for fewer components alone justifies moving production data.

## Verification before a capacity or recovery claim

Use the representative interaction, including writes and jobs, rather than a synthetic read-only throughput number. Observe latency and failures alongside transaction duration and contention where relevant. Preserve the agreed target and workload in the decision record. Run backup and restore through the chosen tool's supported mechanism and check application-level data afterwards. Do not claim that copying a live database file or having a volume proves recoverability; use the database's documented consistent-backup procedure.
