# Refactoring decisions

Use this reference when simplification changes responsibility, removes a layer, or merges apparently duplicate code.

## Ask what the layer does

A function that only forwards arguments might be removable. First inspect all uses and the contract around it. It may also define a stable public API, bind a dependency, translate an error, enforce authorization, acquire a resource, or provide a seam used by the framework.

Remove the layer only if its current responsibility is unnecessary or has one explicit replacement owner. Migrate consumers before deleting the old entry point. Preserve cleanup and error context at the new boundary. Do not leave the old wrapper plus a new helper unless compatibility requires both.

Example: three internal callers use `readReport`, which forwards to `loadReport`. If `readReport` is unexported and adds no behavior, moving those callers to `loadReport` may remove an unnecessary name. If an external client imports `readReport`, its existence is a contract; a cleanup does not authorize breaking it.

## Extraction must repay reader cost

Use [the DRY lens](../../dry-audit/references/duplication-decisions.md) to decide whether repeated code shares one policy. Once extraction is justified, assess the new reader cost: parameters, indirection, failure behavior and navigation. A cohesive domain name should repay that cost; a flag-heavy universal helper often does not.

## Simplify state before expressions

If `isLoading`, `hasError`, and `isReady` permit contradictory combinations, rewriting the boolean expression does not solve the state model. A small set of meaningful states can make the decision direct. Preserve the actual transition owner and error information rather than adding a second shadow state.

If a derived value is stored and regularly falls out of sync, consider deriving it from its source when safe and inexpensive. If persistence or performance requires storing it, clarify the update owner and consistency contract. Do not remove a cache simply because derived values are aesthetically simpler.

## Decompose without distributing one responsibility

Before splitting a file, identify its public contract, state owner and distinct reasons for change. A useful boundary can separate domain decisions from persistence or a parser from command execution. Keep the closely related rules together and expose only what actual callers need.

Follow imports and initialization as well as function calls. Moving code can introduce a cycle, move a side effect to import time, create a second state instance or change resource lifetime. Preserve those obligations explicitly. Splitting tests should retain independent discovery, fixtures and teardown; a test that passes alone is insufficient if the shared runner now leaks state between files.

Use a concrete future change as a probe, not a reason to add speculative flexibility. If changing a cancellation rule still requires edits in the UI, scheduler and persistence layer after the refactor, ask whether its authority is actually centralized. If the different changes represent different policies, leave them separate. A useful decomposition makes one real responsibility easier to change without forcing unrelated work through it.

Counterexample: moving a small parser into an existing parsing module may remove mixed responsibilities with one clear import. Creating a parser factory, adapter interface and forwarding facade for the sole consumer adds reader work without improving that contract. The compliant result should reduce actual tracing or ownership cost, not just the reported file length.

## Useful preservation checks

- A wrapper removal: exercise a real caller's successful and relevant failed result, then verify no active consumer still depends on the removed contract.
- A validation move: send malformed boundary input and check that it still fails with usable context.
- A resource refactor: exercise an error or cancellation path that could bypass cleanup.
- A state simplification: check a valid transition and the formerly ambiguous or impossible combination.
- A pure calculation: check the domain result and caller input preservation if ownership changed.

Choose checks that could detect a meaningful regression in the actual diff. Do not impose all five on a trivial naming change.
