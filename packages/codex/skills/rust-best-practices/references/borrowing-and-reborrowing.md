# Borrowing, mutation and reborrowing

Read when ownership errors obscure the intended operation, a reference survives too long, or changed code mutates through borrowed data. Start from who must retain the value and which access must overlap. Compiler diagnostics identify a conflict; they do not choose the application's ownership contract.

## Choose the access promise

| Parameter shape | Promise to examine | Caller consequence |
| --- | --- | --- |
| `T` | The operation receives ownership | Caller cannot keep using that moved value unless returned or otherwise retained |
| `&T` | The operation observes an existing value | Owner remains responsible for its lifetime; interior mutability may still exist |
| `&mut T` | The operation has exclusive access for its borrow | Competing access must wait; mutation is visible to the owner |
| Owned return | Result has its own lifetime | Allocation or copying may be necessary, but input can be released |
| Borrowed return | Result remains tied to an input owner | Caller must retain that owner and respect outstanding access |

Do not consume a vector merely to calculate a summary that needs a slice. Do not return a borrowed view if the caller needs to store it after releasing a decoder buffer. State the real retention requirement before choosing either signature.

An immutable reference is not a promise that all reachable state never changes. A `Cell`, `RefCell`, lock or other interior-mutability mechanism changes the relevant access contract. Review those mechanisms explicitly instead of advertising purity from `&T` alone.

The [borrowing chapter](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html) establishes shared versus exclusive access and reference validity. Treat the following repair order as engineering judgment, not a compiler rule.

## Fix E0502 by separating observation from change

A retained view into a collection is used after an attempted collection update. That later use keeps the observation relevant, so mutation conflicts with it. Read the diagnostic's creation, mutation and later-use locations together.

Prefer the first repair that preserves meaning:

1. Finish the observation before the mutation when later access is unnecessary.
2. Calculate the small decision data needed later, such as an index or checked count, instead of retaining the whole borrow.
3. Narrow a helper's parameter to the fields it actually observes.
4. Return a deliberately owned result when the consumer really needs an independent snapshot.

Adding braces works only if the borrowed result does not escape the scope or remain needed afterward. Moving a declaration without changing its later use may leave the same conflict. Explicitly dropping a plain reference does not create an application transaction or validate stale decision data.

If observation and mutation straddle I/O or another writer, local borrow legality is insufficient. Recheck authority and the relevant version at the commit boundary; use [pure transitions](api-errors-and-transitions.md) for that contract.

The [E0502 explanation](https://doc.rust-lang.org/error_codes/E0502.html) describes incompatible borrowing. Prove the chosen repair by compiling the retained consumer and checking the operation's output and input-retention promises.

## Fix E0499 by identifying the actual overlap

Two intended changes may be sequential, or they may require simultaneous access to distinct storage. Resolve that distinction before introducing synchronization.

- Sequential work: finish the first access, then obtain the second.
- Distinct struct fields: borrow those fields directly rather than asking a helper for the whole struct.
- Distinct slice regions: use a safe split with a validated boundary.
- Potentially identical positions: reject or define the same-position case before requesting two mutable views.
- Map entries: use an available safe disjoint-access API only after understanding duplicate-key behavior and the supported compiler version.

Two separate indexing expressions do not automatically communicate disjointness. Do not replace a bounds problem with raw pointers or unchecked access. A supported safe split expresses both the separation and its ownership lifetime.

A `RefCell` converts some compile-time checks into runtime checks; it does not establish that overlapping mutation is valid. A `Mutex` supplies coordination, but wrapping a local value to silence the compiler adds a different failure and contention model. Neither is the default repair for an overly broad borrow.

The [E0499 explanation](https://doc.rust-lang.org/error_codes/E0499.html) grounds the exclusive-access restriction. A small compile-fail case should preserve the relevant overlapping later use; a failure caused by an unrelated missing import proves nothing about the intended restriction.

## Reborrow instead of transferring exclusive access accidentally

An `&mut T` is not `Copy`. Passing it where type inference moves that reference can leave the original binding unavailable. A temporary reborrow lends access for a shorter operation, after which the original reference can be used again.

Make the desired shape explicit when inference or generic calls obscure it: `&mut *handle` lends mutable access through a mutable reference; `&*handle` lends shared access. While that reborrow is live, the original exclusive access is suspended for the conflicting use.

Do not promise that every call accepting a mutable reference moves it or that every call automatically reborrows it. Expected parameter types and coercion sites matter. Check the actual signature and a representative caller.

Use reborrowing to express temporary access, not to lengthen the referent's lifetime. A returned reference still needs a surviving owner. A generic annotation that demands one unnecessarily long lifetime can make independent short operations appear coupled; first simplify the real lifetime relationships.

The [operator reference](https://doc.rust-lang.org/reference/expressions/operator-expr.html#borrow-operators) defines borrow expressions. Test the original handle's valid later use after the helper call.

## Separate mutable binding from mutable referent

| Binding | What can change | What it does not grant |
| --- | --- | --- |
| `let mut value: T` | The owned binding can be reassigned; mutable access can be taken | Safe overlapping mutable access |
| `let view: &mut T` | The referenced value can be changed through `view` | Reassignment of the immutable binding to another reference |
| `let mut view: &T` | The binding can point to another shared reference | Mutation of either referent through that shared reference |
| `let mut view: &mut T` | The binding can be reassigned and its current referent changed | Extending either referent's lifetime or duplicating exclusive access |

The `mut` in a by-value parameter permits changing that local binding. It does not update a caller's moved-from variable. Mutating an owned local value before returning it can remain an externally pure transformation when it has no shared effects.

Reassigning a mutable-reference binding changes which value is accessed next. Moving that reference into a second binding is different: the first binding does not become a second usable exclusive handle. Preserve this distinction in reviews and explanations.

## Functional state without artificial copying

Keep changed domain decisions as explicit inputs producing a next value and intended effect data. Use private mutation when it builds that result clearly. Do not clone a large graph for every transition just to claim immutability.

Where the existing public API must mutate in place, calculate and validate the proposed change before applying it when the domain needs all-or-nothing behavior. Borrow checking prevents invalid access; it does not undo earlier business mutations when a later step fails.

Choose a clone only when independent ownership is required. Record whether it is a real snapshot or shares interior state; see [copy and reference depth](copy-clone-and-reference-depth.md).

## Acceptance probes

These probes establish the tested access and domain contracts. They do not establish unsafe soundness or correctness across concurrent external writers.
