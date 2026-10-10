# Rust curriculum depth verification

Date: 2026-10-10. Version: 0.16.0. Scope: original Rust instructional references, conditional discovery, aligned current examples, generated host packages and installed source parity. No plugin runtime logic changed.

## Result and coverage

One Rust skill now has twenty-three references, expanded from seven. The sixteen additions include a topic guide, foundations, worked contracts and thirteen focused technical references. The [coverage map](../../docs/rust-topic-coverage.md) accounts for all 75 readable numbered entries from nine supplied lesson images. Duplicate 27 is counted once. Unreadable/missing titles 9, 60 and 61 are not inferred. Review panels map to distinguishing checks rather than new skills.

The authored references cover mechanisms through their decision contracts: borrowing/reborrowing, reference-depth and clone semantics, collections and identity laws, iterator ownership/item shapes, checked conversions, UTF-8 units, absence/failure and patterns, structs/enums/receivers, traits/dispatch, derives and numeric/float policy. Existing API, async, downstream, performance and unsafe guidance remains conditional. No external skill assets or educational lesson text were imported.

## Executed Rust evidence

Toolchain: rustc 1.95.0 (59807616e 2026-04-14), Cargo 1.95.0 (f2d3ce0bd 2026-03-21), x86_64-pc-windows-msvc. Fixture edition 2024. No dependencies, network-backed build or repository Rust toolchain configuration was added.

All Rust blocks in ownership-and-domain.md, api-errors-and-transitions.md and worked-contracts.md were individually formatted with ordinary rustfmt, then concatenated exactly into an ignored local Cargo fixture's src/lib.rs. The current extracted source has 268 physical lines. Nineteen embedded tests check ledger borrowing/negative/overflow contracts, pure reservation state/effect/error/replay contracts, tuple positions, copied reference layers, owned private mutation, checked narrowing, duplicate names, checked UTF-8 offsets, nonfinite admission, disjoint reborrowing and non-Copy observation.

A separate 30-line integration fixture adds two consumer tests: a `T: AsRef<str> + ?Sized` helper accepts str and dyn callers; a boxed local borrow and a composite supertrait preserve the input and compile under the declared lifetime relationship. These are consumer checks, not representative application benchmarks.

Executed against `.engineering-team/rust-curriculum/Cargo.toml`:

- `cargo fmt --manifest-path <fixture>/Cargo.toml -- --check`: passed.
- `cargo clippy --offline --manifest-path <fixture>/Cargo.toml --all-targets -- -D warnings`: passed.
- `cargo test --offline --manifest-path <fixture>/Cargo.toml`: 19 embedded + 2 consumer tests passed.
- The same test command with `--release`: 19 + 2 passed.
- Doctest count is zero; these results are from exact extracted source and consumer tests, not doctest execution.

An initial Clippy run identified a test-only stock constructor exposed to the normal library build. It was scoped with cfg(test), then the exact current blocks were extracted again and all final commands above passed. The ledger/reservation examples were decomposed into cohesive calculation responsibilities to preserve normal formatting and the ten-line requirement.

Five deliberately invalid fixtures were compiled with `rustc --edition 2024 --emit metadata`. Each returned a nonzero exit and matched the expected diagnostic:

| Fixture | Expected error | Challenged contract |
| --- | --- | --- |
| Use a borrowed vector element after pushing | E0502 | Shared borrow overlaps structural mutation |
| Keep two direct indexed mutable borrows alive | E0499 | Index syntax does not establish disjointness |
| Move a String through a shared reference | E0507 | Non-Copy observation differs from taking ownership |
| Pass str to an implicitly Sized generic | E0277 | Borrowed generic support needs the intended Sized policy |
| Combine two non-auto base traits directly in dyn | E0225 | Generic multiple bounds do not imply that object type is legal |

Accepted solutions are exercised in the exact worked blocks and the two consumer tests. Expected compiler rejection does not establish a universal repair strategy or certify an arbitrary application's borrowing.

Thirty-three accepted-source function definitions and four integration definitions were inspected after formatting: maximum complete span nine lines, including attached attributes. The bounded source scan was checked against these simple definitions, and inline closures were inspected separately. The failing fixtures are also short definitions. This is scoped example inspection, not a general Rust parser or repository-wide function audit. Both accepted source files are below 500 lines.

## Independent review

Three authors owned disjoint new references. An independent reviewer used the guidance to reason through five realistic requests: retained Vec<String> after filtering; tuple predicates and original positions; two user-indexed mutable positions; NaN/signed-zero cache identity; borrowed generic and runtime APIs. The reviewer found no factual blocker or topic-map gap and identified missing depth around ?Sized, object-lifetime defaults and generic versus dyn multi-trait bounds. Those additions were integrated and concrete accepted/rejected compiler fixtures checked the relevant boundaries.

These are textual review and hypothetical forward reasoning. They do not establish comparative agent benefit, a fresh host conversation completing an application or real production correctness.

## Package and installed checks

- `npm run check`: all 56 tests passed, both twenty-three-skill packages built, default code-file inventory passed at 500 lines across 25 discovered files.
- Rust skill quick validator: passed.
- Strict Claude plugin validation: passed, with informational marketplace-install README advice.
- Package build validates contained local references; repository README/docs local targets also existed.
- Forbidden-name scan of shared/adapters/docs/README/packages: no matches. Git whitespace check passed.
- `codex plugin add proofwork@proofwork-local --json`: installed version 0.16.0.
- Byte parity checked every canonical skill/reference file against both generated packages and installed Codex: all 103 matched. Installation parity is not host behavioral certification.

Current source digests (SHA-256):

| Artifact | Digest |
| --- | --- |
| ownership-and-domain.md | 86e04588f70848dff17d78fa79411a83330584b507b0c9a39dd77769432699a8 |
| api-errors-and-transitions.md | 16da9511b6bee4ae497a6762a981f22efc4081940216b73b894248094b71958e |
| worked-contracts.md | a154fe99c77aeb3198cab18b4cd71027f3f9b2b08b37ef224eb4a8a30b82765c |
| Exact concatenated accepted source | b25cdaef339ef510d2be06ca7ff150c585e6bf0f785b3c2d401e77d41f3b4198 |

Local raw fixtures and diagnostics remain ignored under .engineering-team. The published Markdown blocks reproduce the nineteen embedded checks when concatenated into a dependency-free edition-2024 crate. Consumer probes and expected-rejection descriptions above record the additional scope without shipping raw runtime output.

## Unverified claims and remaining limits

No Rust numerical line/branch coverage was collected or claimed; the large input needed to reach name_counts overflow was not tested. This instructional change does not certify the 95% gate for an application. Existing wider coordinator branch-coverage and legacy runtime function-size gaps remain documented by their previous reports.

No minimum-compiler matrix, other target, application workload, benchmark, Tokio lifecycle, FFI/unsafe runtime, Miri, sanitizer or model-checking run was performed. Current online Rust documentation identifies a newer compiler than this fixture, so guidance explicitly requires each consuming project's actual MSRV/edition checks. No hundred-file quota was imposed; complete discoverable decision coverage determined the library's size.
