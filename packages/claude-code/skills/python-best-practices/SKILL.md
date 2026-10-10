---
name: python-best-practices
description: "Use for Python implementation or review; require strict static typing and explicit ownership, resource lifetime, and error contracts."
---

# Python best practices

Make data ownership and failure visible without burying the task in classes or helper layers. Prefer deterministic domain functions and explicit effects; retain ordinary Python idioms when they make the contract clearer.

## Establish the interpreter and callers

Read supported Python versions, project configuration, dependency/lock files, import layout, existing error conventions, and affected callers. Use the project's interpreter and configured test/lint/type checks. Do not introduce syntax or standard-library APIs beyond its supported version without an authorized compatibility change.

Identify whether inputs are trusted domain values, decoded external values, one-shot iterators, or caller-owned mutable collections. These demand different contracts even when their annotations look similar.

Load only relevant detail:

- For records, annotations, JSON policy, aliasing, numeric/time interchange, read [Data and boundaries](references/data-and-boundaries.md).
- For exceptions, files, generators, subprocesses, async/blocking work, and checks, read [Effects and verification](references/effects-and-verification.md).
- For untyped SDKs, protocols, callbacks, decorators or typed test doubles, read [Strict typed integrations](references/typed-integrations.md).

## Design a small, honest interface

Strict typing is required for Python code. Annotate every function and method's parameters and return value, including `-> None`, and fully parameterize generic collections and callable contracts. Allow precise local inference; do not add redundant annotations that obscure a clear value. An iterable is useful when only one traversal is needed; a sequence is clearer when indexing or repeated traversal is required. Do not annotate a generator as a reusable collection or accept a protocol whose required methods the implementation never needs.

Use the project's strict checker configuration: mypy `--strict`, Pyright `typeCheckingMode = "strict"`, or an equivalent documented gate. Keep stronger existing settings. Include changed Python code, affected callers and Python tests in scope; do not exclude files to obtain a pass. If the project has no strict gate, establish one using its existing tooling/dependency conventions as part of Python work. A missing checker or failing strict result leaves completion unverified.

Treat untrusted data as `object` and narrow it through runtime validation before using it. No implicit untyped interfaces, bare generics, unchecked `Any` propagation or blanket error suppression. Keep unavoidable untyped library behavior in a small typed adapter, using available stubs or a minimal protocol where appropriate. A cast states a justified static fact; it does not validate input. Any necessary suppression must name the diagnostic, explain the external limitation and retain a runtime check or focused test; do not suppress errors in code you can correctly type.

Use a dataclass for a stable value record, an enum for meaningful alternatives, or a simple built-in shape when the domain remains obvious. Annotations do not validate runtime data. A frozen record does not recursively freeze its contents. Decide which values may be shared and which updates require a fresh value.

## Separate decoding, decisions, and effects

Validate external shape and domain limits before calculations. Be explicit about booleans at integer boundaries, absent versus empty values, non-finite numbers, units, and conversion loss where relevant. Keep persistence/transport representation separate when it differs from domain meaning.

Pass time, configuration, and external observations into calculations. Avoid mutable defaults and implicit global state. Copy only what changes; a clear local loop or accumulator can preserve purity without repeated allocations. Verify nested aliasing when a transform claims to leave inputs unchanged.

Catch an exception where the code can meaningfully recover or translate it. Keep causes when translating; do not turn a failed load into an empty success value. Use context managers and explicit ownership for resource lifetimes. Preserve cancellation and account for partial effects when async work or retries are involved.

## Verify and return evidence

Exercise the changed contract with the configured interpreter: repeated calls, malformed boundaries, relevant limits, generator exhaustion, mutation preservation, cleanup, or external-process failure. Run the strict type gate separately and report its exact configuration, scope and result; annotations alone and runtime test success do not establish a strict pass. Static typing does not establish runtime correctness.

Return changed data/error contracts, affected callers, actual commands/results, and material gaps. Explain intentional mutation or compatibility changes when they matter. Strict typing is part of Python completion; do not introduce a second checker when the existing strict gate suffices, or add frameworks, packaging systems, immutable-data dependencies or async redesign as incidental cleanup.
