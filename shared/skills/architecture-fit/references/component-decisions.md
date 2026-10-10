# Component decisions

Use when a proposal adds services or deployment layers. Each component must solve a requirement better than a complete simpler arrangement. Review the stack, not merely its database, and return keep, replace, omit or defer decisions. Popularity and unspecified growth do not earn infrastructure.

| Component | Earned requirement | Simpler candidate | Costs |
| --- | --- | --- | --- |
| Frontend framework | Required interaction/rendering/navigation | Static/server-rendered pages or incumbent | Bundles, build tools, state, maintenance |
| ORM/query layer | Useful query/schema/migration ownership | Existing driver with contained queries | Mapping semantics, hidden queries, abstraction |
| Extra API | Required clients/contracts/independent delivery | Existing endpoints/server-owned calls | Authorization duplication, versions, serialization |
| Service | Real owner, deployment, failure/security boundary | Existing-app module | Network failures, tracing, contract/deployment versions |
| Cache | Representative work misses target | Query/index/pagination/per-operation reuse | Invalidation, eviction, stale data, failure |
| Broker/queue | Required durable work/delivery guarantees | Incumbent scheduler or persisted jobs if adequate | Retries, duplicates, poison jobs, shutdown |
| Search engine | Necessary relevance/analysis/indexing beyond storage | Incumbent database search | Freshness, rebuilds, sensitive-data surfaces |
| Container image | Suitable target/repeatable runtime packaging | Provider runtime/existing deployment | Updates, secrets, resources, persistence |
| Orchestrator | Required scheduling/fleet/availability with operator | Managed platform/small host | Expertise, access, upgrades, incidents |

These are comparisons, not mandatory rejections. A managed queue can be simpler than homemade database jobs. Define failure/delivery semantics first; custom replacements count as complexity.

## Walk complete behavior

Name the scale dimension: overlapping writes, requests, jobs, availability, geography or independent delivery. Packaging does not solve shared state/availability. Replicas need compatible storage/coordination.

Walk an action and consequential failure through serious alternatives. For booking, locate availability enforcement, recording, confirmation failure and retry identity. Compare equal authorization, retention, recovery and ownership. A smaller diagram is inadequate if guarantees become hidden synchronization or incident repair.

Choose the cheapest falsifying observation: a query, durable-host contract, interrupted job or restore. Avoid building several stacks unnecessarily. Missing evidence makes fit provisional.

## Examples and reopening conditions

A one-editor timetable may use content files/static delivery without runtime database, state framework, cache or orchestrator. Live RSVP writes reopen persistence/interaction. An established complex editor may be simpler with its framework than bespoke DOM/state machinery.

A signup app can start with incumbent runtime/relational queries. Email surviving request failure may earn persisted jobs with defined retries/duplicates; it does not earn search infrastructure or a broker. Existing managed platforms can beat unfamiliar smaller deployments.

A managed database can remain when transactions/recovery cost less owner effort than replacement. A newsletter can omit its queue when a provider owns required durable delivery; new application-owned durable jobs change that reasoning.

Tie upgrades to observed limits/user targets: measure peak booking writes with imports, improve direct queries/transactions, and reopen storage if contention still misses agreed response time. Without targets, label measurements exploratory.

Keep direct query ownership, versioned schemas and explicit effect boundaries. Name conversion, cutover and rollback without universal adapters or dormant alternatives. Fewer components help only when complete behavior remains covered.
