---
name: architecture-fit
description: Challenge proposed and existing architecture for unnecessary complexity; require concrete reasons for each major tool, compare simpler adequate alternatives, and choose from actual project needs rather than popularity or habit.
---

# Architecture fit

Read [exit cost and operating ownership](references/exit-cost-and-ownership.md) when alternatives look equally capable, provider dependence is material or portability is offered as the main justification. Compare real export/exit obligations and responsible operators without building unused adapter layers.

Start by asking what complexity this project actually needs. Do not accept PostgreSQL, a frontend framework, an ORM, Redis, a broker, microservices or container orchestration just because they are familiar, popular or already written in a proposal. Each major component must earn its place by satisfying a concrete requirement better than a simpler adequate arrangement.

Recommend the least burdensome complete architecture the responsible people can operate. Challenge the need for the component before comparing brands: does the project need a database, a separate backend or a cache at all? A smaller tool is not automatically better, and fewer dependencies do not justify building a complex replacement yourself. Compare total development and operating effort, not the appearance of the stack diagram.

Use this skill for a new project's architecture, a consequential tool choice, or a proposed infrastructure expansion. For a focused bug fix, preserve the demonstrated stack unless the defect requires an architectural decision. Recommendations do not authorize dependency installation, data migration, deployment, or a rewrite.

## Establish what the system must do

Inspect the repository and existing deployment evidence before asking questions. Identify the product's main workflows, data ownership, current components, and anything the user has already chosen. Separate a hard requirement from a preference and an untested assumption. Audit the proposed stack and relevant incumbent components, not just its database. For each major choice, identify the behavior it supports, its extra maintenance or failure burden, a simpler credible arrangement and what would fail without it. Popularity, habit and unspecified future scale are not requirements.

When PostgreSQL appears, ask the substantive question: “Why does this project need a separate database service? Which requirement would a simpler supported store fail?” Investigate shared writes, required data features, persistence and recovery rather than presuming an answer. Apply the same test to a framework, ORM, queue, cache, API layer and hosting setup. Use repository evidence to answer what you can; ask the user only about unresolved facts that change the decision. Do not turn every dependency into a ceremonial interrogation.

Ask the material unanswered questions early, grouped so the user can answer naturally. Usually these concern the workload and who will operate it: how people use the product, what writes overlap, where the app runs, what data must survive, and how much maintenance the team can afford. A useful opening might be: “Will these people mostly read and occasionally submit forms, or will several processes write continuously? Where will the app run, and who will handle backups and recovery?” Do not administer a questionnaire about requirements that cannot change the decision. Continue repository inspection or a provisional comparison while awaiting answers; label dependent recommendations conditional.

Registered users, simultaneous sessions, concurrent writes, and background jobs describe different loads. Audience size is context, not a database recommendation. Consider peak overlap and transaction duration, data volume and growth, query needs, batch jobs, acceptable delays, and any availability or recovery target. Use representative measurements when the decision turns on capacity rather than inventing a per-user limit.

## Compare credible options

Include the existing tool, the least complex adequate alternative and another option only when it addresses a material requirement. Treat “use no additional component” as an option when existing code or a simpler delivery model can meet the need. Evaluate equivalent requirements, including development effort, hosting cost, persistent storage, updates, migrations, access control, backup and tested restore, incident recovery, and the owner's expertise. A managed service can be simpler for this team than a smaller self-operated component.

For each consequential component, provide a brief disposition: keep with its demonstrated reason, replace with a named simpler fit, omit because its requirement is absent, or defer pending a specific unknown. A short explanation can cover a small task; a larger stack benefits from a compact decision table. Do not return an unchanged popular stack with a vague assurance that it is scalable. Make the simpler recommendation concrete enough to implement and explain what behavior it still covers.

Read [storage and deployment fit](references/storage-fit.md) when choosing a database or changing how persistent data is hosted. It distinguishes modest local writes from shared remote persistence, and compares projects with the same user count but different workloads. Verify version- or provider-specific claims in official documentation before relying on them.

For persistence, compare the actual read/write contract, transaction boundaries, query/data features, deployment topology and recovery obligations. Do not choose a product first and retrofit requirements to defend it. A file-backed store, existing platform service or client/server database must be evaluated on its own documented guarantees and total burden. Read the storage reference for the constraints of each relevant arrangement; a smaller deployment that loses required durability or coordination is not an adequate alternative.

Apply the same reasoning beyond databases. Read [component decisions](references/component-decisions.md) when services, caches, queues, search engines, or container orchestration are proposed. Prefer clear modules in one deployable application until independent deployment, failure isolation, ownership, or another demonstrated requirement earns the extra boundary. Keep domain decisions pure and effects owned; neither requires a distributed system.

## Decide and preserve an affordable next step

For a consequential choice, use the component reference's end-to-end walkthrough: locate every required responsibility in the simplest complete arrangement, including its meaningful failure path. Identify the cheapest observation that could disprove the recommendation. Hidden custom mechanisms count as complexity; missing decisive evidence makes the choice conditional rather than automatically favoring the familiar stack.

Give a recommendation with reasons, not an unranked catalog. Identify the requirement that rules out each serious alternative. Challenge preferences with the same evidence test, while respecting a genuine tool mandate and its constraints. For an existing stack, examine whether the burden is still justified and compare the actual benefit of simplifying against migration, compatibility and recovery costs. Keeping PostgreSQL may be the right answer, but state why rather than treating its presence as sufficient. Recommendations do not authorize replacement; do not migrate a working system merely to conform to an example.

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
