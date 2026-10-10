# Durable consumers and retirement

Load when a candidate handles persisted records, queued work, old URLs, configuration versions or staged releases. Today's source graph can be complete while yesterday's supported data still calls a handler tomorrow.

## A stored identifier can be a caller

Trace how durable data selects behavior: job kind, schema version, serialized type, route slug, configuration key or migration identity as applicable. An enqueue path may disappear before its previously accepted work drains. A new writer may stop producing an old shape while restore or upgrade procedures still consume it.

Inspect supported retention and upgrade obligations. Never expose sensitive rows in tool output; use redacted metadata or an authorized local synthetic example. A request to remove dead code does not authorize deleting user data, draining live jobs or editing deployed state.

Classify the handler as live, retained for a supported durable consumer, unresolved or proven obsolete. Absence of a current producer is different from absence of supported consumers. A current database query can support a bounded observation; it cannot certify all backups or outside clients.

## Worked case: old export worker

A replacement job type is the only one newly scheduled, and the old scheduling code has no callers. An older job can still be retried after an interruption. Removing its handler and fixtures prematurely can strand already accepted work.

If evidence establishes that supported retained jobs still exist, retain the handler and its distinguishing compatibility/failure tests. The old producer can separately be proven dead and removed. Do not preserve its private tests merely because the consumer remains: map each assertion to the surviving responsibility.

If the project's authorized retirement policy and evidence establish that no supported durable consumer remains, remove the handler, registration and exclusively owned tests together. Record the retention boundary. Do not invent an automatic migration or silently discard unknown jobs to make removal safe.

## Worked case: inactive feature branch

A feature flag is off locally but can be enabled by supported configuration or mixed-version deployment. Trace the flag's owner, supported settings and actual registration. Local coverage does not establish deadness.

Retirement may be a product decision rather than a source cleanup. If already authorized, remove the obsolete flag path and related references coherently, checking surviving defaults and configuration behavior. If authorization or external use is unresolved, retain the candidate and complete independent proven deletions.

Do not preserve a private dead branch indefinitely merely because a flag once existed. Equally, do not turn uncertainty into permission to remove a supported compatibility path.

## Tests record obligations, not immortal internals

An old-version fixture can protect supported upgrade behavior; a unit test importing an obsolete private formatter may have no live guarantee. Identify the consumer each protects. Shared fixtures, migration histories and public golden data require their actual ownership/retention contract.

Delete exclusively attached test artifacts only when that responsibility is legitimately retired. Keep live replay, denied-operation and malformed-input guarantees. A skipped compatibility test may signal an unmet supported requirement rather than removable scaffolding.

## Evidence sufficient for a scoped removal

Document the roots/configurations, durable identities considered, retirement authority and observation boundary. Rebuild and exercise the surviving consumed artifact plus relevant discovery or compatibility path. Update the independently enumerated source coverage inventory with explained deletions while keeping existing gates.

A useful outcome can remove the obsolete producer while retaining the consumer, or remove nothing pending a specific missing fact. Do not promise complete repository deadness or performance gains from source subtraction. Unseen external clients, retained backups and live work remain explicit gaps when material.
