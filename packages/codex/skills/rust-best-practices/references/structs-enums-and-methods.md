# Structs, enums and method contracts

## Must

- Must represent valid alternatives without contradictory flags.
- Must validate all construction and decoding routes.
- Must choose receivers by observation, mutation or consumption.
- Must preserve invariants on failed mutable operations.
- Must distinguish internal states from compatible wire representations.
- Must review downstream callers after public shape changes.

Use when selecting domain representations, enforcing construction or choosing receiver ownership. Representation should make the actual valid states and consumer obligations clear.

## Products, alternatives and validated construction

Struct fields coexist; enum variants describe alternatives and can carry only the payload each state needs. Replace coupled flags that admit impossible combinations, while retaining independent booleans for independent facts. Newtypes distinguish real roles or units; aliases do not create a distinct type. Avoid wrappers with no domain or compatibility benefit.

Tuple structs suit a compact single role. Named fields suit separately meaningful values and evolving APIs. Public fields enable caller construction and maintenance obligations; private fields plus constructors can protect invariants only if every construction route obeys them. Check decoding, conversions, defaults, migrations, tests and persistence adapters. A derived Default must represent a valid state. Public enum payloads can bypass internal validation too; use validated payload types where needed.

Separate legacy wire/storage representations from internal domain values when compatibility requires accepting old forms. Reject malformed data at that boundary rather than weakening every internal consumer. Struct-update syntax moves non-Copy fields; it does not silently clone them. Partial moves interact with later whole-value use and Drop; inspect the actual lifetime and cleanup contract.

## Receiver choice describes ownership

- `&self` observes or shares access. Interior mutation still needs an explicit effect/synchronization contract.
- `&mut self` grants exclusive access for a mutation; preserve invariants on success and failure.
- `self` consumes ownership, suitable for conversion, finalization or transitions that invalidate the previous value.

Return a borrowed field when its owner/lifetime remains useful; return a small owned result when independence simplifies callers or avoids retaining a large owner. Check method resolution and downstream call sites before changing receivers, return lifetimes or trait implementations.

Borrow the required fields rather than an entire struct when a helper needlessly blocks disjoint access. Temporary reborrows can preserve later exclusive use. Splitting safe disjoint regions can express valid access; do not clone or reach for unsafe merely to silence a borrow error. See [borrowing](borrowing-and-reborrowing.md).

## Associated and trait APIs

An associated function belongs to a type's creation or operation contract; a free function is clearer when no type owns the policy. Associated constants describe fixed type-level facts, not runtime configuration. A setter must preserve cross-field invariants; prefer an atomic domain operation when separate setters expose invalid intermediate states.

Inherent methods describe the type's own API. Trait methods fulfill a shared consumer contract; implement only meaningful behavior and account for blanket implementations, coherence and method-name ambiguity. Read [generics and dispatch](generics-traits-and-dispatch.md) before generalizing and [derive laws](derives-equality-and-hashing.md) before deriving comparison, hashing or cloning.

## Verification

Probe rejected construction across every affected entry route, valid variant payloads, ownership after calls, failure-preserved invariants and representative consumers. Transition tests need adapter authority/version/effect checks when those guarantees are claimed; an enum or unit test alone cannot prove them. Use [APIs and transitions](api-errors-and-transitions.md) and [downstream checks](downstream-compatibility.md) for those boundaries.

Primary sources: [structs](https://doc.rust-lang.org/reference/items/structs.html), [enums](https://doc.rust-lang.org/reference/items/enumerations.html) and [associated items](https://doc.rust-lang.org/reference/items/associated-items.html).
