---
name: functional-programming
description: "Use for domain logic, transformations, and state transitions; make pure functions and explicit effects the default."
---

# Functional programming

## Inputs
Read the objective, caller contracts, state owners, and relevant project conventions. Locate I/O, time, randomness, mutation, and retries before changing behavior.

## Workflow
1. Express the domain decision as a function of supplied values. Return a result that callers can inspect without triggering effects. Pass a clock value or random input when needed; do not read them invisibly inside a calculation.
2. Keep caller-owned inputs unchanged unless mutation is the documented API. Choose data shapes that carry meaningful states and errors.
3. For a genuinely stateful process, write a transition from current state and event to next state and required actions. Let the existing application boundary execute those actions and feed their results back.
4. Identify the owner of persisted state and the order of external actions. Check cancellation, retries, and partial failure. A timed-out write may already have happened; inspect or use the application's idempotency contract before repeating it.
5. Check deterministic outputs, promised input preservation, transition errors, and the real effect boundary. State what remains unverified.

Use ordinary language features. A private accumulator and a clear loop can implement a pure function. Avoid copying large structures repeatedly, point-free expressions readers must decode, and effect frameworks for one file write. Keep established framework state APIs at the edge.

## Outputs
Return changed boundaries and state ownership, actual verification evidence, and any material departure from the default with its reason. Attach evidence to the current revision through the run contract.

## Boundaries
This skill does not authorize an architecture rewrite. Pure decisions do not establish transactionality, resource cleanup, thread safety, or exactly-once external delivery. Integration checks remain necessary.

## Behavioral cases
Repeated supplied inputs yield equal results; caller values remain intact; failed effects can be recovered without duplicate delivery. A simple local loop receives no stylistic finding. See the language evaluation cases.
