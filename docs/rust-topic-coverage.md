# Rust coverage from the supplied lesson images

The nine images are topic inputs, not instructions or proof that an implementation works. This map covers all 75 distinct readable numbered entries. Entry 27 appears twice. Numbers 9, 60 and 61 have no readable title in the supplied views, so their contents are not inferred. Unnumbered interactive reviews and numbered review entries are handled through contract checks and worked examples.

Proofwork keeps one [Rust entry skill](../shared/skills/rust-best-practices/SKILL.md), with a [conditional topic guide](../shared/skills/rust-best-practices/references/topic-guide.md). The references are originally authored decision guidance; the lesson wording and any external skill curriculum are not imported. Depth is measured by usable contracts, failure modes and evidence, rather than an arbitrary number of files.

| Image / readable entries | Technical coverage | Primary guidance |
| --- | --- | --- |
| 1 / 1 | Rust basics, expressions, bindings, inference, primitive representations | [Foundations](../shared/skills/rust-best-practices/references/foundations-and-toolchain.md) |
| 1 / 2 | For loops and ownership of the iterated expression | [Iterator consumption](../shared/skills/rust-best-practices/references/iterator-ownership-and-consumption.md) |
| 1 / 3, 4 | Vec creation, capacity, growth, access, mutation and removal | [Vectors and slices](../shared/skills/rust-best-practices/references/vectors-arrays-and-slices.md) |
| 1 / 5, 6 | Ownership, shared/exclusive borrowing, lifetime and caller reuse | [Borrowing](../shared/skills/rust-best-practices/references/borrowing-and-reborrowing.md) |
| 1 / 7 | Type casts, checked conversion and numeric loss | [Conversions](../shared/skills/rust-best-practices/references/conversions-and-casts.md) |
| 1 / 8 | Set semantics, uniqueness, operations, ordering and key laws | [Maps and sets](../shared/skills/rust-best-practices/references/maps-sets-and-key-laws.md) |
| 2 / 10, 15, 18 | Iterator receivers, ranges, collect and method consumption | [Iterator consumption](../shared/skills/rust-best-practices/references/iterator-ownership-and-consumption.md) |
| 2 / 11 | Tuple products and destructuring versus named domain fields | [Structs and enums](../shared/skills/rust-best-practices/references/structs-enums-and-methods.md) |
| 2 / 12 | Optional data and absence contracts | [Option and Result](../shared/skills/rust-best-practices/references/option-result-and-patterns.md) |
| 2 / 13 | Review: ownership, traversal, absence and unchanged input | [Worked checks](../shared/skills/rust-best-practices/references/worked-contracts.md) |
| 2 / 14 | HashMap insertion, retrieval, borrowed keys and Entry | [Maps and sets](../shared/skills/rust-best-practices/references/maps-sets-and-key-laws.md) |
| 2 / 16, 17 | Dereference places, coercion and moving/copying through references | [Reference depth](../shared/skills/rust-best-practices/references/copy-clone-and-reference-depth.md) |
| 3 / 19, 21 | into_iter consumption versus borrowed traversal | [Iterator consumption](../shared/skills/rust-best-practices/references/iterator-ownership-and-consumption.md) |
| 3 / 20, 22 | copied/cloned and independent storage versus reference duplication | [Reference depth](../shared/skills/rust-best-practices/references/copy-clone-and-reference-depth.md) |
| 3 / 23, 26 | Borrowed conversions and multiple reference levels | [Conversions](../shared/skills/rust-best-practices/references/conversions-and-casts.md), [reference depth](../shared/skills/rust-best-practices/references/copy-clone-and-reference-depth.md) |
| 3 / 24 | Review: clone/copy/traversal reference shapes | [Worked checks](../shared/skills/rust-best-practices/references/worked-contracts.md) |
| 3 / 25 | Entry updates, duplicate policy, collection mutation and retained key ownership | [Maps and sets](../shared/skills/rust-best-practices/references/maps-sets-and-key-laws.md) |
| 3, 4 / 27 | Mutable parameters versus effects on caller-owned state | [Borrowing](../shared/skills/rust-best-practices/references/borrowing-and-reborrowing.md) |
| 4 / 28, 29 | Iteration loops and implicit IntoIterator | [Iterator consumption](../shared/skills/rust-best-practices/references/iterator-ownership-and-consumption.md) |
| 4 / 30 | enumerate and the meaning of positions | [Item shapes](../shared/skills/rust-best-practices/references/iterator-adaptors-and-item-shapes.md) |
| 4 / 31, 32 | Exclusive references and E0502 overlapping accesses | [Borrowing](../shared/skills/rust-best-practices/references/borrowing-and-reborrowing.md) |
| 4 / 33 | Non-Copy dereference without an illegal move | [Reference depth](../shared/skills/rust-best-practices/references/copy-clone-and-reference-depth.md) |
| 4 / 34, 35 | Mutable bindings, referent mutation, reassignment and reborrowing | [Borrowing](../shared/skills/rust-best-practices/references/borrowing-and-reborrowing.md) |
| 5 / 36 | Review: ownership consumed by traversal | [Iterator consumption](../shared/skills/rust-best-practices/references/iterator-ownership-and-consumption.md) |
| 5 / 37, 38, 39, 41 | iter_mut, mutable collection item shapes and enumerate | [Item shapes](../shared/skills/rust-best-practices/references/iterator-adaptors-and-item-shapes.md), [maps and sets](../shared/skills/rust-best-practices/references/maps-sets-and-key-laws.md) |
| 5 / 40 | Review: mutation, reference use and preserved invariants | [Worked checks](../shared/skills/rust-best-practices/references/worked-contracts.md) |
| 5 / 42 | E0499 overlapping exclusive borrows and proven disjoint access | [Borrowing](../shared/skills/rust-best-practices/references/borrowing-and-reborrowing.md) |
| 5 / 43; 6 / 44, 46 | Arrays, slices, fixed length, dynamic views and checked bounds | [Vectors and slices](../shared/skills/rust-best-practices/references/vectors-arrays-and-slices.md) |
| 6 / 45, 47, 50 | From, turbofish/type inference and Into | [Conversions](../shared/skills/rust-best-practices/references/conversions-and-casts.md) |
| 6 / 48, 49, 51; 7 / 53 | map/filter, reference and tuple closure arguments | [Item shapes](../shared/skills/rust-best-practices/references/iterator-adaptors-and-item-shapes.md) |
| 6 / 52; 7 / 54 | String/str and concatenation ownership/allocation | [Text boundaries](../shared/skills/rust-best-practices/references/strings-and-text-boundaries.md) |
| 7 / 55, 56; 8 / 62 | Result, match, if let and recoverable errors | [Option and Result](../shared/skills/rust-best-practices/references/option-result-and-patterns.md) |
| 7 / 57, 59 | Enums and wrappers that encode valid states | [Structs and enums](../shared/skills/rust-best-practices/references/structs-enums-and-methods.md) |
| 7 / 58; 8 / 68, 69; 9 / 72 | Debug/Copy/Clone/PartialEq/Eq/Hash derives and equality without moving non-Copy data | [Derive contracts](../shared/skills/rust-best-practices/references/derives-equality-and-hashing.md) |
| 8 / 63, 64 | Display/to_string and TryInto/TryFrom | [Conversions](../shared/skills/rust-best-practices/references/conversions-and-casts.md) |
| 8 / 65, 66, 67 | f32/f64, infinity, NaN, finite policy and ordering | [Numeric contracts](../shared/skills/rust-best-practices/references/numeric-and-float-contracts.md) |
| 9 / 70, 71, 73, 74, 75 | Structs, field borrowing, impl receivers and associated functions/constants | [Structs and methods](../shared/skills/rust-best-practices/references/structs-enums-and-methods.md) |
| 9 / 76, 77, 78 | Generics, capability bounds, supertraits and multiple constraints | [Traits and dispatch](../shared/skills/rust-best-practices/references/generics-traits-and-dispatch.md) |

Both unnumbered interactive review panels map to the worked contracts and the relevant reference's distinguishing checks. They do not create a new runtime feature or require a separate skill.

## Beyond the screenshots

The same entry retains deeper guidance for validated construction, pure next-state/effect proposals, downstream compatibility, feature isolation, locks, supervised async tasks, cancellation, partial I/O, backpressure, measured allocation/retention, adversarial inputs, unsafe/FFI, callback lifetime, pinning and manual thread-safety obligations. All twenty-three references are reachable through the topic guide. Cross-skill links carry strict coverage, clean-code limits and actual before/after performance reporting.

Coverage here means authored guidance can be found for each visible topic. Executed compiler/test evidence and remaining gaps are recorded separately in the Rust curriculum verification report; this map does not certify a project or an agent's behavior.
