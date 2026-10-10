---
name: rust-best-practices
description: "Use for general Rust implementation or review; model ownership, errors, numeric limits, and explicit effects with the project's toolchain."
---

# Rust best practices

## Inputs
Read Cargo manifests, rust-toolchain when present, edition, public callers, feature flags, formatter/Clippy policy, and the relevant tests. Load focused official documentation for unfamiliar ownership or unsafe requirements.

## Workflow
1. Decide who owns each value and how long callers need it. Borrow for observation; transfer ownership for consumption. Clone only when independent ownership is necessary or its measured cost is justified.
2. Use enums for distinct domain states and Result for failures callers can recover from. Preserve useful error context and existing public contracts. Restrict panic assumptions to proven programmer invariants.
3. Keep transformations deterministic with supplied time/configuration. Private mutable buffers are compatible with pure output; avoid forcing extra allocations to mimic another language's functional syntax.
4. State amount/range policies. Use checked operations or explicit validated bounds when overflow is possible. Test conversions, rounding, empty input, and boundary values relevant to the domain.
5. Before concurrency changes, identify shared data ownership, lock ordering, and how cancellation releases resources. Avoid retaining a lock across suspension without a justified contract. Dropping an async operation does not necessarily undo an external write.
6. For unsafe changes, document each safety invariant, its enforcement point, and what every caller must uphold. Keep the unsafe portion narrow. Do not claim tests alone establish soundness.
7. Run configured formatting, Clippy, and tests for affected features/targets. Add a behavior-level regression or focused invariant check for substantive logic.

## Outputs
Report ownership/API changes, error and numeric policies, actual checks and feature coverage, and unresolved concurrency or unsafe evidence.

## Boundaries
No RTK conventions, new crate, edition migration, blanket lint policy, or speculative optimization. Preserve compatibility unless the task authorizes changing it. Load functional-programming for state/effect redesign.

## References
- [Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- [Recoverable errors](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)
- [Checked integer operations](https://doc.rust-lang.org/std/primitive.i64.html)
- [Unsafe Rust](https://doc.rust-lang.org/nomicon/)

## Behavioral cases
A borrowed ledger remains available after summary; overflow returns a recoverable error; a clear accumulator is accepted; unsafe invariants and cancellation gaps cannot disappear in a clean-code verdict. See language-scenarios.
