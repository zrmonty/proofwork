# Rust topic guide

Choose the reference that answers the current decision. Keep one Rust entry skill; do not load this entire library for an ordinary edit. Begin with the actual input/item type, owner, valid domain state and supported toolchain. Follow cross-links only when the operation crosses that boundary.

## Foundations and data ownership

| Task or symptom | Read | Decision to settle |
| --- | --- | --- |
| Basic syntax, type inference, tuples, units, build settings, size rules | [Foundations and toolchain](foundations-and-toolchain.md) | What the expression returns; which edition, compiler, feature and target the caller supports |
| Ownership transfer, borrowing, mutability, lifetime or E0502/E0499 | [Borrowing and reborrowing](borrowing-and-reborrowing.md) | Who owns the place; when each borrow is last used; whether access is disjoint |
| Dereferencing non-Copy data, cloning a reference, copied/cloned, nested references | [Copy, Clone and reference depth](copy-clone-and-reference-depth.md) | Which layer is copied, borrowed or moved; whether storage is independent |
| Vec growth/removal, array size, slices, bounds or collection retention | [Vectors, arrays and slices](vectors-arrays-and-slices.md) | Ordering, lifetime, index and allocation requirements |
| HashMap, HashSet, Entry, duplicate policy or custom keys | [Maps, sets and key laws](maps-sets-and-key-laws.md) | Equality/hash compatibility, key ownership, ordering and resource bounds |
| Existing domain ownership or borrowed ledger | [Ownership and domain](ownership-and-domain.md) | Caller reuse, validated construction and recoverable input errors |

## Traversal, transformations and text

| Task or symptom | Read | Decision to settle |
| --- | --- | --- |
| For loops, iter/iter_mut/into_iter, range, collect, one-shot traversal | [Iterator ownership and consumption](iterator-ownership-and-consumption.md) | Exact Item, receiver ownership and consumption/error timing |
| map/filter, tuple patterns, enumerate, zip or adaptor chains | [Iterator adaptors and item shapes](iterator-adaptors-and-item-shapes.md) | Closure argument types, original versus filtered positions, laziness and truncation |
| as, From/Into, TryFrom/TryInto, FromStr, turbofish, AsRef/Borrow/Deref | [Conversions and casts](conversions-and-casts.md) | Lossless, fallible or borrowed conversion; type inference and validation |
| String/str, concatenation, slicing or display truncation | [Strings and text boundaries](strings-and-text-boundaries.md) | UTF-8 bytes, scalars or graphemes; ownership, normalization and limits |
| Concrete examples to compile and inspect | [Worked contracts](worked-contracts.md) | Observable preserved input, exact item shapes, failure policy and accepted reborrowing |

## Domain types and public APIs

| Task or symptom | Read | Decision to settle |
| --- | --- | --- |
| Option/Result, match, if let, let else or error propagation | [Option, Result and patterns](option-result-and-patterns.md) | Absence versus failure, exhaustiveness, borrowed matching and recovery |
| Structs, enums, wrappers, impl, mutable methods or associated items | [Structs, enums and methods](structs-enums-and-methods.md) | Valid construction, receiver effects and public state evolution |
| Generic parameters, trait bounds, supertraits or dispatch | [Generics, traits and dispatch](generics-traits-and-dispatch.md) | Needed capability, associated types, lifetimes and static/runtime boundary |
| Integer overflow, f32/f64, infinity, NaN or comparison | [Numeric and float contracts](numeric-and-float-contracts.md) | Representability, arithmetic, finite admission, rounding and ordering policy |
| Debug/Copy/Clone/PartialEq/Eq/Hash derives or non-Copy equality | [Derives, equality and hashing](derives-equality-and-hashing.md) | Semantic commitments, shared storage and disclosure |
| Pure next-state proposals, domain errors, public signatures | [APIs, errors and transitions](api-errors-and-transitions.md) | Recovery categories, unchanged input and authoritative conditional commit |
| Feature/MSRV/consumer compatibility | [Downstream compatibility](downstream-compatibility.md) | What consumers actually build and which changes break their contracts |

## Resources and demanding systems work

| Task or symptom | Read | Decision to settle |
| --- | --- | --- |
| Locks, shared ownership, blocking work and verification tools | [Resources and verification](resources-and-verification.md) | Resource owner, cleanup, observation and tool limits |
| Futures, tasks, queue bursts, partial I/O, cancellation or shutdown | [Async cancellation and backpressure](async-cancellation-and-backpressure.md) | Admission, task/result bounds, partial progress and supervised completion |
| Allocation, retained memory, representation, adversarial input or optimization | [Performance and representation](performance-and-representation.md) | Measured cost without changing order, failure or ownership semantics |
| Raw storage, unsafe, FFI, callbacks, pinning or manual Send/Sync | [Unsafe and FFI invariants](unsafe-ffi-and-invariants.md) | Enforced validity, lifetime, destruction, unwind and concurrency obligations |

Each topic should end in a decision and a check that can distinguish a correct implementation from its likely mistake. Mechanism knowledge does not justify extra abstractions, unconditional clones or speculative optimizations. A clean case can receive a clean verdict.
