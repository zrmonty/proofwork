# Downstream compatibility and feature boundaries

## Must

- Must identify supported consumers before changing public contracts.
- Must exercise affected minimal and optional feature builds.
- Must inspect accidental dependency-feature activation.
- Must preserve invariants across every supported constructor adapter.
- Must distinguish wire evolution from internal enum changes.
- Must report unavailable compiler and target checks honestly.

Read this when changing a public Rust API, optional adapter, feature boundary, or minimum-supported compiler contract. The workspace's convenient build is not necessarily the consumer's build.

## Identify the actual consumer promise

A library's parser works in its workspace because another package enables a serialization feature. A downstream CLI depending on the parser with default features disabled cannot compile it. The internal test result answered a different configuration question.

Inventory the touched exported types/functions, relevant feature gates, dependency features, target assumptions and supported compiler policy. Select actual supported consumer configurations rather than testing every imaginable permutation.

| Change | Consumer question | Proportionate check |
| --- | --- | --- |
| New public parameter or return type | Must callers now own, clone or handle a new failure? | Compile an affected downstream call |
| New enum variant | Does a supported exhaustive consumer need updating? | Check a real match or compile fixture |
| Optional integration moved into core | Can a minimal consumer still avoid that dependency? | Build its documented minimal configuration |
| Feature-gated implementation changes | Does each relevant supported adapter still exist and work? | Build and exercise those adapters |
| New language/library facility | Is it available on the supported compiler and target? | Check that configuration or record the gap |

Do not add a feature matrix service or permanent fixture crate for a one-line internal change. Existing consumer tests and CI jobs are preferable when they answer the question.

## Do not rely on accidental feature activation

Cargo can combine enabled dependency features across a dependency graph. A successful workspace build may therefore conceal an undeclared expectation in an isolated consumer. Inspect the resolver and actual dependency paths before attributing behavior to one manifest entry.

Features should generally add capabilities. If the existing package documents incompatible combinations, preserve that contract and test its rejection where touched; blindly running all features can be invalid. Conversely, an unsupported combination must not become an excuse to skip ordinary supported builds.

The [Cargo feature reference](https://doc.rust-lang.org/cargo/reference/features.html) documents activation and feature unification. Use it to investigate the installed project's behavior, not to justify a broad manifest rewrite.

## Preserve domain contracts across adapters

When a public domain value gains a validated constructor, inspect every supported parser, deserializer and adapter that creates it. Restricting one constructor while an optional adapter writes unchecked fields does not establish the invariant.

Keep transport compatibility decisions at the adapter. An internal enum may be closed while a wire protocol retains unknown values for forward compatibility. Decide whether unknown input rejects, is preserved or maps to an explicit unknown state; do not turn it into an ordinary success variant silently.

Borrowing changes can also break useful callers: a return value tied to a temporary buffer may compile locally while forcing downstream code to retain an otherwise disposable owner. Prefer the smallest API that expresses the actual lifetime promise; avoid clones or lifetime machinery added only to silence one example.

## Record a bounded verification verdict

Report the public contract and supported combinations exercised, including compiler/target identity when material. Separate compilation from adapter behavior. A consumer build does not establish unsafe soundness, wire compatibility or cancellation behavior.

If the minimum compiler or relevant target is unavailable, retain that limitation. Do not claim compatibility from a newer compiler or change the support policy to make the current machine pass.
