# Architecture fit specification

## Purpose and trigger

Choose architecture and tools from actual workload, hosting, recovery, and maintenance needs. Apply to new-project architecture, consequential technology selection, and proposed infrastructure expansion; do not initiate a stack migration during an unrelated fix.

## Inputs and scope

Inspect existing code, hosting evidence, chosen tools, workflows, data ownership, workload and operating constraints. Preserve user choices that meet requirements. Ask only material unanswered questions early; continue independent inspection while awaiting answers and keep dependent choices provisional. Recommendations do not authorize installs, migrations, publication, or rewrites.

## Required decisions

- Separate hard requirements, preferences, observed facts, and assumptions. Name the behavior a proposed tool enables.
- Actively challenge each major proposed and relevant incumbent component, including whether its category is needed at all. Popularity, habit and unspecified future scale are not requirements. State a simpler adequate arrangement and what requirement would rule it out.
- Return keep, replace, omit or defer decisions with reasons rather than an unranked catalog. Review frameworks, ORMs, API layers and infrastructure as well as storage; a no-additional-component arrangement is a credible option when it meets the contract.
- Distinguish account count from concurrent sessions, writes, transaction duration and jobs. Do not create a universal user-count rule or capacity promise.
- Include the demonstrated incumbent, the least complex adequate option, and a material alternative when useful; compare equivalent requirements and total operating burden.
- Evaluate local durable storage, ephemeral hosting, replica topology, required data/query features, backup/restore, availability targets, and maintainer capability where they can affect the choice.
- Treat SQLite as a valid candidate for a modest durable local application, while preserving its single-writer and storage constraints. WAL is not concurrent writing; remote web clients are not shared-file access.
- Choose a managed client/server database when the real shared-write or hosting requirements justify it. Avoid reflex selection of PostgreSQL and reflex replacement of an existing PostgreSQL deployment.
- Apply the same requirement test to services, caches, brokers, search, packaging and orchestration. A container image alone does not make stateful horizontal replicas safe.
- Record the chosen option, rejected alternatives, assumptions, owner, failure/recovery plan, evidence gaps and a measurable reopening condition.
- Preserve a modest migration seam and identify semantic migration work; do not implement unused adapters or speculative layers.

## Progressive disclosure

references/storage-fit.md supports database and hosting decisions with constraint questions, same-audience conflicting examples and capacity/recovery verification. references/component-decisions.md supports extra infrastructure proposals and measured upgrade triggers. Official SQLite sources ground the technical constraints; provider/version claims need current primary documentation.

## Output and evidence

Return a reasoned selected architecture or explicitly conditional recommendation, components omitted, decision record and practical checks. Separate observed behavior from inference. Scenario reasoning does not certify capacity or recovery; missing hosting answers remain material gaps.

## Acceptance cases

1. A roughly 100-member read-heavy directory on one durable host considers SQLite and a modular app; includes an owner and restore plan and omits unearned infrastructure.
2. A roughly 100-operator shared-write tool requiring independent writable app instances considers an appropriate managed client/server database rather than assuming SQLite from audience size.
3. Sparse form writes on ephemeral instances do not use ordinary temporary SQLite files as durable production storage. The hosting-dependent recommendation remains conditional until persistence is resolved.
4. An existing well-operated PostgreSQL application is preserved when a migration lacks a concrete benefit; reducing the audience count is insufficient justification.
5. A proposal to share a SQLite database file directly across machines flags storage/locking concerns; WAL is not presented as eliminating its single-writer limit.
6. An instruction to add caching or a broker asks which measured latency or durable-delivery requirement it solves; a valid existing managed mechanism may be retained.
7. Unknown workload receives only material questions and a provisional comparison, not invented timings, an exhaustive interrogation, or immediate dependency installation.
8. A required specialized database feature or mandated viable tool choice overrides a small-audience heuristic; the comparison states the requirement explicitly.
9. A Docker recommendation describes packaging separately from persistence and scaling; no promise that replicas can share local files safely.
10. A scaling recommendation ties an observation to the agreed target and names a modest next change, without building generic storage abstractions in advance.
11. A static event publication proposed with PostgreSQL, Redis, a broker and Kubernetes challenges every component and can recommend no runtime database when the actual editing/delivery workflow needs none.
12. A modest mutable app with an unjustified PostgreSQL proposal asks what a simpler supported arrangement cannot do; it gives a concrete recommendation rather than merely mentioning SQLite.
13. An existing PostgreSQL service is questioned on capability and burden; retention requires reasons including actual migration cost, while a demonstrated simpler fit receives a scoped proposal rather than an unauthorized migration.
14. A framework or ORM is retained only with a real advantage for this project's interactions or data work; bespoke replacement complexity counts against removal.

## Evaluation status and authorship

Original Proofwork instructions and examples. Official documentation was inspected to verify SQLite constraints. Acceptance cases define intended observable decisions; their presence is not evidence that workload tests or restoration were executed. Evaluator results and limitations belong in the parent verification record.
