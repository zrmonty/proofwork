# Generics and dispatch relationships

Generalize a demonstrated caller requirement. Bounds express required capabilities, not speed, purity, authentication or retry safety. Avoid incidental Clone/Debug/Send/'static restrictions. One parameter relates argument types; separate parameters allow variation. Associated-type equality constrains needed outputs. Readable where clauses cannot repair an overcomplicated responsibility.

Type parameters are implicitly Sized. [T: Trait + ?Sized](https://doc.rust-lang.org/reference/trait-bounds.html#sized) permits borrowed unsized referents such as str/slices/trait objects, not arbitrary by-value unsized arguments. Compile both intended sized and unsized callers. Supported syntax depends on actual edition/MSRV.

## Trait direction and borrowing

T: A + B requires both, not either. A supertrait constrains implementors; implementing it does not implement its subtrait. Default methods do not supply missing supertrait implementations. Associated types are implementation-selected; generic trait parameters can support different permitted implementations. Choose actual consumer relationships under [traits](https://doc.rust-lang.org/reference/items/traits.html) and [bounds](https://doc.rust-lang.org/reference/trait-bounds.html).

Lifetimes describe reference relationships without extending storage. Identify returned data's owner. 'static restricts contained borrows, not owned values' destruction time. Higher-ranked bounds belong to callbacks accepting varying lifetimes; generic associated types belong to actual lending outputs and have their own toolchain/dyn constraints. Inspect retained callbacks, iterators and futures; immediate compilation may not establish required retention/Send. See [lifetime bounds](https://doc.rust-lang.org/reference/trait-bounds.html#lifetime-bounds) and [associated types](https://doc.rust-lang.org/reference/items/associated-items.html#associated-types).

## Static, dynamic and opaque choices

Static dispatch/monomorphization can improve optimization but grow compilation work/code size. Dynamic dispatch supports runtime heterogeneous selection; it does not inherently require allocation. &dyn Trait borrows, Box<dyn Trait> owns. A closed enum can express a closed choice; an open trait supports extension.

The object's contained-borrow bound differs from its reference lifetime. Box<dyn Trait> commonly defaults to a static object bound in a type context; borrowed implementations may need + 'a. Check [default object lifetimes](https://doc.rust-lang.org/reference/lifetime-elision.html#default-trait-object-lifetimes) instead of cloning to conceal the relation.

Check complete [dyn compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility): associated constants, generic methods and certain Self forms can prevent dispatch. Self: Sized can exclude some methods. dyn A + B cannot directly combine arbitrary ordinary base traits; use a meaningful dyn-compatible composite, concrete boundary or enum. Auto traits such as Send can accompany the base. Supertrait syntax still needs an implementation and compatible methods.

Argument impl Trait is anonymous generic input; named parameters expose shared relationships/type arguments. Return impl Trait hides one concrete type, not unrelated runtime branches merely sharing a trait. Hidden implementation changes can affect captured lifetimes and auto traits such as Send. Check precise-capture/async-trait syntax against project versions and [impl Trait](https://doc.rust-lang.org/reference/types/impl-trait.html).

Respect coherence/orphan rules; newtypes can own required local behavior without changing foreign types. Do not build extension hierarchies for hypothetical consumers or convert an entire API to trait objects to fix one signature.

Compile real concrete/unsized, borrowed/owned, static/dynamic and retained consumers as relevant. Public changes need downstream fixtures; thread-transfer checks belong only to actual needs. Measure compile time, executable size or runtime work before claiming dispatch improvement. One compiler run does not establish an MSRV matrix.
