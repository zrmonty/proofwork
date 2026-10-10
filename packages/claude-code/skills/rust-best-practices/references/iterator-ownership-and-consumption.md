# Iterator ownership and consumption

Read when a traversal moves a collection unexpectedly, retains a borrow, duplicates values, or performs only part of the intended work.

## Choose the ownership contract first

An iterator is a stateful traversal object. Its yielded `Item` determines what the consumer receives; the spelling of the loop does not establish the ownership policy.

For a vector, distinguish these interfaces before changing a traversal:

| Input expression | Yielded item | Caller consequence |
| --- | --- | --- |
| `values.iter()` or `&values` in a for loop | `&T` | Read elements while the shared borrow is active. |
| `values.iter_mut()` or `&mut values` in a for loop | `&mut T` | Change elements through exclusive borrows. |
| Owned `values` through `into_iter()` or a for loop | `T` | Transfer element ownership; the original vector is consumed. |

A consuming iterator can yield references when the collection itself stores references. Consuming `Vec<&Record>` moves its reference elements, not the records they point at. Name both the container owner and the pointee owner during review.

For loops use `IntoIterator`. Generic traversal APIs should express the actual required `Item`, rather than demanding a vector when an iterator suffices. Conversely, a slice is clearer when random access, repeated traversal or a known length is part of the contract. See [IntoIterator](https://doc.rust-lang.org/std/iter/trait.IntoIterator.html).

Do not repair a moved-value error by cloning an entire collection before deciding whether ownership transfer was needed. If the caller still needs the values, borrow them or make the intentional copy visible at the point where independent ownership is required.

## Array iteration requires edition awareness

Owned arrays gained `IntoIterator` in Rust 1.53. The method call `array.into_iter()` has compatibility behavior in editions 2015 and 2018: it resolves as borrowed iteration. Edition 2021 changes that method call to owned iteration. A for loop over an owned array and explicit `IntoIterator::into_iter(array)` use the owned implementation across editions where that implementation exists.

During an edition migration, identify the yielded type and whether a non-Copy array remains usable afterward. Use `array.iter()` for a deliberately borrowed contract. Verify examples under the repository's edition and minimum supported Rust version; current documentation can expose APIs newer than that minimum. See the [array migration rule](https://doc.rust-lang.org/edition-guide/rust-2021/IntoIterator-for-arrays.html).

## Copy or clone the intended layer

`copied()` transforms an iterator yielding `&T` into one yielding `T` when `T: Copy`. If `T` is itself a reference, the result still borrows the original object. A copied reference does not create an independent record or extend the record's lifetime. See [Copied](https://doc.rust-lang.org/std/iter/struct.Copied.html).

`cloned()` uses `Clone` for the yielded referent. With `Item = &&Record`, that referent is `&Record`, so cloning it reproduces a reference. With `Item = &String`, cloning the referent produces an owned String. Neither syntax implies a deep copy of everything reachable through the value. See [Cloned](https://doc.rust-lang.org/std/iter/struct.Cloned.html).

Write the item type before and after a transformation when it is unclear: `&&Record` to `&Record` differs from `&Record` to `Record`. Keep clones after selective filtering when independence is needed only for survivors, unless that changes observable clone behavior required by the contract.

A collection of borrowed outputs remains tied to its source. Returning references to a locally constructed vector is invalid. Returning references into a caller-owned slice can be useful if the lifetime relationship is intentional. Returning small owned summaries may provide a simpler interface than retaining the entire source buffer.

## Laziness moves work into the consumer

Constructing a map or filter pipeline does not execute its transformations. A consumer advances it. Dropping the pipeline, consuming a prefix or returning early can leave planned work undone. Treat side effects in lazy closures as partial effects, not a complete batch.

Use explicit effect execution after pure planning when all validations must finish before writes begin. A private mutable accumulator inside a calculation is compatible with a pure outer interface; externally visible mutation during traversal has different failure and rollback obligations.

Methods taking the iterator by value consume that traversal object; a borrowed iterator can be consumed without transferring ownership of its underlying collection. `by_ref()` allows a temporary traversal borrow when later work must continue from the same cursor. Exhaustion is a cursor state, not evidence that the collection was moved. See [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

## Early exit is part of the domain policy

For a stream of `Result<T, E>`, collecting into `Result<Vec<T>, E>` stops at the first error and returns that error. It does not aggregate all failures or preserve a partial success vector for the caller. Work completed by earlier iterator closures has already happened. See [Result collection](https://doc.rust-lang.org/std/result/enum.Result.html#impl-FromIterator%3CResult%3CA,+E%3E%3E-for-Result%3CV,+E%3E).

Choose the required policy explicitly:

- Reject the whole calculated result on the first invalid item when one error is enough.
- Accumulate indexed failures and valid outputs when partial acceptance is a real product requirement.
- Validate all inputs before any effect when a batch must avoid partial publication.

Do not substitute `filter_map(Result::ok)` or flattening results for error handling. Those operations discard the error channel. If dropping rejected records is intended, account for rejection without exposing private input data.

## Mutable traversal without accidental shared state

Use `iter_mut()` for an element update that is intentionally in place. Do not also structurally modify the same vector through its owner while yielded mutable element borrows are live. For filtering/deletion, choose a collection operation whose contract owns that structural change, or compute a replacement value separately.

Mutable map traversal yields shared keys and mutable values. Do not attempt to change a key in place: lookup identity must remain valid. Re-keying is a remove-and-insert operation with its own collision policy.

A function that consumes an owned vector, changes its private elements and returns the next vector can still make state transition semantics explicit. Avoid unnecessary full clones just to eliminate local mutation. Prefer whichever implementation exposes input, output and failure policy most clearly.

## Proof obligations

Use targeted checks that would fail if the ownership or execution policy changed:

- After a borrowed calculation, the caller can still use the source and its contents remain unchanged.
- Owned output survives source destruction when independent ownership is promised.
- A cloned reference result still has the intended source lifetime; it is not advertised as an owned record.
- A failing item stops later processing under fail-fast policy, and earlier effects are accounted for.
- A prefix-consuming operation does not claim to have validated unvisited input.
- Edition-sensitive array examples compile under the declared supported edition/MSRV.

Compiler checks establish borrow and move validity. Behavioral checks establish ordering, partial acceptance and domain meaning. Neither proves a performance improvement; measure representative work before changing iteration solely for speed.
