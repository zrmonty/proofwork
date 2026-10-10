# Deep Rust decision revision — 0.12.0

Strengthens rust-best-practices and adds four original conditional references, bringing its collection to seven. Both host packages remain twenty-one skills; the overall reference collection now contains fifty-nine guides. No crate dependency, global toolchain setting or runtime implementation was added to Proofwork.

## New depth

- **APIs, errors and transitions:** actual consumer ownership, generic/trait boundaries, recovery categories, validated construction and pure versioned proposals. The effect owner enforces current authority and conditional commit; a pure function is not a transaction.
- **Async cancellation and backpressure:** borrowed/owned future lifetimes, Send versus static bounds, partial I/O, task supervision, detached/continuing work, admission and retained-result limits, permit lifetime and dependency-ordered shutdown.
- **Performance and representation:** retained buffers versus copied fields, allocation bounds, collection ordering/duplicates, adversarial keys, layout/dispatch costs, supported compiler profiles and comparable measurements.
- **Unsafe and FFI invariants:** safe-wrapper obligations for all callers, valid raw storage, initialized ranges, alias/lifetime rules, ABI/allocator ownership, callback quiescence, unwind policy, manual thread safety, atomics/reclamation and pinning/destruction.

The entry maps decisions to all seven references and applies functional state/data defaults, existing runtime/error mechanisms, independent coverage gates and the hard code-file limit. The specification includes distinct acceptance cases; README and reference-guide navigation are updated. Primary Rust and Tokio documentation grounds technical mechanisms through links in the references. Instructional text and code were independently authored, not imported or adapted from external skill assets.

## Executed Rust example

An isolated dependency-free Cargo fixture uses the original reservation example. Its eight integration tests were written against an intentionally incorrect implementation that returned unchanged state and accepted invalid inputs. The red run compiled and failed all eight assertions, rather than failing on missing imports or dependencies.

The documented implementation then passed all eight tests in both debug and optimized release builds:

1. Ordinary next-state proposal and intended effect.
2. Exact-stock reservation.
3. Zero-unit rejection.
4. Insufficient-stock rejection.
5. Revision overflow rejection.
6. Documented error precedence.
7. Unchanged input and deterministic replay.
8. A competing stale proposal cannot issue an effect through the synthetic owned version gate.

Environment: rustc 1.95.0, Cargo 1.95.0, Clippy 0.1.95, edition 2021, native Windows MSVC target. `cargo test --offline`, `cargo test --offline --release`, `cargo clippy --offline --all-targets -- -D warnings` and `cargo fmt --check` passed against the isolated manifest. Zero Cargo doctests were discovered; these are eight integration tests, not doctest evidence.

The formatted library is byte-for-byte identical to the documented Rust code block. Its source SHA-256 is `18e3d26a34ebb5acc437dd7e0bd2303a15b31fee0f93638f96007f1eb442ecd2`; tests SHA-256 is `d92404b29f626fdc0e4deeb980f3eeb2ddf495ce392b7b39e5292803de73f986`. Source/tests contain 47 and 140 physical lines respectively. Raw red/green/release output and fixture files remain ignored locally.

The local version gate is sequential in-memory test machinery. It does not establish a database's atomicity, real authorization, concurrent scheduling, durable effect delivery or crash recovery. Public proposal fields are explicitly teaching data, not an unforgeable command capability. No coverage collector ran, so no numerical line/branch coverage or 95% pass is claimed for this fixture.

## Independent review

A fresh read-only reviewer inspected the entry, all seven references, specification and fixture source/tests. Verdict: **no material correctness or coherence finding**. The review found concrete guidance beyond syntax, with clear separation of decisions, authority, effects and observations.

Separate hypothetical scenarios resolved unbounded producer buffers despite a bounded channel; ownership of permits/handles while blocking work survives a timeout; borrowed FFI output invalidated by another call and callback context freed before quiescence; and stale proposals falsely relabeled with a current revision. These are source-guided reasoning observations, not executed async/FFI/concurrent cases. The reviewer did not rerun commands or independently validate execution logs.

## Package verification

- Canonical Rust skill validation passed in Python UTF-8 mode.
- All twenty-five automated tests passed; both twenty-one-skill packages built and package-local reference checks passed.
- The additive code-file scan passed across twenty-two discovered code files, including the two ignored Rust fixture sources. Other ignored fixtures are outside this additive scan.
- Strict Claude package validation passed, with informational generated README installation advice.
- Whitespace checks passed; the current-source excluded-name search found no matches.
- Codex 0.12.0 installed. All eighty installed skill/reference files matched their built hashes.

## Limits

No Tokio runtime experiment, native FFI call, unsafe execution, Miri/sanitizer/model-check run, application benchmark, numerical coverage, minimum-compiler verification or alternate-target feature matrix was executed. Clippy and passing tests do not prove soundness or performance. This release certifies package structure and the bounded safe example's observed behavior; target applications retain their own gates, supported toolchains and effect-boundary obligations.
