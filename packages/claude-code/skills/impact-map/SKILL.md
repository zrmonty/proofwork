---
name: impact-map
description: For predicting affected consumers and contracts before a proposed change.
---

# Impact map

Start with the proposed behavior change, touched symbols and preserved contract. Trace actual callers, exports, registrations, configuration, data formats and operational consumers. Search beyond direct imports when templates, jobs, generated clients or dynamic lookup select behavior. Expand along demonstrated dependencies; do not claim repository-wide coverage from a bounded search.

Map affected consumers to the contract each relies on: input/output shape, errors, authorization, ordering, persistence, cancellation or compatibility. Include old/new coexistence when deployments, migrations or retained clients create it. Identify mutable owners and external effects that make apparently local changes consequential.

For each material impact, record a concrete pointer, evidence connecting it to the change and the smallest real check that would expose breakage. Prefer existing integration or journey checks when isolated unit assertions miss the consumer boundary. Label unreachable, unchanged and uncertain consumers with reasons; absence of search hits alone is not proof of no usage.

Return an ordered impact map, preserved contracts, required verification and unresolved consumers. Rank by consequence and likelihood supported by evidence, not file count. Inspection is read-only unless edits are authorized. Do not modify remote services or regenerate artifacts merely to explore consequences. After implementation, compare the actual diff with this map and recheck any newly crossed boundary.
