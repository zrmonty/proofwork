# Functional programming specification

## Purpose and trigger

Load only for stateful workflows, retries, concurrency, caching or shared mutable state. Skip typo fixes, ordinary UI tweaks and simple CRUD. Match the existing codebase's dominant style before any functional preference. Do not impose a framework or reject clear local loops/private mutation.

## Inputs and scope

Read caller contracts, domain rules, ownership, effect boundaries, and project conventions. Identify time, randomness, shared mutation, persistence, and retry behavior that can affect the result. Preserve documented in-place APIs unless changing their contract is within scope.

## Required decisions

- Make supplied inputs sufficient to predict a domain result; obtain unstable dependencies at the boundary.
- Require unambiguous domain naming for changed functions, parameters, bindings, types, fields, events and effects. Distinguish calculation/proposal, commit, execution and observation; expose relevant units, absolute/delta intent and lifecycle. Vague placeholders and unexplained abbreviations fail when they conceal meaning. Contextually clear short names remain valid.
- Review names with their callers, use consistent domain vocabulary and update internal consumers together. Preserve public/wire/persisted compatibility unless an authorized migration changes it. Genuine uncertain outcomes must remain honestly named; unresolved domain meaning or compatibility constraints remain explicit, not invented certainty.
- Preserve caller-owned data under the actual contract, distinguishing shallow copies, nested aliases, and immutable sharing.
- Choose direct data shapes and meaningful states/errors rather than speculative generic abstractions.
- Separate state transition decisions from existing effect execution and persistence ownership.
- Extract a pure transition only when the changed workflow has at least three meaningful states or at least three meaningful event types, a real partial-failure/retry path, or domain logic needing tests without its framework. Otherwise follow surrounding code. Fit qualifying extractions into the established style; ordinary setters and CRUD do not require reducers.
- Derive views from canonical state, keep snapshots genuinely stable and reject effects from stale/version-conflicted candidates. Feed observed outcomes back as events; pure plans create no authorization or delivery guarantee.
- Keep concurrency/version/transaction mechanisms at the boundary; pure computation alone supplies none of those guarantees.
- Handle uncertain effects through actual provider lookup/idempotency contracts. Cancellation/timeout is not proof of non-delivery.
- Accept a clear private accumulator or loop and reject needless copying, pipeline complexity, or effect frameworks.

## Progressive disclosure

references/transformations.md explains a concrete immutable invoice update, intentional structural sharing, clear loops, and supplied unstable inputs. references/state-effects.md handles a notification workflow with uncertain delivery, crash windows, and concurrent writers. These are conditional decision examples, not mandatory runtime architecture.

## Output and evidence

Report changed decision/effect boundaries, ownership and aliasing contract, current-artifact checks, and justified departures. Unit determinism does not certify transactionality, cleanup, recovery, or real external delivery.

## Acceptance cases

Existing cases are in evals/language-scenarios.md. Expanded decisions:

1. Updating one nested invoice line leaves input values unchanged and shares unchanged immutable values deliberately. A shallow outer copy followed by nested mutation fails.
2. A local loop summing supplied quantities is accepted as pure; replacing it solely to remove iteration is unnecessary.
3. A due-date decision uses supplied effective date/domain policy rather than hidden current time, without injecting every library function.
4. Notification timeout enters uncertain outcome and reconciles through the provider's real contract. Blindly retrying with a new operation identity fails.
5. Two transitions over one old revision preserve the storage conflict/version mechanism rather than claiming pure functions avoid races.
6. A documented in-place API remains valid in a focused cleanup; unauthorized ownership changes fail scope.
7. Checks distinguish transition unit evidence from a real failure/recovery boundary.
8. An event sequence preserves inputs and deterministically returns next state/effect requests, including duplicate/stale outcomes and uncertainty. Executing I/O in the transition fails.
9. A framework updater may evaluate twice: no network or telemetry fires from the pure updater, and a rejected storage candidate issues no effects.
10. A pure function called sendDelivery merely returns a proposed request: use a truthful domain proposal/calculation name and update its internal callers. A vague replacement such as handleData fails.
11. Absolute quantity, quantity delta and retry milliseconds have distinct names; ambiguous quantity/amount/timeout values fail when callers cannot distinguish their meaning. A concise line binding inside invoice traversal passes.
12. A remote timeout leaves delivery unconfirmed: retain an explicit unknown outcome name rather than confirmedDelivery. Naming clarity must not erase domain uncertainty or break an incumbent wire field without an authorized migration.

## Additional decision cases from the second depth review

- A parallel reduction changes floating-point grouping: preserve the required precision policy or reject the rewrite; purity does not establish associativity.
- A map fusion changes which malformed record is reported first: preserve the documented ordering/error contract.
- A memoized computation depends on user identity or mutable configuration: include relevant dependencies and retain isolation/invalidation; equal explicit arguments alone do not justify reuse.
- A lazy transformation moves a failure into the consumer: disclose and verify its changed lifetime/error contract rather than claiming equivalent eager behavior.

These are authored acceptance cases, not claims of executed integration evidence.

## Conditional reference expansion

Reference map: references/intent-and-reconciliation.md is loaded only for pure intentions versus stale replacement values, optimistic projections, conflicts and partial-result reconciliation.

Required acceptance: An increment and an absolute replacement from the same stale cart receive their distinct documented conflict decisions. An older failure cannot erase newer pending intent; confirmed/refused/unknown outcomes remain distinct, and rejected candidates issue no effects.

The reference is original decision guidance. These cases specify observable acceptance; they are not claims of executed application, framework, provider or benchmark evidence. Existing strict typing, functional ownership, coverage and project-specific policies remain in force.

## Evaluation status and authorship

Original Proofwork guidance. Examples are instructional and need their stated contracts; they are not production libraries or proof of general correctness. Parent evaluation records executed checks. Existing broad baseline already handled pure input preservation; no incremental efficacy claim follows from adding this reference.

## Conditional loading acceptance

- Typo fixes, button spacing and simple customer CRUD omit functional-programming from routing. Ownership protection remains in the always-read root.
- Stateful approval, cache invalidation, retries and shared mutable state load the skill. A CRUD endpoint with retries qualifies through the retry path.
- Two straightforward states without retries or framework-independent testing needs stay in the existing style. Three meaningful states or event types justify a bounded pure transition.
- A dominant object-oriented or framework style takes precedence over a functional preference; qualifying calculations fit existing modules rather than forcing a style migration.
