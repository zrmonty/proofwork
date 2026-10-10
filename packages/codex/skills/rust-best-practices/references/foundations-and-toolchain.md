# Foundations and toolchain contracts

Read when starting a Rust component, interpreting basic syntax, changing compiler assumptions or deciding which checks actually apply. A language feature is useful only when its behavior fits the project and its consumers can build it.

## Establish what the program means

Use named units and types where confusing values would cause a real error. Integer suffixes and explicit types settle arithmetic and inference; they do not validate external values. Distinguish a binding, its owned value, a borrowed place and the value produced by an expression. A semicolon can change a block's result to unit. Shadowing creates a new binding and can change type; assignment changes an existing mutable place and preserves its type.

Prefer an expression that returns a decision over a shared variable modified by distant branches. Keep the branches exhaustive and readable. A loop is appropriate for resource processing, early exits and bounded accumulation; converting it into a long iterator chain does not automatically make it pure or faster. Conversely, avoid manual indexing when element traversal expresses the actual operation.

Treat primitive types as representation choices. `usize` is useful for in-memory indexing, but its width follows the target: a wire count or persisted identifier needs its own representation and checked conversion. `char` represents a Unicode scalar, not an arbitrary byte or visible grapheme. A tuple is suitable for a short local product; name fields when their units, meaning or evolution need a stable caller contract.

## Record the build assumptions

Inspect the workspace manifest, individual crate manifests, Cargo.lock policy, toolchain file, edition, `rust-version`, enabled features and relevant target. Record the actual `rustc -Vv` and `cargo -V` for executed evidence. A manifest's minimum version is a compatibility promise, not proof that the project was tested on it.

Do not infer edition from compiler age. Edition affects source interpretation; compiler version affects which APIs and features exist. Inspect method stabilization and edition migration notes before adopting a newer idiom. The [Cargo minimum-version contract](https://doc.rust-lang.org/cargo/reference/rust-version.html) and [edition guide](https://doc.rust-lang.org/edition-guide/) distinguish these assumptions.

The current online standard library documentation can describe a newer compiler than the project's toolchain. Use the relevant release documentation or installed docs and execute a supported-toolchain check when compatibility matters. Never recommend an unstable API merely because it appears in the standard library page.

Features are additive build selections, not reliable mutually exclusive runtime modes. Check the actual declared combinations and isolated consumer when an API depends on optional support. `--all-features` can miss a minimal supported build or create an intentionally unsupported combination. Use [downstream compatibility](downstream-compatibility.md) for the affected consumers.

## Modules, dependencies and public promises

Keep visibility as narrow as useful. A workspace split should reflect an actual ownership, build or consumer boundary, not a desire for more crates. Moving a private helper behind a new public API creates maintenance obligations. Document public input, ownership, errors and effects; internal comments should explain an invariant the types and code cannot express.

Before adding a dependency, check whether the project or standard library already supplies the required behavior. Evaluate maintenance, license, feature defaults, target support, unsafe surface and build/runtime cost against the concrete need. Do not rewrite an established library incidentally, and do not add one merely to shorten a single expression.

Separate debug diagnostics from user-facing output. A derived Debug implementation can expose identifiers, tokens or full records. Format deliberately at the boundary and inspect nested errors and tracing fields. Rust memory safety does not establish authorization, secrecy or correct domain decisions.

## Apply the size and functional requirements

Every project-owned code file stays at or below 500 physical lines. Every complete function stays at or below ten physical lines after ordinary formatting, including attributes, signatures, braces, comments, blank lines and nested callbacks. Closures are inspected independently and still count within their containing function. Test and generated functions follow the same rule. See [the counting contract](../../clean-code/references/function-size-and-complexity.md).

Split around a named decision or resource responsibility, preserving validation order, borrow scope, error selection and caller compatibility. Do not compress statements, hide a body in a macro or replace a clear calculation with a chain of forwarding helpers. A short function can still be too complex. Existing violations remain violations until the authorized scope resolves them; a file-length pass cannot certify function lengths.

Keep as much changed stateful policy as possible in pure functions over explicit observations. Private mutation of newly owned data is compatible with a pure interface. Changes through `&mut`, interior mutability, I/O and storage are effects when they alter state observable outside the function. Make those contracts explicit instead of calling every iterator pipeline functional.

## Choose checks by the claim

| Claim | Useful evidence | Insufficient evidence |
| --- | --- | --- |
| Source compiles | Actual affected crate/consumer, feature and target build | A similar snippet or default workspace build |
| Borrowing contract survives | Consumer compile checks, unchanged-input assertions, relevant rejection cases | No borrow errors in an unrelated function |
| Domain arithmetic is stable | Edge cases in debug and release with explicit arithmetic policy | Debug overflow panic alone |
| Public example works | Exact current block extracted or doctested with its support context | An earlier revision of the example |
| Performance improved | Reproducible baseline/candidate workload and variability | Iterator syntax, release compilation or a single timing |
| Unsafe wrapper is sound | Stated and enforced invariants across safe callers and lifecycle | Passing tests, Clippy or Miri alone |
| Coverage meets the gate | Independent scoped source inventory and real line/branch collection | Test count or an unsupported metric labelled 95% |

Run the configured formatter, Clippy policy and targeted tests. Use actual independent line and branch gates for executable changes under [tdd-95](../../tdd-95/SKILL.md). Keep unavailable collectors, targets and minimum compilers explicit. Choose doctests, compile-fail checks, property tests or a downstream fixture when they challenge a specific contract; do not create a broad test matrix merely to produce a longer report.

The [language reference](https://doc.rust-lang.org/reference/) grounds syntax and semantics; [Cargo targets](https://doc.rust-lang.org/cargo/reference/cargo-targets.html) explains what the build checks. These references support original Proofwork decisions and do not replace project-specific execution.
