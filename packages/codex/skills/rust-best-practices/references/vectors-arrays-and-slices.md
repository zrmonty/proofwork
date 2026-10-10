# Sequence representation and mutation

## Must

- Must distinguish allocated capacity from initialized length.
- Must validate external counts before allocation and indexing.
- Must preserve required element order and identity.
- Must define partial-progress behavior for destructive traversal.
- Must establish disjointness through supported safe APIs.
- Must respect storage invalidation and borrowed lifetimes.

Choose [array](https://doc.rust-lang.org/std/primitive.array.html) for type-level fixed length, [Vec](https://doc.rust-lang.org/std/vec/struct.Vec.html) for owned variable length, &[T] for contiguous observation, &mut [T] for changing elements without resizing. Frequent front removal may warrant an incumbent queue. Arrays are homogeneous; domain-named heterogeneous fields often need structs rather than long tuples. Check [array iteration compatibility](https://doc.rust-lang.org/edition-guide/rust-2021/IntoIterator-for-arrays.html) against edition/MSRV.

Length counts initialized elements; capacity reserves storage, not values. Reservation does not resize. Validate external counts and checked size arithmetic before allocation. Fallible reservation does not make every later allocation recoverable. Do not assume a fixed growth factor or shrink after each operation. Retention limits depend on input size/concurrency, not one capacity observation. Extra capacity cannot waive aliasing, movement, destruction or raw-pointer invalidation.

## Access and identity

Use [checked access](https://doc.rust-lang.org/std/primitive.slice.html#method.get) for external or changing positions. Bounds do not establish element identity after sorting/deletion. Half-open ranges need ordered endpoints within current length; inclusive ranges need overflow/empty policy. Negative external indices must not become huge unsigned casts. A local proved invariant may justify indexing, but comments alone cannot protect public inputs. Errors need context without secret payloads.

## Mutation contract

remove preserves relative order; swap_remove moves the last element and needs unordered semantics. Sorting/deduplication can change business meaning. Decide removed-value ownership, source preservation and partial-progress policy before choosing an API.

[Drain](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.drain) is destructive: dropping a partial drain does not restore the range, and leaking it forfeits ordinary destructor assumptions. It cannot preview a fallible export. Validate first, retain necessary ownership, or report explicit partial progress. A retain predicate executing effects confuses selection with execution; separate intended selections/effects when retry or rollback matters.

For simultaneous distinct mutable regions, use a supported [safe split](https://doc.rust-lang.org/std/primitive.slice.html#method.split_at_mut) after validating boundaries and empty-region policy. Define equal-index behavior before two-position access. Current bounds matter after resizing. Checked/multi-access APIs require supported stabilization versions. Different raw addresses alone do not prove alignment, provenance or aliasing safety.

Borrowing a Vec as a slice avoids allocation; producing owned elements from a borrow requires legitimate duplication. Runtime input converted to [T; N] needs a wrong-length outcome. Fixed binary length does not validate encoding, endianness, checksum or authorization.

Probe empty/single/boundary/inverted ranges, first/middle/last removal with required order, duplicate semantics, interrupted destructive iteration, rejected excessive counts before excessive allocation, and both array/vector slice callers. Check relevant debug/release numeric behavior. Assert contracts rather than loop/adapter syntax; compile success does not establish semantic freshness or deployment memory bounds.
