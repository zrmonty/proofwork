# Key identity and collection policy

## Must

- Must define duplicates, ordering and representative-key policy.
- Must make equal keys hash equally.
- Must preserve stored identity against interior mutation.
- Must make borrowed lookup match owned equality and hashing.
- Must validate counts and bound adversarial input.
- Must join independently ordered collections by key identity.

Choose maps for association, sets for membership, ordered storage for ranges/presentation, sequences for small stable lists, or indexed storage for genuinely dense validated identities. Repeated events must not disappear into a set. Duplicate map keys need explicit reject/replace/group policy. Hash iteration is not stable serialization order: sort at the output boundary or use ordered storage.

## Identity laws

Equal keys must hash equally; collisions do not imply equality. Derive only when the fields match actual identity. Normalize at construction under explicit Unicode/locale policy, not changing configuration. Key equality/hashing must remain stable while stored, including through interior mutation. Remove/reconstruct legitimately changed keys. Incorrect key laws are collection logic errors, not blanket undefined behavior; see [HashMap](https://doc.rust-lang.org/std/collections/struct.HashMap.html).

[Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html) requires compatible equality/order/hash identity; AsRef merely exposes a view. Ordinary str cannot represent case-insensitive identity through Borrow unless those semantics actually agree. Borrowed lookup can avoid allocations, but different normalization is not the same query. Borrowed keys retain owners; compact owned keys can avoid holding an entire input buffer.

## Local updates and representatives

[Entry](https://doc.rust-lang.org/std/collections/hash_map/enum.Entry.html) associates occupied/vacant decisions with one lookup. Initialize lazily when construction is expensive/effectful; keep checked counter arithmetic, replacement policy and fallible prevalidation explicit. End the entry borrow before conflicting collection operations. Entry does not transact across threads/locks/database boundaries; the real owner protects that invariant.

[HashSet](https://doc.rust-lang.org/std/collections/struct.HashSet.html) uniqueness and stored representative are separate decisions. Equal objects can carry different metadata; insertion does not necessarily update it. Choose existing/incoming/merged representation and visible ordering for set operations. A map keyed by immutable identity may better express independent metadata changes. Test membership and representation separately.

## Resource and mutation limits

Bound entry count, key/value sizes and retained lifetimes: count alone cannot bound bytes. Reject excessive input before fully allocating it. Replacing the default hasher changes collision-attack tradeoffs; use provenance and measured workload, not a supposedly permanent algorithm name. Sorting output and adversarial hashing solve different problems. Large spare capacity may affect scans; repeated rebuilding/shrinking can cost more than retained storage. Measure complete lookup/update/export work and skewed input through [representation evidence](performance-and-representation.md).

Mutable map iteration lends values, not identity-changing keys; sets cannot offer arbitrary mutable keys while preserving hash laws. Consuming iteration transfers entries, borrowing iteration retains collection ownership, and collected references retain source lifetimes. Drain/deletion changes state. Fallible/effectful callbacks need prevalidation or explicit partial outcomes; early exit is not rollback. Use supported APIs.

Probe equal identities/different metadata, normalization boundaries, duplicate dispositions, borrowed hit/miss, equal-hash law and meaningful unequal variants, deterministic export across insertion orders, overflow rejection preserving state, excessive key count/length and competing updates under the actual commit owner. These checks do not prove database atomicity or universal hostile-input performance.
