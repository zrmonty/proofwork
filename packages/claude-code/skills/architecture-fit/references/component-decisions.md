# Component decisions

Use this reference when the proposed stack gains another service or deployment layer. Start from the behavior and the existing operating environment; a component earns its place when it solves a requirement better than a simpler arrangement.

| Proposed component | Requirement that can justify it | Simpler candidate to evaluate first | Failure or cost to account for |
| --- | --- | --- | --- |
| Separate service | Independent deployment, a meaningful security/failure boundary, or distinct owner | A module within the existing app | Network failure, versioned contracts, tracing and additional deployments |
| Cache | Representative query work misses the agreed target | Better query, index, pagination, or computed result within existing mechanisms | Stale data, invalidation, eviction and fallback under failure |
| Broker or task queue | Work must outlive the request and recover across failure, with explicit delivery semantics | Existing scheduler or persisted jobs in the app's current storage, if adequate | Duplicate effects, retries, poison jobs, monitoring and shutdown |
| Search engine | Required relevance, analysis, indexing or query behavior exceeds existing storage | Existing database search with representative queries | Index freshness, rebuilds and another sensitive-data surface |
| Container image | A target accepts containers and repeatable packaging helps deployment | Provider-supported runtime or existing deployment | Image updates, secret boundaries, runtime resources and persistent volumes |
| Container orchestrator | Required scheduling, fleet operations or availability that the team can operate | Existing managed app platform or a small host deployment | Cluster expertise, access control, upgrades and incident burden |

These are comparisons, not mandatory rejection rules. An established platform may make a managed queue easier than building jobs into a database. Conversely, do not implement a homemade delivery system merely to avoid one dependency. State the requested delivery and failure guarantees before deciding.

## A component must solve its own problem

“Scalable” is too broad to justify a cache, broker, or orchestrator. Name the dimension: concurrent requests, overlapping writes, job throughput, availability, geographic latency, or team deployment independence. A new container image addresses packaging; it does not settle shared state, availability, or throughput. Several app replicas require a storage and coordination arrangement compatible with their behavior.

For a small event signup system, start with the app's existing runtime and relational queries. If email delivery must survive request failure, that requirement may earn a persisted job mechanism. Define duplicate-delivery tolerance and retry behavior. Do not attach a broker, cache, search cluster and service mesh because a future audience might grow.

For a team already operating an appropriate managed platform, use its demonstrated mechanisms rather than introducing a smaller but unfamiliar deployment path. The decision optimizes the actual team's burden, not the component count in a diagram.

## A measured upgrade, without speculative layers

State the current limitation and an observable trigger tied to the user's target. For example: measure the booking write path at the expected peak, including the import job; reopen storage if observed contention prevents the agreed response time after direct transaction/query improvements. If no target exists, ask for it or report exploratory measurements honestly.

Keep the current implementation direct. Put query ownership in an existing module, preserve schema migrations, and isolate external calls from pure domain decisions. These seams make changes understandable without pretending that different databases or service transports are interchangeable. Record the likely migration risks and checks; implementing adapters for unused alternatives does not remove those risks.
