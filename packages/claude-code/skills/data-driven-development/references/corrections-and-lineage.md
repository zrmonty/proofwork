# Corrections, duplicates, and data lineage

Read this when imports, event streams, reconciled observations or cached analyses can repeat or correct records. A clean functional pipeline must preserve meaning before it aggregates.

## Decide what one record represents

A usage export contains two rows for one session: an early count of four and a later correction to three. Summing both reports seven; deduplicating by keeping whichever appears first reports four. Neither decision follows from the rows alone.

Identify the source contract: independent events, repeated delivery of one event, a replacement snapshot, or a revision of a prior observation. Distinguish the business entity ID from the observation/event ID and revision. Retain only the identity fields that the actual contract supplies; do not manufacture an ordering guarantee from timestamps.

| Source meaning | Appropriate question | Failure mechanism |
| --- | --- | --- |
| Independent events | Which events contribute once? | Deduplication drops legitimate equal-valued events |
| Repeated delivery | What stable event identity marks the same event? | Retries inflate counts |
| Corrected observation | Which revision supersedes which value? | Old and new versions both contribute |
| Replacement snapshot | What completeness and effective boundary does it represent? | Missing rows mistaken for confirmed deletion |
| Conflicting revisions | Which authority can resolve them? | Arrival order silently becomes truth |

Do not default to “last wins” unless the source's authority/order contract supports it. Unknown completeness, revision or identity can require rejection, quarantine or a qualified result.

## Keep each transformation explainable

Decode into typed observations, normalize under explicit policy, reconcile identity/revision, and calculate the requested summary. These can remain ordinary pure functions over an owned snapshot; no event platform or generic pipeline framework is required.

Return accepted, rejected, superseded and unresolved counts where they affect interpretation. Preserve raw observations unchanged and keep enough permitted provenance to connect an output to its source selection and policy. Avoid hidden writes to a global deduplication set during analysis.

A local map may be a clear private accumulator. Its key and conflict rule must express the source meaning. Prefer intentional immutable sharing to deep-copying everything, while ensuring later caller edits cannot modify retained analytical inputs.

## Handle incremental work without claiming unbounded guarantees

If the product needs incremental aggregation, model a pure transition from current aggregate state plus a validated observation to the next value and any boundary actions. Specify how a correction reverses or recomputes its contribution. A summary alone may lack the information needed to undo an old value.

Bound retained identity/history using the real retention and lateness policy. A finite deduplication window cannot promise suppression of every arbitrarily late duplicate. If that guarantee is needed, identify the existing authoritative mechanism rather than silently extending an in-memory set forever.

Do not prune history or change persisted aggregates as incidental cleanup. The effect owner must preserve the actual transaction/version mechanism for concurrent updates.

## Verify with meaningful reorderings

Use a fixture containing independent equal-valued events, an exact duplicate, a correction and an unresolved conflict where supported. State expected accepted totals and denominators from the source contract independently of implementation output.

Reorder rows only when the source promises order independence; otherwise check the documented ordering boundary. Replay compatible inputs against the same explicit policy and check input preservation. Verify correction handling and the permitted late-data boundary.

A fixture establishes those cases, not completeness of a production export or correctness of the provider's identity scheme. Record the selected data/configuration identity and unresolved authority assumptions with the result.
