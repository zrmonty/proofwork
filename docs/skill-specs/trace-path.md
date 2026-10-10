# Specification: trace-path

Provide a scoped explanation of current execution and data ownership from inspected entrypoints, callers and configuration. Output a path map with file/symbol pointers, meaningful state/effect boundaries and distinct observed versus inferred claims. Keep scope tied to the question and remain read-only unless edits are authorized.

Acceptance cases:

1. A queued invoice action follows request, enqueue, consumer and persistence rather than stopping at the HTTP handler.
2. Configuration-selected dispatch is inspected; a matching function name alone does not establish the active path.
3. A shallow copy retaining nested mutable aliases is described accurately, with an explicit owner.
4. Missing service access leaves the external contract unverified; no secrets or live writes are needed for explanation.

These are instructional acceptance cases, not executed evaluations.
