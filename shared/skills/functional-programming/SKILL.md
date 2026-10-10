---
name: functional-programming
description: Shape domain logic and state transitions as pure functions with required clear domain naming, preserve caller data, and make effects and ownership explicit without imposing a framework.
---

# Functional programming

Make the decision understandable as supplied values becoming a result. Keep I/O and mutable lifecycle machinery at an explicit boundary. This is the default way to shape new logic, not permission to rewrite the application or reject idiomatic framework APIs.

## Require clear names

Clear, unambiguous naming is mandatory for changed functions, parameters, bindings, types, fields, events and effect requests. A name must communicate its actual domain role in the immediate context. Do not accept placeholder, speculative or vague names that force a reader to guess what a value represents or what an operation does.

Name functions for the specific decision or transformation they perform. Distinguish a pure calculation or proposal from committing state or executing an effect: `calculateInvoiceTotal`, `proposeDeliveryTransition`, `commitDeliveryTransition` and `sendDeliveryRequest` describe different contracts. A function named `sendDelivery` must not merely return a proposed send. Naming must match the implementation; a verb alone cannot prove purity or delivery.

Name values for their meaning and lifecycle: `currentDelivery`, `proposedDelivery`, `confirmedDelivery`, `requestedQuantity`, `quantityDelta`, `expectedRevision` and `retryDelayMs` expose distinctions that `data`, `result`, `value`, `temp`, `newState` or `flag` often conceal. Generic terms such as `process`, `handle`, `manage`, `helper`, `utils` and numbered steps are unacceptable when they hide the domain responsibility. Avoid unexplained abbreviations, invented synonyms, unnecessary prefixes and names chosen only to shorten a function.

Preserve established domain vocabulary and language conventions. Concise local names are acceptable when their meaning is evident, such as `line` while traversing invoice lines; this is a clarity requirement, not a blanket word blacklist or demand for long identifiers. Boolean names must identify the actual predicate; units and absolute-versus-delta meaning must be visible wherever confusion changes behavior. Reuse one term for one concept and separate terms for materially different concepts.

Real uncertainty must remain explicit: `deliveryOutcomeUnknown` is truthful when delivery cannot be confirmed. Do not rename an unknown observation to success or invent certainty to satisfy the naming rule. Resolve unclear domain meaning from callers, types and requirements before choosing a name; expose a material unresolved meaning instead of shipping a guess.

Review changed names at their call sites. A reader must be able to identify the operation, supplied values, result and effect intent without opening an unrelated helper chain. Rename ambiguous internal symbols and their consumers together; preserve public, serialized and persisted names unless changing that contract is authorized. Naming defects block completion of the affected change until resolved or explicitly reported as an unresolved compatibility/scope constraint. Do not add an automated style test merely to enforce a word list.

## Locate decisions, state, and effects

Trace a representative caller before editing. Identify domain rules, caller-owned values, persisted state, and dependencies such as time, randomness, network, filesystem, process, and framework state. Ask which values a reader must know to predict the result. An implicit clock or shared cache belongs in that inventory even if the function takes no visible dependency.

Prefer a function whose supplied inputs determine its output and whose invocation does not observably change another value. Pass a timestamp or random value into a calculation; obtain it at the boundary. Return a typed result or meaningful error through the language's existing idiom. Do not add an effect system or generic dependency container to express one calculation.

## Protect the ownership contract

Preserve caller-owned inputs unless mutation is the documented API. Copy the portion that will change; a shallow copy still shares nested objects. Decide whether returned collections intentionally share values with the input. Read [transformations and aliasing](references/transformations.md) for collection changes, performance-sensitive work, memoization, reordered calculations, or unclear ownership.

A clear loop with a private accumulator can implement a pure transformation. Prefer it to a chain that hides ordering, repeats work, or allocates large intermediate collections. Local mutation is an implementation choice; escaped mutable state is a contract. Do not demand deep copying immutable values or replace a well-specified in-place API merely for style.

Model meaningful states and errors directly. Several booleans often permit impossible combinations; a small explicit state model can prevent them. Keep the model proportional to actual transitions rather than anticipating every future event.

## Separate the transition from its execution

When a process genuinely has state, distinguish the current state and incoming event, the next state, and any requested actions. Read [state and effect boundaries](references/state-effects.md) for persisted workflows, retries, cancellation, or concurrent writers. The transition decides; the existing application boundary performs the action and supplies its outcome back.

For optimistic changes, stale edits, rebasing intent or partial-result projections, read [intent and reconciliation](references/intent-and-reconciliation.md). It distinguishes a requested operation from a replacement calculated using old state.

Apply this default to as much changed stateful behavior as possible: create/update/delete rules, UI selection and form state, workflow progress, permissions, retry eligibility, reconciliation, cache invalidation and derived views. Inventory the writes in the changed path. Move the decision for each write into a pure transition or transformation unless it depends on an inseparable framework/resource operation; state that reason in the handoff. Do not extract trivial setters into layers merely to satisfy a pattern.

Supply an owned snapshot, typed event and explicit policy/observations. Return the next value and any necessary effect requests as data; never invoke I/O, mutate a store, emit telemetry or consult hidden current state inside the transition. Feed actual effect results back as events. Distinguish proposed, committed, confirmed and uncertain states where they change behavior. Keep validation and authorization authoritative at the real boundary.

Derive totals, labels, eligibility and views from canonical state when practical instead of keeping mutable copies synchronized. Use explicit replacement or structural sharing along the changed path. A callback capturing a mutable object is not an immutable snapshot; read-only access alone does not protect against another owner changing it.

Name the owner of each mutable or persisted value. A pure transition does not prevent two callers from deciding from stale state. Preserve the application's transaction, version check, lock, or single-writer mechanism at the boundary. Do not claim thread safety or atomicity from a pure function.

Keep external actions ordered where order is meaningful. A timeout or cancellation does not prove that a remote write failed to happen. Resolve uncertain outcomes through the provider's actual lookup or idempotency contract before retrying. Mark missing guarantees as limitations rather than asserting exactly-once delivery.

## Verify the relevant promises

Test decisions with supplied inputs and inspect the returned result. For a changed collection contract, check meaningful input preservation and nested aliasing where mutation could escape. For a stateful flow, cover the changed transition and its real effect boundary, including the relevant partial failure or retry. Avoid duplicating every branch in a separate style test.

Use a meaningful event sequence when single-step tests miss lifecycle defects: stale or duplicate outcomes, invalid transitions, partial success, conflict and recovery as relevant. Check deterministic replay from the same snapshot/observations and input preservation. Replay tests evaluate decision logic; they must not replay real writes. Pure transitions need not be idempotent for every event: establish duplicate handling for the operations that actually require it.

Return the changed decision/effect boundary, ownership contract, behavior evidence tied to the current artifact, and justified deviations from the default. A valid type signature or deterministic unit test does not establish durable recovery, cleanup, or external delivery.
