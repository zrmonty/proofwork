# Copy, Clone and exact reference types

## Must

- Must identify each iterator and closure reference layer.
- Must distinguish copied handles from independent owned storage.
- Must preserve the lifetime of collected borrowed values.
- Must select the intended Clone receiver and output type.
- Must avoid moving non-Copy contents through shared references.
- Must treat public Copy as a consumer commitment.

Determine the container element, iterator Item and closure argument before adding dereferences or cloning. Vec<T>::iter yields &T, iter_mut yields &mut T, consuming into_iter yields T. Vec<&T>::iter yields &&T; consuming it yields &T without owning referents. map receives Item; filter receives &Item. Use a temporary type annotation when needed. See [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

[Copy](https://doc.rust-lang.org/std/marker/trait.Copy.html) requires Clone and excludes destructor types. Shared references are Copy; mutable references are not. Copying a reference preserves the same referent/lifetime. Public Copy is a compatibility promise; resource-owning future fields and one-use capabilities may make implicit duplication inappropriate even when today's fields permit it.

[Clone](https://doc.rust-lang.org/std/clone/trait.Clone.html) follows the implementing type. Owned text/vector clones duplicate their storage according to element behavior; nested handles may remain shared. Autodereference can select a referent's Clone implementation, so calling clone on a reference does not invariably clone the reference. Specify output type or qualify the intended trait/receiver. [Arc::clone](https://doc.rust-lang.org/std/sync/struct.Arc.html) adds an owner of the same allocation without synchronizing or copying its contents. Equal values immediately after cloning do not prove snapshot independence.

| Item | Adapter | Result |
| --- | --- | --- |
| &u32 | copied | u32 |
| &&Record | copied | &Record |
| &String | cloned | String |
| &&String | cloned | &String |

These adapters remove one item-reference layer, not every borrowed layer. Collected references still need their original owners. Clone after filtering when only survivors need copies, provided predicate/error/effect order is preserved. Project an identifier rather than copying an entire record when that is all the consumer needs. Conversely, do not offer borrowed output when callers require independent records.

[Dereferencing](https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-dereference-operator) names a place. Borrowing or calling an appropriate method on a non-Copy place is valid; moving owned contents out through a shared reference is the conflict. Inspect pattern binding mode and edition. Mutable removal/replacement needs a replacement preserving the slot invariant, not an arbitrary default.

Coercion, AsRef, Borrow, From and TryFrom are distinct [conversion contracts](conversions-and-casts.md). Generic bounds are checked against the supplied type; autodereference cannot invent trait implementations. Remove an accidental outer reference or request the intended owned/borrowed view deliberately, never through unsafe casts.

Compile retained caller use after consuming versus borrowing operations. Test with non-Copy payloads, mutate promised independent results, and verify shared-handle identity/lifetime when relevant. Measure allocation and retained owners before claiming optimization. Compiler success proves selected type relationships, not that a cloned wrapper is the domain snapshot needed.
