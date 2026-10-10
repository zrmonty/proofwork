---
name: dry-audit
description: Audit duplicated domain rules, validation and transformations; consolidate proven shared responsibilities while preserving distinct policies, ownership and behavior.
---

# DRY audit

Find knowledge that has multiple competing owners and give it one appropriate home. Similar syntax is a candidate, not a mandate to share code. Default to scoped local repairs for a DRY audit-and-cleanup; honor an explicit read-only review. Preserve intentional differences and the smallest clear implementation.

## Find the repeated responsibility

Read working changes, affected callers, domain rules, existing utilities, tests and configuration. Use targeted searches or existing duplicate-code tools to locate repeated validation, calculations, state transitions, mappings, serialization and effect handling. Include drift among copies: disagreement can reveal duplicated policy more clearly than identical lines.

For each candidate, identify the invariant or decision, its consumers and owner, the inputs/errors/effects it controls, and why the copies would change together. Read [duplication decisions](references/duplication-decisions.md) for ambiguous similarity, cross-boundary validation or proposed shared helpers. Reject candidates whose consumers intentionally follow different policy, lifecycle, permissions or compatibility contracts. Do not impose a duplicate-line percentage or findings quota.

## Consolidate at the right boundary

Read [facts, projections and policy](references/facts-projections-and-policy.md) when repeated totals, status maps, labels or serializers seem equivalent. Share the authoritative fact or rule while preserving consumer projections, historical meaning, units and real boundary enforcement.

Reuse an existing authoritative implementation first. Otherwise give the common domain operation a concrete name and a narrow typed interface in the appropriate existing module. Keep its calculation or state transition pure over explicit inputs; adapters retain I/O, resource lifetime, retries, authorization and current-state enforcement. Preserve ownership, ordering, precision, error selection and cancellation when moving code.

Migrate all relevant consumers, then delete the obsolete copies and exports. Do not leave both implementations active or add wrappers that simply preserve an old owner. Share immutable facts where appropriate; a mutable singleton can introduce cross-request state instead of removing duplication. No dependency container, generic policy language or flag-heavy helper merely to merge a few lines.

Keep separate trust-boundary validation where each boundary genuinely needs it. A shared pure validator may express common semantics, but the server still validates untrusted input and enforces authorization even when a client also checks it. Public labels, wire values and legal/product text that happen to match need their own contract checked before sharing. Generated copies require a generator/template change rather than manual edits that will return.

## Keep the tests that prove the contracts

Map each affected test to its behavior. Retain distinct consumer integration, authorization, error and ownership checks after shared domain cases move to a focused suite. Remove redundant implementation-only tests only when equivalent distinguishing coverage remains; use [test economy](../tdd-95/references/test-economy.md). Parameterized cases must retain clear independent failures. Do not replace assertions with snapshots of the new helper or delete a failing consumer to get green.

Add a distinguishing regression before fixing observed drift; for equivalent extraction, retain existing behavior protection and add a missing consumer/seam check only where necessary. Run the shared implementation and actual affected callers, not only a unit test of the helper. Inspect the final diff for stale copies, changed dependencies and accidental public-contract changes.

## Return the decision and evidence

Report duplicated knowledge, chosen owner, migrated consumers, deleted copies, intentionally retained differences and checks on the final artifact. A clean verdict is valid. Explain any unresolved policy decision or ownership boundary; similar lines can remain when sharing would increase coupling. Claim performance or suite-time savings only when measured. Do not confuse a DRY audit with deleting dead code or eliminating every repeated expression.
