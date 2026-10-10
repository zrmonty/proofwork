# APIs, errors and pure transitions

Read for public signatures, validated domain construction or state changes where a caller needs precise recovery. Use the project's existing types and error conventions before introducing another abstraction.

## Design for the actual consumer

Decide whether an operation observes, consumes, retains or transforms its input. A parser returning slices can avoid copies while tying the result to a buffer; a small owned result may make the consumer simpler and release a large buffer sooner. Neither is universally preferable. For an iterator return, state when decoding/errors occur and which owner must keep resources alive. Do not promise repeatable access to a one-shot stream.

Generics support known compile-time variation; a trait object supports a needed runtime boundary. Compare their caller complexity, object compatibility, lifetime bounds and generated code before choosing. Keep concrete helpers concrete. A public trait with extra required methods can break implementors; changing an enum's cases or an error's shape can break matching consumers. Follow the actual compatibility promise, not a compiler pass in the defining crate.

Borrowing, auto traits, default features and error types are part of a public contract. Check a representative downstream consumer, including stored futures/callbacks where those matter. Keep serialization/persistence representations separate when they tolerate legacy values that the internal domain should reject.

## Preserve recovery information

Use domain alternatives a caller can act on: malformed input, insufficient capacity, conflict, unavailable dependency or an unknown write outcome as relevant. Preserve causal errors through the incumbent error implementation and redact public output. Retrying every error can duplicate effects; formatting an error is not a reliable classification API.

Do not add a crate merely to shorten one error enum. Conversely, retain an established error library instead of replacing it with boilerplate. Mark a result as must-use where ignoring it would discard a meaningful decision, without imposing global lint churn. Panic only for a defensible internal invariant, not invalid input, ordinary exhaustion, changed state or I/O failure.

## Calculate a proposal before committing

This original example proposes an inventory reservation without changing the supplied value. Its numbers are counts, not money. The input is an already validated authoritative snapshot; authentication, persistence and effect execution belong to the adapter.

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Inventory {
    pub revision: u64,
    pub available: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ReserveError {
    ZeroUnits,
    InsufficientStock,
    RevisionOverflow,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Effect {
    NotifyReserved { units: u32 },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[must_use]
pub struct Reservation {
    pub expected_revision: u64,
    pub next: Inventory,
    pub effect: Effect,
}

pub fn reserve(current: &Inventory, units: u32) -> Result<Reservation, ReserveError> {
    if units == 0 {
        return Err(ReserveError::ZeroUnits);
    }
    let available = current
        .available
        .checked_sub(units)
        .ok_or(ReserveError::InsufficientStock)?;
    let revision = current
        .revision
        .checked_add(1)
        .ok_or(ReserveError::RevisionOverflow)?;
    Ok(Reservation {
        expected_revision: current.revision,
        next: Inventory {
            revision,
            available,
        },
        effect: Effect::NotifyReserved { units },
    })
}
```

The exposed fields make the sketch easy to inspect; it is not a tamper-proof command capability. A production adapter must accept internally computed proposals and enforce its own current authority/invariants. Use private validated construction when the actual API requires it. This function checks zero units, stock and revision overflow in that order; preserve the error-selection contract when refactoring.

Two callers can calculate valid reservations from the same revision. The owning storage boundary must conditionally commit against that revision under its existing atomic mechanism. A separate read-then-write check can race. Rejected proposals cannot issue their notification; recompute from a fresh authorized observation instead of overwriting another writer. Committing state and notifying still has a crash window: use the application's actual durable mechanism only when the requested guarantee requires it.

An adapter's local effect request does not prove a notification was delivered, sent once or durably scheduled. Use stable operation identity and observed outcomes where that contract needs them. Cancellation, a timeout and a retry are separate domain facts; none automatically rolls back a committed reservation.

## Checks that distinguish the contract

Test ordinary and exact-stock reservations, zero/insufficient units, revision overflow, deterministic replay and unchanged input. Challenge the rejected-version boundary with two proposals over the same snapshot and assert the loser cannot execute effects. Keep that adapter check separate from the pure unit test. A synthetic in-memory version gate does not establish a database transaction or durable delivery.

For public ownership/error changes, compile an actual consumer and exercise affected decoding. The [Rust API guidelines](https://rust-lang.github.io/api-guidelines/) and [standard error contract](https://doc.rust-lang.org/std/error/trait.Error.html) ground language mechanisms; the project determines compatibility and recovery meaning.
