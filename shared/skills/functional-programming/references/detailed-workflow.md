# Functional extraction workflow

Match the existing dominant style first. Extract a pure transition when the changed workflow has at least three meaningful states or event types, a real partial-failure/retry path, or domain logic needing tests without its framework. Ordinary typo fixes, simple CRUD and UI tweaks do not need this workflow unless their actual protocol qualifies. Do not rewrite the application or reject idiomatic framework APIs.

## Clear naming is required

Changed functions, bindings, parameters, types, fields, events and effect requests must expose their actual domain role. Distinguish calculation, proposal, commitment and execution: `calculateInvoiceTotal`, `proposeDeliveryTransition`, `commitDeliveryTransition`, `sendDeliveryRequest`. A proposed send must not claim delivery.

Names such as `requestedQuantity`, `quantityDelta`, `expectedRevision` and `retryDelayMs` reveal roles and units. Reject placeholders, unexplained abbreviations and vague helpers when their meaning requires guessing. Concise local vocabulary remains valid when context makes it evident; this is not a word blacklist. Use one term per concept, truthful predicates and visible units where confusion affects behavior. `deliveryOutcomeUnknown` is valid uncertainty, not a naming defect.

Resolve unclear meaning from callers, types and requirements. Review names at call sites and migrate internal consumers coherently. Preserve public, serialized and persisted names unless their contract change is authorized. Report an unresolved compatibility/scope constraint instead of inventing meaning. Do not add word-list tests.

## Identify the decision and its owners

Trace a representative caller. Inventory canonical state, caller-owned data, persisted values, time, randomness, network/filesystem/process/framework dependencies and hidden caches. Supply observations and policy as values; return a typed decision/error using existing language conventions. Do not introduce an effect framework or generic container for one calculation.

Preserve caller inputs unless mutation is the documented API. A shallow copy shares nested objects; returned collections may intentionally share immutable values. Read [transformations](transformations.md) for aliasing, collection costs, memoization or reordered calculations. Private accumulators can implement pure interfaces more clearly than allocating iterator chains. Do not demand deep copies or replace a valid in-place contract for style.

Model actual states/errors proportionally. Derive views from canonical state when practical; stored caches need an update/consistency owner. A callback capturing a mutable object is not a stable snapshot.

## Proposal is not authority

Read [state/effects](state-effects.md) for persistence, retry, cancellation and concurrent writers, or [intent reconciliation](intent-and-reconciliation.md) for stale edits/optimistic projections. Supply an owned snapshot, event and observations; return candidate state and effect requests. No I/O, telemetry, hidden store reads or externally visible mutation inside the transition. Feed actual outcomes back as events.

Preserve authoritative validation, authorization and transaction/version/lock/single-writer mechanisms. Two pure calculations may conflict. Never execute rejected proposals. Timeouts do not prove remote absence; reconcile using actual lookup/idempotency guarantees before retrying. Do not promise exactly-once behavior without evidence.

## Verify the changed contract

Check decisions, input preservation and nested aliasing where relevant. For lifecycle changes, exercise meaningful sequences: invalid/stale/duplicate events, partial success, conflict and recovery. Replay the same supplied snapshot/observations without replaying real writes. Duplicate handling is required only where the operation needs it, not for every transition.

Separately check the real effect boundary and relevant failure/retry path. Return the extraction decision, fit with existing style, ownership/effect changes and current evidence. Deterministic unit tests do not prove durable recovery, cleanup or delivery.
