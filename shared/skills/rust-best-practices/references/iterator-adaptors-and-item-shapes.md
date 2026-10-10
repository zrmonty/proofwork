# Iterator adaptors and item shapes

Read when map/filter closures have confusing references, tuple patterns hide moves, ranges create boundary errors, or a chain becomes harder to understand than a loop.

## Trace the item at each stage

For every non-obvious pipeline, identify its source `Item`, closure argument and output item. Method names do not describe the reference depth or ownership of a custom iterator.

| Source item | Argument to map | Argument to filter | Filter output |
| --- | --- | --- | --- |
| `Record` | `Record` | `&Record` | `Record` |
| `&Record` | `&Record` | `&&Record` | `&Record` |
| `&mut Record` | `&mut Record` | `&&mut Record` | `&mut Record` |
| `(&Key, &Value)` | `(&Key, &Value)` | `&(&Key, &Value)` | `(&Key, &Value)` |

Map receives the item by value and produces a new item. Filter borrows the item for its predicate, then yields the original item when accepted. Its predicate cannot move a non-Copy field out of that borrow. Check the declared contracts in [Map](https://doc.rust-lang.org/std/iter/struct.Map.html) and [Filter](https://doc.rust-lang.org/std/iter/struct.Filter.html).

Consequently, filtering mutable references is suitable for deciding which references to keep; performing mutations through a predicate's shared borrow of a mutable reference is a different operation. Apply the change after selection or use a clear mutable traversal.

## Pattern ergonomics do not erase ownership

Destructuring an owned tuple can move its non-Copy fields. Destructuring a borrowed tuple can bind references through match ergonomics. An explicit reference pattern can change how binding modes apply. Read the bound variable types instead of adding or removing ampersands until compilation succeeds.

Edition 2024 adjusts which explicit reference and binding modifiers are permitted with inherited binding modes. For edition-sensitive patterns, use a named closure parameter and explicit field access as the simple fallback, then verify against the supported edition. See [binding modes](https://doc.rust-lang.org/reference/patterns.html#binding-modes).

For a map's borrowed iterator, the item is already a tuple of references. This differs from iterating a slice of owned tuples, where the item is a reference to a tuple. Both can look similar when a closure pattern uses automatic borrowing; their move and cloning behavior need separate reasoning.

Nested references frequently originate in a collection of references followed by shared iteration, or in filter's extra predicate borrow. Correct the contract where that layer is introduced. Do not clone a value merely to avoid understanding the parameter type.

## Select adaptors by result meaning

Use map when each accepted input becomes one output. Use filter when acceptance preserves the original item. Use filter_map when absence is the defined output of a combined selection/transformation. A missing optional field and a failed parse are different outcomes; do not make both disappear unless the contract permits it.

Use flat_map when one input intentionally expands to zero or more outputs. A large expansion needs an output budget at the boundary. Flattening optional/result-like values can erase absence or errors; preserve their meaning before choosing a convenient adaptor.

Use fold for a complete reduction with a documented empty-input identity. A minimum or maximum may instead be absent for empty input; do not invent a sentinel indistinguishable from valid data. A fallible reduction should retain its error channel and checked arithmetic rather than hide failure in an accumulator default.

Short-circuiting queries such as any/all/find can avoid visiting later inputs. They are appropriate for a decision, not evidence that every item passed an independent validation. If a predicate logs, mutates or performs I/O, the execution count becomes observable. See [Iterator consumers and adaptors](https://doc.rust-lang.org/book/ch13-02-iterators.html).

## Preserve index meaning

Enumerate supplies the traversal position, not a database ID or an original source position after earlier filtering. Filtering then enumerating renumbers survivors; enumerating then filtering retains positions from that traversal. A counter into a reversed traversal is likewise a traversal counter. See [Enumerate](https://doc.rust-lang.org/std/iter/struct.Enumerate.html).

Carry the original index or domain ID before a transformation if errors must identify the original input. Do not zip survivors with the unfiltered source and assume positions still correspond.

For mutable traversal, enumerate associates a counter with each yielded mutable reference. It does not give permission to obtain another overlapping mutable reference by indexing the same collection. Update through the yielded reference; use safe disjoint-borrow APIs when two elements must be processed together.

## Ranges have explicit endpoints

Half-open `start..end` excludes its end. Inclusive `start..=end` includes it. Select the endpoint policy from the domain instead of repairing off-by-one errors with unchecked `end + 1` arithmetic. See [Range](https://doc.rust-lang.org/std/ops/struct.Range.html) and [RangeInclusive](https://doc.rust-lang.org/std/ops/struct.RangeInclusive.html).

An empty or reversed input range should have a defined interpretation: empty work, validation error or reordered bounds. Do not silently reorder time windows or financial ranges when that changes user intent.

Use direct item iteration when indices serve only to retrieve elements. Keep index-based processing when neighboring positions or a positional algorithm make the index meaningful. Bounds derived from untrusted input still require validation; iteration syntax does not validate the domain.

An unbounded range requires an explicit termination or work limit. On external streams, enforce input and output budgets even when processing is lazy; laziness alone is not resource control.

## Zip is not a length validator

Zip produces pairs only while both inputs supply an item. Unequal inputs can therefore lose an unmatched suffix. Validate lengths when pairwise completeness matters, or use an explicit mismatch policy for streams. See [Zip](https://doc.rust-lang.org/std/iter/struct.Zip.html).

Avoid assuming that two collections' independent iteration orders align semantically. Hash-map iteration order is not a shared-key join. Join by key or normalize into a representation whose ordering contract is explicit.

## A loop can be the clearest calculation

Prefer pure functions for decisions and transformations. This does not require every function body to be one iterator expression. A loop with a private accumulator can express ordered validation, multiple related outputs or early exit more clearly than several coordinated chains.

Avoid allocating intermediate vectors when their contents are used once and a readable traversal suffices. Conversely, materialize a bounded snapshot when repeatable processing or validation before publication needs it. Measure before claiming that a fused chain improves speed or memory.

Extract a predicate or transformation when it has a meaningful independent contract. Prefer readable control flow to dense chains or arbitrary forwarding helpers.

## Proof obligations

- Verify exact closure parameter types for owned, borrowed, mutable and tuple-yielding sources.
- Include empty input, the first/last valid element, unequal paired lengths and a filtered middle element.
- Confirm reported indexes identify the required source position rather than a survivor counter.
- Confirm a non-Copy field is borrowed or moved intentionally; cloning should have a reason.
- Check the chosen failure policy without silently dropping an error.
- For performance work, compare equal completed work and preserve order, duplication and validation timing.

These checks target the contract. Tests that assert a particular adaptor was called add little value unless its laziness or ownership is itself the interface being tested.
