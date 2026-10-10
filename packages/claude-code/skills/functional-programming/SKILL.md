---
name: functional-programming
description: For stateful workflows, retries, concurrency, caching or shared mutation.
---

# Functional programming

Match the existing codebase's dominant style before applying a functional preference. Preserve its idioms and mechanisms; this skill does not authorize a style migration.

Load this skill when the changed behavior touches stateful workflows, retries, concurrency, caching or shared mutable state. Skip it for typo fixes, ordinary UI tweaks and simple CRUD. A CRUD endpoint or UI flow with a real retry, partial failure or shared-state protocol qualifies through that behavior, not its label.

## Decide whether to extract a transition

Extract a pure transition when at least one condition holds:

- The changed workflow has at least three meaningful states or at least three meaningful event types.
- There is a real partial-failure or retry path whose decision must be explicit.
- Domain logic needs testing without the framework.

Otherwise follow the surrounding code. Count actual domain states and event types, not fields, booleans or repeated occurrences of one event. Even when the test qualifies, fit the extraction into the established style and keep its scope to the changed contract. Do not introduce reducers, effect frameworks or layers for routine setters or CRUD.

## Require clear domain names

Clear, unambiguous naming is mandatory for changed functions, parameters, bindings, types, fields, events and effect requests. Names must state the actual domain role. Distinguish calculation/proposal, commit, execution and observation: calculateInvoiceTotal and proposeDeliveryTransition cannot imply a send occurred. Expose relevant units, lifecycle and absolute-versus-delta intent. Reject vague placeholders and unexplained abbreviations when they force readers to guess. Contextually obvious short names remain valid. Genuine unknown outcomes must remain truthfully named.

Review names at their call sites and migrate internal consumers together. Resolve unclear meaning from callers and requirements; report material unresolved meaning or public/wire/persisted compatibility constraints instead of shipping a guess.

## Preserve values and effect ownership

Preserve caller-owned inputs under the documented contract. A shallow copy still shares nested mutable objects. Private loops and mutation of newly owned data can implement a pure interface; do not require iterator syntax or unnecessary deep copies.

For a qualifying extraction, calculate next state and intended effects from a stable snapshot, event and policy. Keep clocks, randomness, I/O and persistence at the existing boundary. That boundary rechecks authority/version, commits and executes eligible effects; feed observed outcomes back. Purity supplies no transaction, permission, durable delivery or cancellation rollback guarantee.

Read [detailed guidance](references/detailed-workflow.md) for consequential state/effect work; [transformations](references/transformations.md) for aliasing or reordered calculations; [state effects](references/state-effects.md) for retries/persistence; [reconciliation](references/intent-and-reconciliation.md) for stale intent.

Verify deterministic decisions, input preservation and the actual changed failure boundary. Report current-artifact evidence and justified inseparable resource decisions. Do not introduce an effect framework for a single calculation.
