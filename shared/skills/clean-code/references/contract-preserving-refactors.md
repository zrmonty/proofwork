# Contract-preserving refactors

Load when moving ownership changes signatures, return shapes, exceptions, initialization or update ordering. A structural improvement should preserve the behavior people rely on unless a behavior change is explicitly part of the assignment.

## Establish the compatibility surface

List actual consumers and meaningful guarantees before choosing the new shape. Source compatibility, wire compatibility and behavioral compatibility differ. A caller can still compile while receiving a different error, ordering, alias or lifetime. Do not treat a green type check as the whole contract.

Inspect observed use, not every imaginable dependency. For a private helper, relevant callers and tests may settle the surface. A public API, persisted shape or plugin entry needs its supported compatibility policy. Retain uncertainty rather than creating a speculative compatibility layer or silently retiring a contract.

## Worked case: extracting an update decision

An update helper validates input, calculates next state, writes storage and notifies listeners. Extracting a pure decision can clarify the rules, but moving notification earlier than the write changes behavior. A failed write must not announce a committed update.

Separate explicit decision inputs from effect ownership. Keep the boundary's ordering and actual failure semantics. If a successful commit followed by notification failure is already possible, represent that observed distinction; do not turn it into a blanket rollback or retry without the real guarantees.

Check the success path and the relevant failed commit/notification path through a caller. A unit test of the pure calculation cannot prove the adapter preserves these effects. Keep strict language checks and applicable coverage gates for the executable change.

## Worked case: a result is newly immutable

A refactor returns a new top-level object but reuses a mutable nested list. A caller that mutates that list may still alter another consumer's state. Decide whether the contract transfers ownership, provides a snapshot or deliberately shares identity. Immutability claims need the actual nested contract.

Conversely, cloning every resource or large graph can change identity and cost without improving ownership. Preserve an intentional handle/identity; isolate the domain data that needs independent ownership. A coherent functional boundary is more useful than a universal deep-copy helper.

Use an input-preservation or alias-sensitive check when ownership changes. Do not add such a test to an unrelated naming edit.

## Sequence migration without a second owner

Migrate the relevant consumers to the authoritative implementation, then remove obsolete private paths. A temporary adapter is warranted only by a real compatibility or sequencing need and must delegate to one rule owner. Do not leave two independently maintained policies behind a flag.

Inspect import cycles, side-effect initialization and test discovery after moving files.

When independently produced edits converge, review the combined caller contract. A changed error shape on one side and unchanged recovery on the other can fail despite passing isolated suites. Use the actual integrated artifact, not worker assurances.

## Decide whether to proceed

Prefer the smallest refactor whose preservation obligations can be verified. If a broad move exposes unrelated behavior changes, separate them or narrow the move. Do not “clean up” a deliberate security check or exception path because the new helper makes it look redundant.

Report what became easier to trace, the guarantees preserved, the checks performed and remaining compatibility gaps. Existing failures stay visible. A meaningful simplification can be small; an unverified large rewrite is not stronger evidence of clean code.
