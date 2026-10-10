# Iterator ownership and execution

An iterator is a stateful cursor; its Item establishes what is yielded. For Vec<T>, iter/shared for-loop yields &T; iter_mut/mutable for-loop yields &mut T; owned into_iter/for-loop yields T and consumes the vector. Consuming Vec<&Record> transfers references, not records. Prefer [IntoIterator](https://doc.rust-lang.org/std/iter/trait.IntoIterator.html) with the needed Item for one traversal, or a slice when length, repeated traversal or random access matters. Do not clone before deciding whether consumption is required.

## Edition and reference layers

Owned-array IntoIterator exists from Rust 1.53. array.into_iter() retains borrowed compatibility behavior in editions 2015/2018; edition 2021 changes that method call to owned iteration. Owned for-loops and explicit IntoIterator::into_iter use the owned implementation where supported. Verify non-Copy array reuse under the actual edition/MSRV using [the migration rule](https://doc.rust-lang.org/edition-guide/rust-2021/IntoIterator-for-arrays.html).

[copied](https://doc.rust-lang.org/std/iter/struct.Copied.html) and [cloned](https://doc.rust-lang.org/std/iter/struct.Cloned.html) remove one item-reference layer under their trait bounds; use [Copy/Clone contracts](copy-clone-and-reference-depth.md) rather than repeating their ownership reasoning here. Borrowed collections/results still require surviving sources; owned summaries may avoid retaining a large buffer.

## Laziness, cursors and failure

Creating map/filter does not execute work. Consumption of a prefix, early exit or dropping the pipeline leaves unvisited work undone. Effectful closures therefore have partial-progress obligations. Validate all required inputs before publication when the batch requires that boundary; private accumulators can produce deterministic results.

A consumer takes the traversal object, not necessarily ownership of its underlying collection. by_ref temporarily borrows the same cursor for later continuation. Exhaustion is cursor state, not proof that the collection moved. See [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

[Collecting Results](https://doc.rust-lang.org/std/result/enum.Result.html#impl-FromIterator%3CResult%3CA,+E%3E%3E-for-Result%3CV,+E%3E) stops at the first error without returning accumulated successes; earlier effects have already happened. Choose fail-fast calculation, indexed partial acceptance, or validate-before-effects explicitly. filter_map(Result::ok)/flatten can erase errors; intended rejection still needs accounting without secret input disclosure.

Mutable element iteration cannot also structurally modify its vector while conflicting borrows live. Mutable map traversal lends shared keys/mutable values: re-key through remove/insert with collision policy. Consuming an owned vector, privately updating and returning it can be a clear transition without full cloning. Use [collection contracts](vectors-arrays-and-slices.md) for destructive operations.

Compile meaningful later source use; assert unchanged borrowed inputs, output surviving source destruction, fail-fast stopping, accounted earlier effects and unvisited-prefix limits. Include non-Copy values and edition-sensitive arrays. Type checks establish moves/borrows; behavior checks establish execution policy, not a speedup.
