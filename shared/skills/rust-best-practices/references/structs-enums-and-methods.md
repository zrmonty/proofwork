# Structs, enums and methods that preserve meaning

Read for data shapes, wrappers, implementation blocks and method receiver changes. A type should clarify the domain and its ownership; extra abstraction requires a concrete reason.

## Choose the shape from valid states

A struct means its fields coexist. An enum means one alternative is active. Start with valid examples and invalid combinations before selecting either representation.

If a job can be queued, running or finished, place each state's required data in that variant. A single struct with status plus several optional fields allows a running job without its worker and a queued job with a completion result.

Keep raw input and validated domain data separate when the boundary can receive invalid combinations. Reject or translate them once under a clear policy. A type name alone does not prove validation occurred.

Do not convert every flag into a state machine. A simple independent property can remain a boolean. Use variants when alternatives change permitted data, transitions or recovery actions.

When variants only wrap another value, decide whether the wrapper establishes a meaningful domain distinction or merely duplicates the underlying type. Retain a wrapper when it prevents an actual mix-up or models a closed choice.

The [enum reference](https://doc.rust-lang.org/reference/items/enumerations.html) describes representation forms. The application decides which combinations belong in the domain.

## Tuples are local shorthand, not unnamed domain models

Tuples have fixed positions that can hold different types. Use a tuple for a brief local result such as a split position and remainder when the roles are evident at the call site.

A public tuple of several strings or numbers asks every caller to memorize positions. A named struct gives those positions stable meaning and improves changes and review. Avoid switching shapes solely for stylistic uniformity.

A tuple struct can distinguish one domain value from its underlying representation. Make its field private if construction must enforce an invariant. A public field allows callers to bypass a checked constructor.

`type UserId = String` does not create a distinct type; a wrapper can. Check whether this distinction prevents accidental mixing before adding it. Wrappers should not introduce a network of forwarding methods without a useful domain boundary.

Unit-like structs can represent a stateless value or marker. They should not become global service holders merely because no fields are needed today.

See [tuple types](https://doc.rust-lang.org/reference/types/tuple.html) and [struct items](https://doc.rust-lang.org/reference/items/structs.html) for the language forms.

## Construction must establish the same invariant everywhere

Use associated construction functions to centralize validation that every value must satisfy. A fallible constructor should identify what the caller can correct. Name constructors by their actual promise; `new` is not automatically safe or validated.

Check alternate construction paths: deserialization, defaults, struct literals in sibling modules, conversion traits, test factories and migrations. A validated constructor followed by a derived decoder that bypasses it leaves the invariant unenforced.

`Default` is useful only if its value is meaningful for the type. Do not create an invalid placeholder that every caller must remember to repair. An uninitialized domain object is better represented explicitly when needed.

Struct update syntax can move fields from its source. Inspect whether later callers still need that source and whether excluded fields carry important ownership. It is not an implicit clone or a validation step.

An enum's variant construction must obey its payload invariants too. If public variants expose unchecked primitives, internal validation cannot guarantee that downstream callers constructed safe values.

The [struct-expression reference](https://doc.rust-lang.org/reference/expressions/struct-expr.html) defines construction and update behavior. Keep invariant enforcement within actual visibility and module boundaries.

## Select the receiver from the operation

`&self` normally observes a value without consuming it. `&mut self` grants exclusive access during the call. `self` transfers ownership to the method. Choose the contract the caller needs before choosing a convenient receiver.

An observing receiver is not proof that the method is pure. Interior mutability, synchronization or external effects may still change state. Name and document those behaviors where callers rely on them.

A consuming method fits a conversion or transition where the old value should no longer be used. Do not consume a large owner merely to avoid explaining a borrow in a small calculation.

An exclusive receiver can update one value efficiently. Keep local mutation private and bounded; compute proposed next state before external commits when the decision can be pure. Borrowing exclusively does not make an external multi-step update atomic.

Returning a reference ties the result to its source lifetime. Decide whether this keeps a large owner or lock alive unnecessarily. Prefer an owned small result where it materially simplifies the real consumer.

Inspect the [method-call rules](https://doc.rust-lang.org/reference/expressions/method-call-expr.html) when automatic borrowing or dereferencing makes the receiver unclear. Do not infer the called implementation from the visible punctuation alone.

## Split field observations before borrowing the whole owner

Rust can recognize disjoint field borrows in many direct expressions. A helper receiving the entire owner may hide that disjointness and extend the access its signature requests.

If a method needs one field, consider a focused parameter or a short local borrow instead of granting access to the complete object. Do not introduce an elaborate projection framework for a straightforward field split.

Keep a mutable field reference scoped to its last required use. Do not retain references into a collection while an operation can reallocate or otherwise invalidate the relationship.

Taking a reference to a field does not copy or clone it. Moving a non-Copy field out changes which parts remain usable; owners implementing Drop restrict such partial moves. Let the compiler reject the unsupported operation rather than working around it with raw pointers.

For conflicting accesses, first identify the actual owner and required access interval. Clone only when an independent owned snapshot is part of the contract, not as a habitual response to a borrow error.

Use the ownership references for the detailed borrowing repair path; preserve this file's focus on domain shapes and APIs.

## Associated functions and constants

An associated function without a receiver belongs to a type's API but does not act on an existing instance. Use it for meaningful construction or type-related calculations; a free function can be clearer when no type owns the responsibility.

An associated constant expresses a type-level value. It is not mutable per-instance configuration. Do not place a deployment setting in a constant when users must select it at runtime.

Use methods to give callers useful operations, not just a getter and setter for every field. A setter that can violate an invariant undermines a validated constructor; prefer a checked domain operation where change is permitted.

Inherent implementation blocks and trait implementations have different roles. An inherent method defines the type's own API; a trait implementation fulfills a shared contract. Do not add a trait only to rename one private method.

Keep public method ownership, panic behavior and error cases documented where consumers depend on them. Adding a similarly named method or changing a receiver can affect resolution and callers even when the defining crate compiles.

The [implementation reference](https://doc.rust-lang.org/reference/items/implementations.html) supplies the language rules. Use [downstream compatibility](downstream-compatibility.md) before changing exported methods or types.

## Proof checks

List invalid combinations that the old representation admitted. Establish which are now impossible to construct and which still require runtime validation.

Exercise every permitted constructor and decoder with valid and invalid input. Include defaulting and persistence migration only when those paths actually exist.

Compile a realistic caller that observes an owner twice, mutates it and consumes it under the intended API. This detects receiver changes hidden by defining-crate tests.

For transitions, verify unchanged input, a valid proposed next state and rejected outcomes before checking the adapter's authoritative commit behavior.

Inspect each method's complete formatted definition against the ten-line function cap. Extract cohesive domain calculations rather than concealing a long mutation in an oversized closure.

Derive decisions need their own contract review; continue with [derives, equality and hashing](derives-equality-and-hashing.md). Generic APIs continue with [traits and dispatch](generics-traits-and-dispatch.md).
