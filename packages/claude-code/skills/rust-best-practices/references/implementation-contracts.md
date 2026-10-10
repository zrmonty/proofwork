# Rust best practices

Make ownership, valid states, and failure policy visible in the API. The goal is a contract a caller can use correctly without reading the implementation, not maximizing iterator syntax or eliminating every mutable local.

## Establish the project contract

Read Cargo manifests, workspace boundaries, the declared minimum compiler version, toolchain file, edition, feature flags, target assumptions, and affected public callers. Use the repository's formatter, Clippy policy, tests, and async runtime. Do not assume a current compiler feature is available to the project's supported consumers.

For basics through advanced Rust, use the [topic guide](topic-guide.md) to select among ownership, borrowing, collections, iterator item shapes, conversions, text, domain types, numeric policy and traits. Read [worked contracts](worked-contracts.md) when exact runnable examples will resolve a type or ownership question; do not load every reference.

For each changed operation, identify who owns its inputs, what remains available afterward, which failures callers can handle, and what happens if work stops halfway through. Load focused detail when relevant:

- For borrowing, domain types, UTF-8 boundaries, fallible collections, amounts, and errors, read [Ownership and domain contracts](ownership-and-domain.md).
- For shared ownership, locks, cancellation, blocking work, resources, unsafe code, and checks, read [Resources and verification](resources-and-verification.md).
- For public API evolution, optional adapters or isolated consumer builds, read [Downstream compatibility](downstream-compatibility.md).
- For validated construction, trait/error boundaries, pure versioned proposals or compatibility-sensitive signatures, read [APIs, errors and transitions](api-errors-and-transitions.md).
- For task lifetimes, partial I/O, bounded queues and shutdown, read [Async cancellation and backpressure](async-cancellation-and-backpressure.md).
- For allocation/retention, representation, adversarial collections or optimization claims, read [Performance and representation](performance-and-representation.md).
- For unsafe wrappers, FFI, callbacks, raw storage or concurrency proof obligations, read [Unsafe and FFI invariants](unsafe-ffi-and-invariants.md).

## Choose ownership from use

Borrow for observation; take ownership when the operation consumes or retains a value. Prefer a slice to a vector when only contiguous input is needed. Return owned data when callers need independence; return borrowed data when its lifetime is useful and clear. Clone when independent ownership is intentional, not to conceal uncertainty about a borrow.

Keep public signatures understandable. Accept the least demanding useful input, but do not introduce generics, trait objects, or a lifetime parameter without a real consumer. A concrete type is often easier to maintain than an abstraction designed for hypothetical implementations.

Distinguish owned independence from shared access: a cloned reference or Arc does not copy its referent. Derive Copy/Clone only when their semantics suit the domain, and do not retain an entire parser buffer merely to avoid a small owned field. Make iterator lifetime, traversal count and error timing part of the interface. Trait bounds should express actual required behavior, not transfer every implementation constraint to callers.

## Make invalid decisions explicit

Use enums for distinct states and Result for recoverable failures. Use validated wrappers where they prevent real domain mistakes; keep construction and invariants together. Preserve contextual errors through existing project conventions. An input failure is not a programmer invariant, so it should not become an unwrap or panic.

Specify numeric behavior before selecting arithmetic: overflow, negative amounts, conversion, rounding, and aggregate limits are domain decisions. Checked operations or validated bounds should enforce those decisions in every build mode. Avoid lossy casts when a conversion can reject a value.

Separate malformed external data, denied operations, conflicts and unknown effects when callers must respond differently. Keep domain errors independent of HTTP or CLI rendering. Typed data still needs truthful constructors and decoding; private fields do not help if another adapter bypasses validation. Avoid a catch-all error or string-based classification that erases recovery decisions.

## Keep the domain deterministic

Pass configuration, time, and external observations into decisions; keep filesystem, networking, and persistence at explicit boundaries. Iterators are useful for clear transformations. A local accumulator or buffer is equally valid when it makes limits, early exit, or allocation behavior easier to follow. Purity concerns externally visible effects and ownership, not the presence of `mut`.

Match the existing dominant style. Extract a pure transition when the changed workflow has at least three meaningful states or event types, a real partial-failure/retry path, or domain logic needing tests without its framework; otherwise follow surrounding code. Effects retain their authoritative owner. The adapter validates current authority, commits under the actual version/transaction rule, then executes eligible effects and feeds observed outcomes back. Never run a rejected proposal's effects or treat a pure calculation as atomic storage. Derive views from canonical state; document any decision inseparable from resource machinery.

Before parallelizing, identify shared state, lock scope/order, partial effects, and cancellation behavior. Prefer independent owned work when possible. Keep unsafe code narrow and record the invariants that make each operation valid, including what callers must uphold. Tests can reveal violations; passing tests do not prove soundness.

Specify admission, in-flight and retained-result bounds before adding parallel work. Name who observes task failures and completes shutdown. Select synchronization from the invariant and workload, not a blanket preference for atomics or read locks. Keep policy calculations outside guards when possible, rechecking version/permission before committing their result.

## Verify and report

Run configured formatting, Clippy, and tests for affected features/targets. Choose checks that challenge the changed invariant: preserved borrowed input, invalid parsing, numeric edges, cleanup on error, or concurrent ordering. For public API changes, exercise a consumer. Report actual feature/target coverage rather than claiming all builds from one default configuration.

For executable changes, apply [tdd-95](../../tdd-95/SKILL.md)'s real independent-source line/branch gates and retain stricter requirements; unsupported branch collection stays unverified. Use doctests/consumer checks for supported public examples and targeted failure/interleaving tests for resources. Miri, sanitizers, model checking and profiling can support specific claims when available; none is a substitute for a stated invariant or a soundness proof. Do not run a huge feature/target matrix unrelated to the changed contract.

Return ownership/API changes, error and numeric policies, executed checks, and unresolved resource or unsafe assumptions. Do not add crates, change editions, impose blanket lints, or optimize speculative bottlenecks as incidental cleanup.
