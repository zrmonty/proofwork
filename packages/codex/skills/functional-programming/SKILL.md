---
name: functional-programming
description: Shape domain logic and state transitions as pure functions, preserve caller data, and make effects and ownership explicit without imposing a framework.
---

# Functional programming

Make the decision understandable as supplied values becoming a result. Keep I/O and mutable lifecycle machinery at an explicit boundary. This is the default way to shape new logic, not permission to rewrite the application or reject idiomatic framework APIs.

## Locate decisions, state, and effects

Trace a representative caller before editing. Identify domain rules, caller-owned values, persisted state, and dependencies such as time, randomness, network, filesystem, process, and framework state. Ask which values a reader must know to predict the result. An implicit clock or shared cache belongs in that inventory even if the function takes no visible dependency.

Prefer a function whose supplied inputs determine its output and whose invocation does not observably change another value. Pass a timestamp or random value into a calculation; obtain it at the boundary. Return a typed result or meaningful error through the language's existing idiom. Do not add an effect system or generic dependency container to express one calculation.

## Protect the ownership contract

Preserve caller-owned inputs unless mutation is the documented API. Copy the portion that will change; a shallow copy still shares nested objects. Decide whether returned collections intentionally share values with the input. Read [transformations and aliasing](references/transformations.md) for collection changes, performance-sensitive work, or unclear ownership.

A clear loop with a private accumulator can implement a pure transformation. Prefer it to a chain that hides ordering, repeats work, or allocates large intermediate collections. Local mutation is an implementation choice; escaped mutable state is a contract. Do not demand deep copying immutable values or replace a well-specified in-place API merely for style.

Model meaningful states and errors directly. Several booleans often permit impossible combinations; a small explicit state model can prevent them. Keep the model proportional to actual transitions rather than anticipating every future event.

## Separate the transition from its execution

When a process genuinely has state, distinguish the current state and incoming event, the next state, and any requested actions. Read [state and effect boundaries](references/state-effects.md) for persisted workflows, retries, cancellation, or concurrent writers. The transition decides; the existing application boundary performs the action and supplies its outcome back.

Name the owner of each mutable or persisted value. A pure transition does not prevent two callers from deciding from stale state. Preserve the application's transaction, version check, lock, or single-writer mechanism at the boundary. Do not claim thread safety or atomicity from a pure function.

Keep external actions ordered where order is meaningful. A timeout or cancellation does not prove that a remote write failed to happen. Resolve uncertain outcomes through the provider's actual lookup or idempotency contract before retrying. Mark missing guarantees as limitations rather than asserting exactly-once delivery.

## Verify the relevant promises

Test decisions with supplied inputs and inspect the returned result. For a changed collection contract, check meaningful input preservation and nested aliasing where mutation could escape. For a stateful flow, cover the changed transition and its real effect boundary, including the relevant partial failure or retry. Avoid duplicating every branch in a separate style test.

Return the changed decision/effect boundary, ownership contract, behavior evidence tied to the current artifact, and justified deviations from the default. A valid type signature or deterministic unit test does not establish durable recovery, cleanup, or external delivery.
