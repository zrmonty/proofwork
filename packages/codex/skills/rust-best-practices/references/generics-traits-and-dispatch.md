# Generics, trait relationships and dispatch

Read when a signature needs variation across types, a trait relationship is unclear or a runtime implementation boundary is proposed. Keep concrete code concrete until the real callers need variation.

## Generalize one demonstrated requirement

Identify at least the current caller and the variation it needs. A helper operating on one concrete domain value does not become cleaner merely by adding a generic parameter.

Prefer a generic input when the operation should work across types under one meaningful contract. Specify only capabilities the body needs. Requiring Clone, Debug, Send or a static lifetime for convenience can exclude legitimate consumers.

Type parameters are implicitly Sized unless that requirement is relaxed. A borrowed helper intended to accept `str`, slices or a trait object may need `T: Capability + ?Sized` with an input such as `&T`. This permits unsized referents; it does not make by-value unsized arguments valid or promise that every operation supports them. Compile the intended concrete and unsized consumers. See [Sized bounds](https://doc.rust-lang.org/reference/trait-bounds.html#sized).

If two arguments must have the same type, one type parameter expresses that relationship. Separate parameters permit different types. Decide which relationship the algorithm actually requires rather than using one letter everywhere.

A generic function cannot assume an arbitrary type has arithmetic, a length, a default value or a particular layout. Bounds are the declared capabilities; domain validity remains a separate requirement.

Move long bounds into a readable where clause. This is organization, not permission to hide a highly complex signature. If understanding one helper requires many independent relationships, reconsider its responsibility.

For generic parameter syntax and supported forms, use the [generic-parameter reference](https://doc.rust-lang.org/reference/items/generics.html). Check edition and minimum supported Rust version before introducing newer generic or capture features.

## Bounds must describe the algorithm

`T: Read + Send` requires both capabilities for the same T. It does not mean either is acceptable. Use a separate domain alternative when the program genuinely accepts different contracts.

A trait bound permits calling that trait's operations. It does not prove the implementation is fast, pure, deterministic, authenticated or safe to retry. Put those behavioral promises into the trait contract where consumers rely on them.

A supertrait requires implementors to satisfy another trait. Implementing the supertrait does not automatically implement its subtrait. Describe the direction explicitly before building a capability hierarchy.

Default trait methods can share behavior, but they do not repair an absent required supertrait implementation. Avoid overlapping umbrella traits that make it difficult to tell which capability a caller needs.

An associated type expresses a type chosen by the implementation. A generic trait parameter can allow a type to participate in multiple implementations with different parameter choices, subject to coherence rules. Select the relationship the consumer needs, not the syntax that seems shortest.

Use equality constraints on associated types when the algorithm requires a particular item or output. An iterator bound without its item relationship may allow a broader family than the body can handle.

The [trait reference](https://doc.rust-lang.org/reference/items/traits.html) defines supertraits and associated items. Consult [trait bounds](https://doc.rust-lang.org/reference/trait-bounds.html) for the actual relationships rather than assuming class inheritance semantics.

## Lifetimes describe borrowing, not retention permission

A lifetime parameter describes relationships between references. It does not extend a local buffer's lifetime or force an owner to remain alive.

When returning a borrowed value, identify which input owns its storage. If there are several owners, the signature must expose the relevant relationship. An owned return can be simpler when it releases a large input sooner or avoids an artificial relationship.

A static bound does not generally require every owned value to live forever. It prevents the type from containing non-static borrowed data. Requiring it on a synchronous helper can be an unnecessary restriction.

If a callback must work for references with different lifetimes, a higher-ranked bound can express that relationship. Do not add one as a ritual; establish the accepted call pattern with a real consumer.

Generic associated types can express outputs tied to each borrow of an implementation. Use them for an actual lending relationship, and check their constraints and toolchain support. They can also affect whether a trait supports dynamic dispatch.

Inspect retained callbacks, returned iterators and futures for borrowed captures. A signature that compiles at the immediate call site may still prevent the caller from storing or sending its result as needed.

Use [lifetime bounds](https://doc.rust-lang.org/reference/trait-bounds.html#lifetime-bounds) and [associated types](https://doc.rust-lang.org/reference/items/associated-items.html#associated-types) to verify the language relationship. For retained resources, continue with [resources and verification](resources-and-verification.md).

## Static and dynamic dispatch have different costs and contracts

Generic static dispatch selects concrete implementations at compile time. Monomorphization can enable optimization but may increase generated code and compilation work. Measure the relevant workload before calling it an unconditional performance improvement.

Trait objects allow one runtime interface to refer to different implementations. Decide whether runtime selection, heterogenous storage or reducing generic API spread is actually required.

`&dyn Trait` borrows an implementation; `Box<dyn Trait>` owns an allocated trait-object container. Dynamic dispatch alone does not require allocating a box. Select ownership separately from dispatch.

The object lifetime bound describes borrows held by the implementation, separately from the lifetime of a reference to the object. An owned `Box<dyn Trait>` in a type context commonly defaults to a static object bound; a boxed implementation borrowing local data may instead require an explicit `+ 'a` relationship. Do not add a static bound or clone the input to conceal that intended borrowing. Check [default object lifetime bounds](https://doc.rust-lang.org/reference/lifetime-elision.html#default-trait-object-lifetimes) and the actual retained consumer.

An enum can represent a closed runtime choice without exposing a public trait. A trait object can represent an open set of implementations. Choose from the actual extension and compatibility needs rather than assuming one abstraction is superior.

Check dyn compatibility before exposing a trait object. Associated constants, generic methods, certain Self uses and other trait forms may prevent the desired dispatch. Some methods can be excluded from object dispatch with a Self: Sized restriction; verify the complete trait's rules.

A generic `T: A + B` can require two ordinary traits, but `dyn A + B` cannot directly combine two arbitrary non-auto base traits. If runtime consumers need both capabilities, consider one meaningful dyn-compatible composite supertrait, a concrete boundary or a closed enum. Auto traits such as Send can accompany the base trait separately. A composite trait still needs an appropriate implementation and compatible methods; supertrait syntax alone does not supply them.

Do not convert an entire API to trait objects to resolve one inconvenient type. A concrete boundary or a small enum may preserve simpler callers and error handling.

See [dyn compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility) and [trait-object types](https://doc.rust-lang.org/reference/types/trait-object.html). Benchmark decisions belong in [performance and representation](performance-and-representation.md).

## Understand what impl Trait hides

In a function argument, `impl Trait` supplies an anonymous generic parameter. An explicit named parameter is useful when arguments or return types must share a relationship, or the caller needs to name a type argument.

In a return position, `impl Trait` hides one concrete return type under its exposed bounds. Ordinary runtime branches cannot return unrelated concrete types merely because both implement the trait.

Preserve returned-value capture and auto-trait behavior that downstream consumers need. Changing a hidden implementation can affect Send, lifetime relationships or the consumer's ability to retain a value even without changing the visible trait name.

Precise capture syntax and async trait forms have toolchain and edition considerations. Check the exact project versions and compile the affected consumer instead of copying a modern documentation example into an older workspace.

Use [impl Trait](https://doc.rust-lang.org/reference/types/impl-trait.html) for the syntax and capture rules. Avoid revealing private implementation types through a public helper solely to make one local annotation convenient.

## Coherence and public extension

Trait implementation legality depends on trait and type ownership plus the coherence rules. A wrapper can sometimes establish an owned local type for an implementation; it must also have meaningful forwarding and domain behavior.

Adding a blanket implementation can overlap another implementation or constrain future extension. Review downstream implementors before publishing an apparently convenient generic impl.

Public traits are promises to both callers and implementors. Required methods, associated items, new bounds and changed auto traits can break different consumers. Defining-crate tests alone cannot establish compatibility.

A sealed trait intentionally limits outside implementation. Use it only when that restriction belongs to the API's intended extension model, not as a shortcut around compatibility work.

The [implementation coherence rules](https://doc.rust-lang.org/reference/items/implementations.html#trait-implementation-coherence) ground legality. Use [downstream compatibility](downstream-compatibility.md) for release checks.

## Proof checks

Compile two legitimate consumers with different concrete types. Include a borrowed or non-Clone type when the contract ought to support it; this reveals convenience bounds that were not truly needed.

For a supertrait relationship, prove that a type implementing only the supertrait still cannot use a required subtrait operation. Keep any expected rejection tied to a small fixture rather than a sprawling application diagnostic.

For a runtime interface, compile a borrowed trait object and the intended owned form. Verify the chosen trait is dyn compatible under the project's actual toolchain.

Compile the intended retained iterator, callback or future in a downstream fixture. Include thread transfer only where the consumer needs it.

If changing dispatch for performance, report actual compile time, executable size or runtime measurements appropriate to the decision. A static-versus-dynamic label is not a benchmark.

Record the selected bounds and the consumer they preserve. Do not claim a complete minimum-version matrix from a successful run on one compiler.
