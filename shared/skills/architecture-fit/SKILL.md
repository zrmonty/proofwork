---
name: architecture-fit
description: Choose project architecture and tools from workload, hosting, reliability, and maintainer needs; challenge popularity defaults and unnecessary infrastructure before implementation.
---

# Architecture fit

Recommend the smallest architecture that satisfies the actual requirements and can be operated by the people responsible for it. A familiar tool is a candidate, not a conclusion. A smaller tool is also a candidate, not a virtue that overrides durability, security, or workload needs.

Use this skill for a new project's architecture, a consequential tool choice, or a proposed infrastructure expansion. For a focused bug fix, preserve the demonstrated stack unless the defect requires an architectural decision. Recommendations do not authorize dependency installation, data migration, deployment, or a rewrite.

## Establish what the system must do

Inspect the repository and existing deployment evidence before asking questions. Identify the product's main workflows, data ownership, current components, and anything the user has already chosen. Separate a hard requirement from a preference and an untested assumption. Ask why a proposed technology is necessary: which behavior, constraint, or operational obligation does it satisfy?

Ask the material unanswered questions early, grouped so the user can answer naturally. Usually these concern the workload and who will operate it: how people use the product, what writes overlap, where the app runs, what data must survive, and how much maintenance the team can afford. A useful opening might be: “Will these people mostly read and occasionally submit forms, or will several processes write continuously? Where will the app run, and who will handle backups and recovery?” Do not administer a questionnaire about requirements that cannot change the decision. Continue repository inspection or a provisional comparison while awaiting answers; label dependent recommendations conditional.

Registered users, simultaneous sessions, concurrent writes, and background jobs describe different loads. About 100 users can make SQLite a sensible candidate; it cannot settle the choice. Consider peak overlap and transaction duration, data volume and growth, query needs, batch jobs, acceptable delays, and any availability or recovery target. Use representative measurements when the decision turns on capacity rather than inventing a per-user limit.

## Compare credible options

Include the existing tool if it already works, the least complex adequate alternative, and another option only when it addresses a material requirement. Evaluate each against the same constraints. Count the whole operating burden: development effort, hosting cost, persistent storage, updates, migrations, access control, backup and tested restore, incident recovery, and the owner's expertise. A managed service can be simpler for this team than a smaller self-operated component.

Read [storage and deployment fit](references/storage-fit.md) when choosing a database or changing how persistent data is hosted. It distinguishes modest local writes from shared remote persistence, and compares projects with the same user count but different workloads. Verify version- or provider-specific claims in official documentation before relying on them.

For databases, consider actual write contention, transaction boundaries, required query/data features, and the topology of the application and storage. SQLite has one writer per database at a time; WAL permits reader/writer overlap but does not create concurrent writers. A web client talking to an application server is different from several machines directly opening one database file. Persistent local storage and a workable recovery process matter as much as the SQL API. See [SQLite isolation](https://sqlite.org/isolation.html) and [network-storage cautions](https://www.sqlite.org/useovernet.html).

Apply the same reasoning beyond databases. Read [component decisions](references/component-decisions.md) when services, caches, queues, search engines, or container orchestration are proposed. Prefer clear modules in one deployable application until independent deployment, failure isolation, ownership, or another demonstrated requirement earns the extra boundary. Keep domain decisions pure and effects owned; neither requires a distributed system.

## Decide and preserve an affordable next step

Give a recommendation with reasons, not an unranked catalog. Identify the requirement that rules out each serious alternative. If an explicit user choice fits, support it; if it conflicts with a requirement, explain the conflict and offer the smallest resolution. Do not replace a working database merely to conform to this skill's examples.

Record a short decision in the project's existing format, or supply a draft if documentation changes are outside scope:

```text
Decision and scope:
Facts, assumptions, and unresolved questions:
Options considered, including the incumbent:
Choice and requirements it satisfies:
Tradeoffs and operational owner:
Persistence, backup/restore, and failure behavior:
Evidence observed; checks still needed:
Condition that would reopen the decision:
Smallest plausible migration step:
```

Make the reopening condition observable: sustained write waits that miss the agreed response target, a real need for multiple independently writable replicas, or a required feature absent from the chosen tool. State how to observe it and whose target it serves. Without a supplied target, identify the measurement needed rather than inventing one. “When we get big” is not a scaling trigger.

A migration seam can be a contained query module, versioned schema, and explicit transactions. Do not build a universal storage interface or duplicate implementations for a hypothetical switch. Name semantic work that a switch would require, such as changed SQL, locking assumptions, data conversion, or cutover and rollback. Container packaging does not by itself solve shared persistence or make stateful replicas safe.

## Return an honest recommendation

Return the selected architecture, the constraints that chose it, the components deliberately omitted, and a practical verification or operating plan. Distinguish observed behavior from reasoned expectation. Missing hosting information leaves the hosting-dependent choice provisional; missing representative load evidence leaves capacity unverified. Fewer components are a useful result only when the required behavior and recovery obligations remain covered.
