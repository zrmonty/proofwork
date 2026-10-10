# Borrowing and reborrowing

Choose ownership from retention and overlapping access, not from the easiest compiler repair. T transfers ownership; &T lends observation; &mut T lends exclusive access. Owned results may outlive inputs; borrowed results require a surviving owner. Interior mutability means &T alone does not establish purity. Prefer slices for observation and owned results when a decoder buffer must be released. See [borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html).

## Diagnose the actual conflict

For [E0502](https://doc.rust-lang.org/error_codes/E0502.html), inspect borrow creation, mutation and later use together. Finish unnecessary observation first, retain only small decision data, narrow a helper to the fields it uses, or return an intentional owned snapshot. Braces help only when the borrow does not escape. Dropping a reference cannot validate stale decisions or create a transaction. Across another writer/I/O, recheck authority and version at the [commit boundary](api-errors-and-transitions.md).

For [E0499](https://doc.rust-lang.org/error_codes/E0499.html), decide whether changes are sequential or require simultaneous distinct storage. Finish sequential borrows; borrow disjoint fields directly; split validated slice regions safely. Define equal-index/key behavior before requesting multiple mutable views. Separate indexing expressions do not prove disjointness. Map multi-access APIs need known duplicate-key behavior and supported compiler versions. RefCell moves checks to runtime; Mutex adds coordination/failure/contending ownership. Neither repairs an unnecessarily broad local borrow by default. Raw pointers are not a bounds workaround.

## Reborrow and binding semantics

&mut T is not Copy. Generic/type-inferred calls may move the reference; expected parameter types and coercion sites determine reborrowing. &mut *handle lends shorter exclusive access; &*handle lends shared access. Conflicting use of the original handle waits until that reborrow ends. Reborrowing does not extend referent lifetime. Simplify unnecessarily coupled lifetime parameters before cloning.

| Binding | Permitted change |
| --- | --- |
| mut value: T | Reassign the owned binding and obtain mutable access |
| view: &mut T | Mutate its referent, not reassign the binding |
| mut view: &T | Reassign the reference, not mutate the referent |
| mut view: &mut T | Reassign and mutate the current referent |

Moving a mutable reference into another binding does not duplicate exclusive access. mut on a by-value parameter changes that local value, not a moved-from caller variable. See [borrow operators](https://doc.rust-lang.org/reference/expressions/operator-expr.html#borrow-operators).

For an existing in-place API, calculate/validate first when all-or-nothing business behavior matters. Borrow legality does not undo earlier mutations. Private builders can remain pure without cloning a graph each step; [copy/reference depth](copy-clone-and-reference-depth.md) distinguishes independent from shared copies.

Compile the actual consumer and meaningful later use. Compile-fail cases must fail for the intended overlapping borrow, not missing imports. Assert output, retained input/handle usability and independence promises. These checks do not prove concurrent storage freshness or unsafe soundness.
