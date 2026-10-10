# Storage and deployment fit

Compare complete arrangements, not database brands. Establish whether mutable durable data is needed. Static content files may need no runtime database; transactional booking needs supported persistence/concurrency, not improvised JSON writes to remove a dependency.

For PostgreSQL, identify earned features, shared state, write/recovery needs or operating advantage. Ask which simpler arrangement fails. Popularity, 100 users and hypothetical growth settle none of these. Recommend simpler supported fit when no discriminating need exists; retain required complexity with its reason.

## Discriminating constraints

| Constraint | Establish |
| --- | --- |
| Writes | Peak overlap, duration, imports/jobs and actual contention; accounts are not writers. |
| Persistence | Durable location, restart/replacement/deploy behavior; temporary/container directories are not a plan. |
| Replicas | Which instances need coherent shared reads/writes; independent files do not supply them. |
| Features | Actual queries, constraints/integrations, not anticipated checklists. |
| Recovery | Acceptable loss/time and backup/restore owner, even for small deployments. |
| Operations | Expertise, access, updates, cost and migration burden. |

SQLite can fit application-local data in modest deployments. Evaluate writes/topology using [usage guidance](https://www.sqlite.org/whentouse.html); example capacities are not guarantees.

WAL permits readers alongside a writer while serializing writers. Consult [isolation](https://sqlite.org/isolation.html), keep transactions short and observe waits. Bounded retries expose failure rather than abolishing contention. Avoid slow remote work inside write transactions without justification.

Ordinary files should be local to the opening process. Direct multi-machine access raises locking/reliability concerns in [network guidance](https://www.sqlite.org/useovernet.html). Servers exposing domain operations over HTTP differ. Specialized remote stores need their own guarantees.

## Same audience, different contracts

These examples explain reasoning, not measured capacity.

**Club directory, roughly 100 members:** mostly reads, occasional edits, short import, one durable host and an owner accepting downtime/verified backups. Challenge PostgreSQL, Redis and broker separately. SQLite may meet persistence without a service; no described cache/broker requirement exists. Confirm transactions/storage/restore and keep database files outside public assets.

**Dispatch tool, roughly 100 operators:** replaced instances/workers need shared durable assignments. Managed client/server storage such as PostgreSQL is credible. Compare provider incumbents/expertise; ordinary managed storage may suffice without distributed machinery. Unsynchronized local files fail shared state.

**Small ephemeral form:** infrequent writes do not make temporary storage durable. Compare supported remote persistence with a durable host when hosting changes are authorized. Do not lose submissions because traffic is low.

**Existing PostgreSQL:** inspect purpose/burden. Retention may beat migration when state, recovery, cost and expertise fit. Otherwise include conversion, checks, cutover and rollback. Neither audience size nor fewer boxes alone authorizes moving data.

## Verify fit

Measure representative writes/jobs, transaction duration, contention, latency and failures, not read-only throughput alone. Preserve target/workload. Use supported consistent backups, restore in isolation and check application data. A live-file copy or volume alone does not prove recovery.
