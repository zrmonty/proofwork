# Maps, sets and key laws

Read when introducing keyed lookup, uniqueness, counters, caches, grouping or deduplication. Specify what counts as the same key and whether order or duplicates carry meaning before picking a collection.

## Representation follows the required operation

| Requirement | Candidate to consider | Question that can disqualify it |
| --- | --- | --- |
| Associate one value with an identity | Map | Are repeated identities an error, replacement or grouping? |
| Membership without repeated equal values | Set | Do duplicates represent independent events? |
| Predictable key order or ranges | Ordered map/set | Does comparison express the domain's required ordering? |
| Small stable list | Existing sequence | Is a new hash allocation justified by measured lookup work? |
| Dense bounded index domain | Existing indexed representation | Are identifiers actually dense and validated? |

Do not replace an event list with a set: equality can erase legitimate repeated occurrences. Do not use a map's default replacement behavior when duplicate records must reject. Choose the behavior and test it independently of storage.

Hash-based iteration is not a presentation or serialization order. If an exported artifact needs stable ordering, choose ordered storage or sort at the output boundary according to the actual contract. Tests should not accidentally depend on one process's hash order.

## Equality and hashing must describe the same identity

For keys, equal values must produce equal hashes under the same hashing setup. The converse is unnecessary: collisions are possible. Deriving compatible traits is appropriate when all fields determine identity; custom implementations need an explicit identity definition.

Do not derive equality over every field and hash only a normalized subset while pretending to have case-insensitive identity. Settle normalization, including Unicode and locale policy, at construction. Different spellings can be different domain identities even if a display treats them alike.

Key identity must remain stable while stored. Interior mutation or dependence on changing global configuration can break that requirement even when the map exposes no mutable key reference. Remove and reconstruct a key under the map's contract when identity legitimately changes.

These are collection logic errors, not permission to label every incorrect hash implementation undefined behavior. The [HashMap contract](https://doc.rust-lang.org/std/collections/struct.HashMap.html) documents the bounded consequences and key requirements.

For a domain key, test equal constructed values, unequal meaningful variants and normalization boundaries. A test with only one key cannot expose a mismatched identity definition.

## Borrowed lookup must preserve identity semantics

A map owning String keys can often be queried using a string slice without allocating another String. General borrowed lookup depends on a compatible `Borrow` relationship, not merely a convenient view conversion.

`Borrow` requires the borrowed view to agree with the owned value's relevant equality, ordering and hashing. `AsRef` does not impose that identity promise. A case-insensitive owned key cannot claim an ordinary case-sensitive string slice as an equivalent borrowed identity just to save an allocation.

See the [Borrow contract](https://doc.rust-lang.org/std/borrow/trait.Borrow.html). Keep normalization and lookup policy together. An inexpensive borrowed miss with different semantics is not an optimization of the same query.

When a new key must be retained, choose its owned form deliberately. A key borrowing a temporary input buffer forces that buffer to outlive the collection; allocating a compact identity can be preferable to retaining a large source payload.

## Use Entry for a local decision, not a transaction

The Entry API keeps occupied versus vacant handling associated with one keyed lookup. It fits local counters, initialization and updates when their duplicate policy is clear.

- Use lazy initialization when creating a value is expensive or has observable consequences.
- Keep counter overflow policy explicit; entry mutation does not make ordinary addition checked.
- Inspect what happens to an existing value before using insert/replacement.
- End the mutable entry borrow before other operations needing the collection.
- Validate fallible proposed changes before publishing them if the contract rejects partial mutation.

A contains-check followed by insert may be needlessly repetitive locally. Entry still does not make a shared application operation atomic across locks, threads or a database. The owning synchronization/commit boundary must protect the actual invariant.

The [Entry documentation](https://doc.rust-lang.org/std/collections/hash_map/enum.Entry.html) defines occupied/vacant operations. Generic helper chains should not obscure which branch allocates, rejects or changes the value.

## Sets define both uniqueness and representatives

A set's equality determines membership, while other fields may differ between equal objects. Decide which representative should remain: the existing object, the incoming one or a merged result. Do not assume insertion updates all stored metadata.

Set intersection/union/difference express membership relationships. Their output needs an explicit presentation order when visible to users. Equal representatives with different auxiliary fields can make the selected object matter even when membership is correct.

For objects whose metadata changes independently of identity, a map keyed by immutable identity may express the update more clearly than a set of full records. Choose it only when that matches the domain, not because it has more methods.

The [HashSet contract](https://doc.rust-lang.org/std/collections/struct.HashSet.html) grounds insertion, replacement and set operations. Test membership and representative policy separately.

## Bound memory and attack cost

Record maximum key count, key size, value size and retained lifetimes for untrusted input. A bounded entry count alone does not bound total bytes. Reject excessive requests before allocating their full data structures.

The default hash setup is selected with collision attacks in mind; replacing it changes the threat/performance tradeoff. Keep the incumbent hasher unless representative evidence and key provenance justify a change. Do not depend on its current named algorithm as a permanent interface.

Predictable key ordering and adversarial hashing are different concerns. Sorting output can solve presentation order without replacing the hash policy. Choosing an ordered collection changes comparison and allocation costs and should still be measured for the actual workload.

Large retained capacity can make repeated scans expensive even when few entries remain. Compare full lookup/update/export work, peak retained bytes and skewed input. Rebuilding or shrinking after every deletion may cost more than it saves.

Link material performance changes to [the measurement reference](performance-and-representation.md); do not infer faster code from fewer lookup-shaped expressions.

## Mutation, removal and iterator ownership

A map's mutable iteration lends mutable values while its keys retain their identity contract. A set cannot safely offer arbitrary mutable keys under hashing invariants. Do not bypass those differences with interior mutability.

Borrowing iteration preserves the collection; consuming iteration transfers owned entries. Collected references still require surviving owners. A deletion or drain is a state change, not an observation.

If a callback can fail or execute effects, decide whether the operation must validate first, retain partial progress or return an explicit partial result. Do not interpret early exit as rollback. Use supported APIs on the project's compiler rather than requiring newer convenience methods incidentally.

## Acceptance probes

- Same identity with different metadata; duplicate insertion, replacement and rejection policies.
- Borrowed hit/miss without changed normalization; independent owned key construction.
- Equal keys yielding compatible hashes, plus meaningful unequal variants.
- Export ordering with different insertion sequences and separate map instances.
- Counter boundary overflow and rejection preserving promised state.
- Adversarial key lengths/counts rejected before excessive resource use.
- Competing updates under the actual owner/lock/version mechanism when concurrency is part of the change.

A collection test establishes these observed contracts. It does not establish database atomicity, arbitrary hostile-input performance or every custom trait implementation's correctness.
