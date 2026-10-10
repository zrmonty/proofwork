# Copy, Clone and reference depth

Read when a value unexpectedly moves, cloning returns the wrong shape, or an iterator produces references to references. Determine the exact type before adding another dereference, clone or allocation.

## Name the value at every boundary

A container element, iterator item and closure argument can have different types. A diagnostic showing `&&T` is information about those layers, not an invitation to add stars until compilation succeeds.

| Starting point | Iterator item | Ownership question |
| --- | --- | --- |
| `Vec<T>` with `iter()` | `&T` | Can the consumer keep borrowing the vector? |
| `Vec<T>` with `iter_mut()` | `&mut T` | Is exclusive element access required? |
| `Vec<T>` with consuming `into_iter()` | `T` | Is the vector intentionally surrendered? |
| `Vec<&T>` with `iter()` | `&&T` | Are stored references or the underlying values needed? |
| `Vec<&T>` with consuming `into_iter()` | `&T` | Consuming the container still does not own the referents |

A predicate such as `filter` receives a reference to the iterator item. A mapper receives the item itself. Annotate one closure parameter or intermediate binding when that distinction matters; remove redundant annotations once the final operation reads clearly.

The [Iterator signatures](https://doc.rust-lang.org/std/iter/trait.Iterator.html) establish adapter argument types. Use the separate iterator reference for ordering, laziness and error policy.

## Copy duplicates a value without an explicit operation

Small scalar values and shared references can satisfy `Copy`; mutable references do not. A copied shared reference remains attached to the same referent and lifetime. It is not a snapshot of that referent.

Do not derive `Copy` merely because a current struct happens to permit it. For a public type, callers may rely on implicit duplication; adding resource-owning fields later can then require a compatibility decision. A small capability can also be semantically inappropriate to duplicate even when its fields permit copying.

`Copy` requires `Clone`, and types with destructors cannot implement `Copy`. Adding the derive must agree with both field capabilities and the intended API. See the [Copy contract](https://doc.rust-lang.org/std/marker/trait.Copy.html).

Review the domain reason separately: a count and a one-use authorization token may both contain an integer, but they should not necessarily offer the same duplication contract.

## Clone promises duplication according to the type

Cloning an owned String or vector duplicates owned storage according to its element behavior. Cloning a shared reference duplicates the reference. Cloning a container with shared handles can leave its referents shared even when the outer allocation is independent.

Method resolution may choose a referent's cloning implementation through autodereference when that fits the receiver. Therefore “calling `.clone()` on a reference always clones the reference” is an unsafe teaching shortcut. Specify the required output type and use explicit trait qualification or the intended receiver when ambiguity affects meaning.

Do not select the clone shape by its syntax alone. Inspect the returned type, contained owners and interior mutability. The [Clone contract](https://doc.rust-lang.org/std/clone/trait.Clone.html) permits behavior defined by the implementing type; it does not promise a deep snapshot for arbitrary objects.

An `Arc::clone(&shared)` creates another owner of the same allocation. That explicit spelling helps a reader identify shared ownership. It does not copy the inner value or synchronize its contents. Consult the [Arc contract](https://doc.rust-lang.org/std/sync/struct.Arc.html) when the handle crosses threads or contains mutable state.

Before accepting a “snapshot” fix, ask whether changing one result can still affect the other through a shared handle. A passing equality test immediately after cloning does not answer that question.

## Use copied and cloned at the correct layer

| Item before adapter | Adapter | Item afterward | Meaning |
| --- | --- | --- | --- |
| `&u32` | `copied()` | `u32` | Duplicate the scalar |
| `&&Record` | `copied()` | `&Record` | Remove one shared-reference layer |
| `&String` | `cloned()` | `String` | Clone the owned text value |
| `&&String` | `cloned()` | `&String` | Clone the shared-reference item, not owned text |

Both adapters remove one item-reference layer under their relevant trait bound. Neither recursively turns all borrowed structure into owned data. A collected vector of references still depends on the original owners.

Use `copied()` when implicit duplication is the intended contract. Use `cloned()` when explicit Clone behavior is required. Avoid cloning before filtering when only survivors need owned copies, but preserve error order and predicate behavior when moving the operation.

If only an identifier or count is needed, map to that field rather than cloning the entire record. If the next consumer needs owned records, do not return borrowed ones simply because that version appears faster in isolation.

## Dereferencing names a place; using it may move or borrow

Dereferencing a non-Copy value through a shared reference is not intrinsically forbidden. Borrowing the resulting place or invoking an appropriate borrowed method can be valid. Moving its owned content out through that shared reference is the problem.

Distinguish `&*view`, which forms an appropriate borrow, from an expression trying to take the underlying owned value. A pattern can also request ownership unintentionally; inspect the binding mode and edition rather than blaming the dereference operator.

For mutable access, use an established replacement/removal operation when ownership must leave a slot, and choose a replacement that preserves the slot's domain invariant. An arbitrary default is not adequate for a field that must always contain a valid resource or state.

The [dereference expression contract](https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-dereference-operator) provides the language basis. Do not replace a legal borrowed observation with a clone because the underlying type is non-Copy.

## Reference conversion is not value conversion

Autodereference/coercion, `AsRef`, `Borrow`, `From` and `TryFrom` express different contracts. Converting a String value and converting a reference to that String need not select the same implementation or create the same output ownership.

A String can expose `&str` without allocating. This does not mean an arbitrary `&&CustomType` participates in every generic conversion expected for `CustomType`. Generic trait bounds are checked against the supplied type; coercions do not invent missing trait implementations.

At a boundary, identify the exact required type first. Remove an accidental outer reference, borrow the intended view or perform a validated owned conversion deliberately. Never use unsafe casts to escape ordinary reference-depth uncertainty.

## Proof checks

- Give the suspected intermediate a type annotation and compile the actual caller.
- Check source usability after consuming versus borrowing iteration.
- For independent copies, mutate the appropriate result and check the promised separation.
- For shared handles, verify identity and lifetime retention where relevant instead of claiming deep independence.
- Inspect material allocation and retained-owner costs before calling the change an optimization.
- Include a non-Copy payload so tests cannot accidentally pass only because small scalars hide ownership errors.

Compiler success verifies type relationships in that build. It does not verify that a copied reference, cloned handle or owned wrapper is the domain snapshot the application needs.
