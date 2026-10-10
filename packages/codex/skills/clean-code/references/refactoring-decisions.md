# Refactoring decisions

Use this reference when simplification changes responsibility, removes a layer, or merges apparently duplicate code.

## Ask what the layer does

A function that only forwards arguments might be removable. First inspect all uses and the contract around it. It may also define a stable public API, bind a dependency, translate an error, enforce authorization, acquire a resource, or provide a seam used by the framework.

Remove the layer only if its current responsibility is unnecessary or has one explicit replacement owner. Migrate consumers before deleting the old entry point. Preserve cleanup and error context at the new boundary. Do not leave the old wrapper plus a new helper unless compatibility requires both.

Example: three internal callers use `readReport`, which forwards to `loadReport`. If `readReport` is unexported and adds no behavior, moving those callers to `loadReport` may remove an unnecessary name. If an external client imports `readReport`, its existence is a contract; a cleanup does not authorize breaking it.

## Merge policy, not visual similarity

Two branches calculating the same discount according to the same business rule need one policy owner. Two branches formatting similar labels for unrelated consumers may reasonably stay separate. Ask what change would require updating both and whether that shared reason exists today.

An abstraction has a cost: a reader must learn its parameters, indirection, and failure behavior. Extract when the domain name or shared responsibility pays that cost. Avoid a universal helper with flags for several unrelated cases; explicit local code may be shorter to understand.

## Simplify state before expressions

If `isLoading`, `hasError`, and `isReady` permit contradictory combinations, rewriting the boolean expression does not solve the state model. A small set of meaningful states can make the decision direct. Preserve the actual transition owner and error information rather than adding a second shadow state.

If a derived value is stored and regularly falls out of sync, consider deriving it from its source when safe and inexpensive. If persistence or performance requires storing it, clarify the update owner and consistency contract. Do not remove a cache simply because derived values are aesthetically simpler.

## Useful preservation checks

- A wrapper removal: exercise a real caller's successful and relevant failed result, then verify no active consumer still depends on the removed contract.
- A validation move: send malformed boundary input and check that it still fails with usable context.
- A resource refactor: exercise an error or cancellation path that could bypass cleanup.
- A state simplification: check a valid transition and the formerly ambiguous or impossible combination.
- A pure calculation: check the domain result and caller input preservation if ownership changed.

Choose checks that could detect a meaningful regression in the actual diff. Do not impose all five on a trivial naming change.
