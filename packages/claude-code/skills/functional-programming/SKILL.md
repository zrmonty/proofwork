---
name: functional-programming
description: Shape domain logic and state transitions as pure functions with required clear domain naming, preserve caller data, and make effects and ownership explicit without imposing a framework.
---

# Functional programming

Shape decisions and as much changed stateful behavior as possible as pure functions over supplied values. Keep clocks, randomness, I/O, persistence and mutable lifecycle machinery at explicit boundaries. Use the existing language and project mechanisms.

## Require clear domain names

Clear, unambiguous naming is mandatory for changed functions, parameters, bindings, types, fields, events and effect requests. Names must state the actual domain role. Distinguish calculation/proposal, commit, execution and observation: calculateInvoiceTotal and proposeDeliveryTransition cannot imply a send occurred. Expose relevant units, lifecycle and absolute-versus-delta intent. Reject vague placeholders and unexplained abbreviations when they force readers to guess. Contextually obvious short names remain valid. Genuine unknown outcomes must remain truthfully named.

Review names at their call sites and migrate internal consumers together. Resolve unclear meaning from callers and requirements; report material unresolved meaning or public/wire/persisted compatibility constraints instead of shipping a guess.

## Preserve values and effect ownership

Preserve caller-owned inputs under the documented contract. A shallow copy still shares nested mutable objects. Private loops and mutation of newly owned data can implement a pure interface; do not require iterator syntax or unnecessary deep copies.

Calculate next state and intended effects from a stable snapshot, event and policy. The real boundary rechecks current authority/version, commits and executes eligible effects; feed observed outcomes back. Derive views from canonical values. Purity supplies no transaction, permission, durable delivery or cancellation rollback guarantee.

Read [detailed guidance](references/detailed-workflow.md) for consequential state/effect work; [transformations](references/transformations.md) for aliasing or reordered calculations; [state effects](references/state-effects.md) for retries/persistence; [reconciliation](references/intent-and-reconciliation.md) for stale intent.

Verify deterministic decisions, input preservation and the actual changed failure boundary. Report current-artifact evidence and justified inseparable resource decisions. Do not introduce an effect framework for a single calculation.
