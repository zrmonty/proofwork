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

## Make the state change a value calculation

For changed application state, first identify its canonical owner, the event that requests a change and the invariant the next state must preserve. UI updates, workflow steps and persistence rules can use the same shape without sharing a generic engine. This original Python example calculates a delivery transition; the surrounding adapter owns sending and lookup:

```python
from dataclasses import dataclass
from enum import Enum

class Phase(Enum):
    PENDING = "pending"
    SENDING = "sending"
    UNCERTAIN = "uncertain"
    DELIVERED = "delivered"

class EventKind(Enum):
    REQUEST = "request"
    ACKNOWLEDGED = "acknowledged"
    TIMED_OUT = "timed_out"
    OBSERVED_DELIVERED = "observed_delivered"
    CONFIRMED_ABSENT = "confirmed_absent"

class Action(Enum):
    DELIVER = "deliver"
    RECONCILE = "reconcile"

@dataclass(frozen=True)
class Delivery:
    operation_id: str
    phase: Phase

@dataclass(frozen=True)
class Event:
    operation_id: str
    kind: EventKind

@dataclass(frozen=True)
class Effect:
    operation_id: str
    action: Action

@dataclass(frozen=True)
class Transition:
    state: Delivery
    effects: tuple[Effect, ...] = ()

def transition(state: Delivery, event: Event) -> Transition:
    if event.operation_id != state.operation_id:
        return Transition(state)
    match (state.phase, event.kind):
        case (Phase.PENDING, EventKind.REQUEST):
            return Transition(
                Delivery(state.operation_id, Phase.SENDING),
                (Effect(state.operation_id, Action.DELIVER),),
            )
        case (Phase.SENDING, EventKind.ACKNOWLEDGED):
            return Transition(Delivery(state.operation_id, Phase.DELIVERED))
        case (Phase.SENDING, EventKind.TIMED_OUT):
            return Transition(
                Delivery(state.operation_id, Phase.UNCERTAIN),
                (Effect(state.operation_id, Action.RECONCILE),),
            )
        case (Phase.UNCERTAIN, EventKind.OBSERVED_DELIVERED):
            return Transition(Delivery(state.operation_id, Phase.DELIVERED))
        case (Phase.UNCERTAIN, EventKind.CONFIRMED_ABSENT):
            return Transition(Delivery(state.operation_id, Phase.PENDING))
        case _:
            return Transition(state)
```

This sketch targets Python 3.10+ and assumes the boundary already validates operation identities and observation authority. Repeated requests while sending and events for another operation are deliberate no-ops. Unsupported events are also no-ops here; an application needing visible invalid-transition errors must represent those errors explicitly. It is not a universal policy for late acknowledgments, lookup freshness or provider guarantees. The transition requests reconciliation without performing it. A matching ID alone is not proof that a lookup result is fresh or authoritative.

Keep pure decisions for retry/backoff eligibility, selection reconciliation and cache invalidation alongside the transition when they belong to its actual contract. Supply time, attempt count and policy as values; an adapter owns sleeping, randomness and mutable cache execution. Do not add retries, caches, event sourcing, persisted event logs or command buses merely to implement pure transitions.

## Commit the calculated change safely

If a process persists “sending” and crashes before calling the provider, recovery must inspect or resume that state. If it calls the provider and crashes before persisting the acknowledgment, recovery must reconcile the provider outcome. The order alone cannot eliminate both windows.

Identify how the actual system handles these windows: transaction/outbox, stable operation identity, provider lookup, or a documented operational procedure. Add a new mechanism only when the requested guarantee needs it.

Two pure calculations over the same old revision can each produce valid but conflicting next states. The persistence boundary needs its existing version check, lock, transaction, or single-writer rule. Treat a conflict as new information to resolve; do not silently overwrite the other result.

An effect plan calculated from stale state is not authorization to execute. Commit against the observed version using the incumbent mechanism, or re-read and recompute on conflict before issuing newly eligible effects. Never execute a rejected candidate's effects. Preserve the real authorization check at effect time. Where a committed plan must survive a crash, use the application's durable mechanism if the requested guarantee requires it; an in-memory tuple is not durable delivery.

Framework setters and transactions remain effectful adapters. Derive their candidate value from the current snapshot rather than reading a global store inside a rule. Do not execute network calls or analytics from an updater/reducer that the framework may invoke repeatedly. Keep effects outside repeated evaluation and preserve its existing commit/lifecycle contract. This separation does not itself supply atomic multi-store updates.

## Verification scope

Test the changed transitions and one realistic failure boundary that could violate the requested guarantee. Where feasible, exercise recovery after a persisted intermediate state. Record what the provider, storage, and cleanup checks actually establish. A stub that always succeeds cannot certify the real retry contract.

For the sketch, check request → timeout → observed-delivered, confirmed-absent recovery, duplicate request/outcome handling, unrelated operation events and input preservation. Evaluate the same event sequence twice against the same initial value and compare results without executing effects. Separately test a rejected storage version cannot issue its proposed send. Keep late results and invalid events consistent with the chosen application's policy rather than assuming every event can safely be ignored.
