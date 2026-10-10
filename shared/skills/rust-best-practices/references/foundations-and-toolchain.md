# Foundations and toolchain contracts

## Must

- Must match the project's style and toolchain policy.
- Must distinguish edition from compiler and API availability.
- Must choose types by domain meaning and target width.
- Must name observable effects and mutable owners.
- Must test claims on affected consumers and configurations.
- Must report unsupported or unavailable checks as gaps.

Read when starting a Rust component or changing compiler assumptions. Distinguish language mechanisms from the project's compatibility and domain promises.

## Semantics before syntax

A binding, owned value, borrowed place and expression result are different things. A semicolon can turn a block result into unit. Shadowing creates a new binding and may change type; assignment changes a mutable place while preserving its type. Explicit types settle inference, not external validation.

Choose representations deliberately: `usize` follows target width and needs checked conversion at wire/storage boundaries; `char` is a Unicode scalar, not a byte or grapheme. Use tuples for short local products and named fields for stable roles or units. Prefer exhaustive expressions for decisions, element traversal over unnecessary indexing, and clear bounded loops when early exit or resource processing needs them.

Match the dominant project style. Extract pure transitions for meaningful states, retry/partial-failure paths or decisions needing framework-free tests. Private mutation of owned output can preserve a pure interface; `&mut`, interior mutation, I/O and storage need explicit observable-effect contracts. Extract cohesive responsibilities without obscuring validation order, borrow scope, errors or callers. There is no arbitrary function or file length ceiling.

## Build assumptions are contracts

Inspect workspace/crate manifests, lockfile policy, toolchain file, edition, `rust-version`, features and targets. Record actual `rustc -Vv` and `cargo -V`. A declared minimum version is not tested compatibility. Edition controls source interpretation; compiler version controls available features/APIs. Check stabilization and migration notes before adopting an idiom. Online docs may describe a newer compiler; use supported-release documentation and execute compatibility checks when needed. Do not incidentally adopt unstable APIs.

Cargo features are additive selections, not mutually exclusive runtime modes. `--all-features` neither proves minimal builds nor validates every supported combination. Check affected combinations and isolated consumers using [downstream compatibility](downstream-compatibility.md).

Keep visibility narrow and crate boundaries tied to actual ownership/build/consumer needs. Document public inputs, ownership, failures and effects. Before dependencies, evaluate existing facilities, maintenance, license, defaults, targets, unsafe surface and cost. Avoid incidental library replacement. Inspect Debug, nested errors and tracing for sensitive disclosure: memory safety does not prove authorization or secrecy.

## Evidence follows the claim

- Compilation: affected crates, consumers, features and targets, not a similar snippet.
- Borrowing: real consumer checks, retained-input assertions and relevant rejection cases.
- Arithmetic: explicit overflow/rounding policy and edge cases under applicable profiles.
- Public examples: exact current blocks or doctests with their support context.
- Performance: reproducible before/after workloads and variability, not syntax or one timing.
- Unsafe soundness: enforced lifecycle invariants; tests, Clippy and Miri cannot independently prove them.
- Coverage: independent source scope and real line/branch collection under [tdd-95](../../tdd-95/SKILL.md), not test count.

Run configured formatting, Clippy and relevant tests. Report unavailable collectors, targets or minimum compilers as unverified. Choose property, compile-fail or consumer checks only when they challenge the changed contract.

Primary sources: [Rust Reference](https://doc.rust-lang.org/reference/), [minimum versions](https://doc.rust-lang.org/cargo/reference/rust-version.html), [edition guide](https://doc.rust-lang.org/edition-guide/) and [Cargo targets](https://doc.rust-lang.org/cargo/reference/cargo-targets.html).
