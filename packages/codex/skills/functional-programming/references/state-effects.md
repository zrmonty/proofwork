# State and effect boundaries

Use this reference for persisted processes, retries, cancellation, or concurrent state owners. Keep the application's existing boundary mechanisms unless the task requires changing them.

## Work backward from a failure

Consider a notification workflow. The domain can decide that a pending notification should request delivery. The executor sends it. An acknowledgment marks it delivered. A timeout leaves the outcome uncertain.

Do not model a timeout as a definite “not delivered” event merely because retry is convenient. If the remote service supports an idempotency key, keep the same key for the same intended delivery. If it supports looking up the operation, reconcile the observed outcome. Without either guarantee, expose possible duplicate delivery and choose a policy within the user's requirements.

A transition sketch:

```text
pending + request -> sending, action deliver(operationId)
sending + acknowledged -> delivered, no action
sending + timedOut -> uncertain, action reconcile(operationId)
uncertain + observedDelivered -> delivered, no action
uncertain + confirmedAbsent -> pending, no action
```

These are conceptual states, not a required runtime schema. An incumbent system may encode them in a database row, job queue, or existing state machine. Do not add a separate command framework solely to reproduce this sketch.

## Persistence and concurrency still matter

If a process persists “sending” and crashes before calling the provider, recovery must inspect or resume that state. If it calls the provider and crashes before persisting the acknowledgment, recovery must reconcile the provider outcome. The order alone cannot eliminate both windows.

Identify how the actual system handles these windows: transaction/outbox, stable operation identity, provider lookup, or a documented operational procedure. Add a new mechanism only when the requested guarantee needs it.

Two pure calculations over the same old revision can each produce valid but conflicting next states. The persistence boundary needs its existing version check, lock, transaction, or single-writer rule. Treat a conflict as new information to resolve; do not silently overwrite the other result.

## Verification scope

Test the changed transitions and one realistic failure boundary that could violate the requested guarantee. Where feasible, exercise recovery after a persisted intermediate state. Record what the provider, storage, and cleanup checks actually establish. A stub that always succeeds cannot certify the real retry contract.
