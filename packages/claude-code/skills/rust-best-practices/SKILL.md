---
name: rust-best-practices
description: "Use for general Rust implementation or review; model ownership, errors, numeric limits, and explicit effects with the project's toolchain."
---

# Rust best practices

Make ownership, valid states, and failure policy visible in the API. The goal is a contract a caller can use correctly without reading the implementation, not maximizing iterator syntax or eliminating every mutable local.

## Establish the project contract

Read Cargo manifests, workspace boundaries, the declared minimum compiler version, toolchain file, edition, feature flags, target assumptions, and affected public callers. Use the repository's formatter, Clippy policy, tests, and async runtime. Do not assume a current compiler feature is available to the project's supported consumers.

For each changed operation, identify who owns its inputs, what remains available afterward, which failures callers can handle, and what happens if work stops halfway through. Load focused detail when relevant:

- For borrowing, domain types, UTF-8 boundaries, fallible collections, amounts, and errors, read [Ownership and domain contracts](references/ownership-and-domain.md).
- For shared ownership, locks, cancellation, blocking work, resources, unsafe code, and checks, read [Resources and verification](references/resources-and-verification.md).
- For public API evolution, optional adapters or isolated consumer builds, read [Downstream compatibility](references/downstream-compatibility.md).

## Choose ownership from use

Borrow for observation; take ownership when the operation consumes or retains a value. Prefer a slice to a vector when only contiguous input is needed. Return owned data when callers need independence; return borrowed data when its lifetime is useful and clear. Clone when independent ownership is intentional, not to conceal uncertainty about a borrow.

Keep public signatures understandable. Accept the least demanding useful input, but do not introduce generics, trait objects, or a lifetime parameter without a real consumer. A concrete type is often easier to maintain than an abstraction designed for hypothetical implementations.

## Make invalid decisions explicit

Use enums for distinct states and Result for recoverable failures. Use validated wrappers where they prevent real domain mistakes; keep construction and invariants together. Preserve contextual errors through existing project conventions. An input failure is not a programmer invariant, so it should not become an unwrap or panic.

Specify numeric behavior before selecting arithmetic: overflow, negative amounts, conversion, rounding, and aggregate limits are domain decisions. Checked operations or validated bounds should enforce those decisions in every build mode. Avoid lossy casts when a conversion can reject a value.

## Keep the domain deterministic

Pass configuration, time, and external observations into decisions; keep filesystem, networking, and persistence at explicit boundaries. Iterators are useful for clear transformations. A local accumulator or buffer is equally valid when it makes limits, early exit, or allocation behavior easier to follow. Purity concerns externally visible effects and ownership, not the presence of `mut`.

Before parallelizing, identify shared state, lock scope/order, partial effects, and cancellation behavior. Prefer independent owned work when possible. Keep unsafe code narrow and record the invariants that make each operation valid, including what callers must uphold. Tests can reveal violations; passing tests do not prove soundness.

## Verify and report

Run configured formatting, Clippy, and tests for affected features/targets. Choose checks that challenge the changed invariant: preserved borrowed input, invalid parsing, numeric edges, cleanup on error, or concurrent ordering. For public API changes, exercise a consumer. Report actual feature/target coverage rather than claiming all builds from one default configuration.

Return ownership/API changes, error and numeric policies, executed checks, and unresolved resource or unsafe assumptions. Do not add crates, change editions, impose blanket lints, or optimize speculative bottlenecks as incidental cleanup.
