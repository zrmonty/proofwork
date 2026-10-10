# Execution and handoff

Read for assignment conflicts, interrupted writes, failed verification or when preparing a substantial result. The worker-result contract defines the fields; this reference explains what makes their contents useful.

## A bounded bug result

For an export boundary fix, inspect the original function and consuming behavior, reproduce truncation, then change the owning rule. A focused regression should exercise multi-page output and relevant edge cases, and preserve caller-input behavior. Return the changed owner/test paths, content identity including dirty changes, failing-before/passing-after observations and log locations.

A useful summary explains the rule: “The export removed the final element before serialization; the fix includes all supplied pages and preserves input.” A weak summary says “Fixed export, tests pass” without showing what was checked. Do not enlarge the task into a new pagination abstraction when the owning rule is a single boundary error.

## Shared contract discovered late

You own a UI file, but its necessary API field belongs to another worker. Report the field, expected semantics and affected consumer to the coordinator. Continue work independent of that field, such as a loading state already covered by the contract. Do not edit the shared schema because the change is small, quietly stub a success value, or build a separate incompatible response.

Once ownership and contract are revised, inspect the updated base before dependent edits. A stale assignment can remain unsafe even if its task used to be marked reviewed.

## Failures during implementation

When a regression still fails, inspect the failing observation and owning path before adding another condition. If repeated patches rely on the same unverified premise, investigate that premise. A failing check outside scope should still be reported with its observation; establish whether it predates the change before calling it unrelated.

If a required tool is unavailable, finish useful independent assigned checks, name the unproved criterion and return the smallest next action. Do not replace a browser flow with source inspection, a compiler with a runtime test, or external-service behavior with a mock while claiming the original criterion passed.

## Stateful work

For an operation that can partially succeed, identify the decision, effect and recorded state separately. Check success, rejection, cancellation and retry where they affect the requested behavior. A pure transition that returns an effect does not by itself prevent duplicate execution; inspect the effect boundary's persistence/idempotency contract.

Prefer a clear loop/local mutation when it preserves order and avoids unnecessary copying. Explain a material departure in terms of the actual tradeoff, such as deterministic streaming order or bounded memory, rather than a preference for syntax. Do not change the project architecture just to display functional programming.

## Interrupted work

Preserve current files and return their location, known identity, last actual check and unresolved effect. Do not mark a command passing when its result was lost. Use supported cancellation for your own running processes when required, and report a stop you cannot confirm. Workers do not restore aggregate backups, remove coordinator locks or declare the team's goal complete.

## Review-ready feature result

For a substantial feature, report fulfilled criteria separately from gaps. Name the integrated interface assumptions, changed paths and any required follow-up owned elsewhere. Supply executable commands and bounded observations, not raw provider transcripts or secrets. UI results identify actual viewport/URL and interaction outcomes where available, with the agreed design reference.

`ready-for-review` is appropriate when the assigned artifact and evidence are inspectable, even if the coordinator must still perform integrated checks. Use `needs-revision` when your own assigned behavior remains incomplete, or `blocked` with the precise missing input/capability. Never hide a failed criterion inside an otherwise confident summary.

## Distinguish a diagnosis from a guessed patch

Suppose an export occasionally omits records. Check whether the loss occurs in selection, pagination, serialization or delivery using representative identifiers and counts at the relevant boundary. Protect private data in observations. A successful smaller export does not show the failing path, and adding retries cannot repair a deterministic selection error. Choose the owning rule from the observation, then prove the fix through the consumer that lost the records.

An intermittent failure may depend on ordering, cancellation or shared state. Record the conditions that reproduce it and retain the failing observation. Avoid replacing it with an easier deterministic test that never reaches the same failure mechanism. If the original fault cannot be reproduced, label the diagnosis provisional and provide the strongest bounded evidence available without inventing a red phase.

## Report integration dependencies precisely

A worker result might say: “The form sends the agreed request and handles rejection locally. End-to-end completion remains unproved because the server migration is owned by task B. The request shape and expected error codes are linked here.” That is actionable. “Backend pending” leaves the coordinator guessing which path is incomplete.

Name assumptions that could invalidate the slice: schema version, authentication context, browser base path, fixture isolation or service transaction semantics. Do not require a generic list for a tiny change; include only assumptions the implementation actually relies on. When an assumption changes, inspect the affected code and revalidate instead of merely changing the result's revision label.
