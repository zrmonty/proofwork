# State and effect boundaries

Use for persisted processes, retry, cancellation or concurrent state owners. Keep existing boundary mechanisms unless the requested guarantee requires changing them.

## Uncertainty is a state

A pending notification requests delivery; the executor sends; acknowledgment confirms. Timeout cannot prove absence. Keep one idempotency key per intended operation where the provider supports it; reconcile using authoritative lookup when available. Without guarantees, expose duplicate risk and choose a policy within requirements. These conceptual states do not require a new command framework:

```text
pending + request -> sending, deliver(operationId)
sending + acknowledged -> delivered
sending + timedOut -> uncertain, reconcile(operationId)
uncertain + observedDelivered -> delivered
uncertain + confirmedAbsent -> pending
```

## Original pure transition

The Python3.10+ adapter validates identity and observation authority, owns sending/lookup and feeds results back. No I/O occurs here.

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

Repeated sending requests, unrelated IDs and unsupported events deliberately do nothing in this sketch. Applications needing invalid-transition errors must represent them. Matching IDs do not establish freshness/authority, and late acknowledgments require the actual application's policy.

Supply time, attempts, random observations and policy for deterministic retry/backoff/cache decisions. Adapters own sleeping/randomness/cache execution. Do not introduce retries, caches, event logs or command buses solely for purity.

## Commit and execute under real authority

Persisting sending before provider invocation leaves a crash-before-send window; sending before persisting acknowledgment leaves an uncertain-outcome window. Ordering alone cannot eliminate both. Identify actual transaction/outbox, operation identity, lookup or operational recovery mechanisms; add only what guarantees need.

Two valid pure proposals over one old revision can conflict. Commit under existing version/lock/transaction/single-writer rules. Resolve conflict with fresh observations, not overwrite. Never execute rejected proposals; recheck real authorization. Durable effect guarantees need actual durable machinery, not an in-memory tuple.

Framework setters/transactions are adapters. Calculate from their current snapshot; no network/analytics inside repeatedly invoked reducers/updaters. Preserve lifecycle/commit contracts; separation alone does not make multi-store updates atomic.

## Evidence

Check changed transitions and realistic failure/recovery boundaries, including persisted intermediate states when relevant. For this sketch, exercise request/timeout/observed-delivered, confirmed-absent recovery, duplicate/unrelated outcomes and preserved input. Replay supplied events without executing writes. Separately verify a rejected storage version cannot send. Successful stubs do not certify provider guarantees or cleanup; report exactly what observations establish.
