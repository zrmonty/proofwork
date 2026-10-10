# Adaptors, item types and positions

## Must

- Must trace Item, closure arguments and output types.
- Must preserve source positions when diagnostics require them.
- Must retain fallible errors unless rejection policy allows dropping.
- Must detect truncated pairing when zip requires completeness.
- Must bound unbounded traversal and output expansion.
- Must preserve observable visitation and effect order.

Trace source Item, closure argument and output. [Map](https://doc.rust-lang.org/std/iter/struct.Map.html) receives Item and returns a new item; [Filter](https://doc.rust-lang.org/std/iter/struct.Filter.html) receives &Item and yields the accepted original. Thus &Record becomes &&Record in filter, &mut Record becomes &&mut Record, and a tuple (&Key,&Value) becomes &(&Key,&Value). A shared predicate borrow cannot move non-Copy fields or freely mutate through the contained exclusive handle; select then update, or use clear mutable traversal.

Destructuring owned tuples can move fields; borrowed tuple patterns can bind references. A map iterator's tuple of references differs from a slice iterator's reference to an owned tuple. [Binding modes](https://doc.rust-lang.org/reference/patterns.html#binding-modes), including edition-2024 restrictions, matter. When inference obscures ownership, use a named parameter and explicit fields rather than repeated clone/ampersand repairs.

## Select by meaning

map transforms each input; filter preserves selected items; filter_map combines optional selection/transformation. Absence and parsing failure must not disappear together without policy. flat_map intentionally expands inputs and needs output bounds. Flattening Option/Result can erase absence/errors. fold needs a valid empty identity; min/max may instead return absence. Fallible reductions retain errors and checked arithmetic.

any/all/find short-circuit. They decide a query, not certify every record was independently validated. Side-effectful predicates make visitation count/order observable. See [iterator execution](iterator-ownership-and-consumption.md).

## Positions and paired traversal

[Enumerate](https://doc.rust-lang.org/std/iter/struct.Enumerate.html) returns traversal position, not domain ID. Filtering first renumbers survivors; enumerating first retains positions from that traversal. Reversed traversal still counts its own order. Carry original index/ID before transformation when diagnostics require it. Do not zip survivors with the unfiltered source. Mutable enumeration lends the element: indexing its owner again does not establish disjointness.

[Half-open ranges](https://doc.rust-lang.org/std/ops/struct.Range.html) exclude end; [inclusive ranges](https://doc.rust-lang.org/std/ops/struct.RangeInclusive.html) include it. Do not repair bounds through unchecked end+1. Define reversed/empty behavior without silently reordering user intent. Unbounded ranges/streams require termination and input/output budgets; laziness is not resource control. Use indices only when positional algorithms genuinely need them.

[Zip](https://doc.rust-lang.org/std/iter/struct.Zip.html) stops at the shorter input. Pairwise completeness needs length validation or an explicit stream mismatch policy. Independent hash orders cannot implement a shared-key join; join by identity.

A loop/private accumulator may explain ordered validation, related outputs or early exit better than dense chains. Fuse one-use traversal when clear; materialize bounded snapshots for repeatability or validation-before-publication. Measure equivalent completed work before claiming allocation/performance improvement.

Probe owned/borrowed/mutable/tuple closure types, non-Copy fields, empty/boundary inputs, unequal lengths, filtered-middle diagnostics and preserved failure/order/duplication policy. Tests should assert the contract, not adaptor selection unless laziness/ownership is itself public.
