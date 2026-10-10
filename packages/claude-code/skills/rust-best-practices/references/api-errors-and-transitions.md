# APIs, errors and pure transitions

## Must

- Must expose consumption, retention and failure in signatures.
- Must distinguish rejected input from uncertain external effects.
- Must preserve caller-owned state while calculating proposals.
- Must commit against the authoritative revision atomically.
- Must emit effects only for accepted proposals.
- Must test failure precedence and replay behavior.

Read for consumer ownership, validated construction and recoverable state changes. Signatures must expose observation/consumption/retention, output lifetimes and error timing. A borrowed parser result retains its buffer; a small owned result may release it. One-shot streams cannot promise repeatable access. Generalize only for known consumers; check public traits, enum/error shapes, auto traits and optional features in [downstream consumers](downstream-compatibility.md).

Preserve actionable recovery: malformed input, capacity denial, conflict, dependency failure or unknown write outcome. Keep causes and redact public errors. Formatting is not classification; blind retries may duplicate effects. Follow incumbent error libraries. Panic only for defensible internal invariants, not ordinary input/resource/I/O failures.

## Original versioned reservation fixture

The committed [reservation fixture](https://github.com/zrmonty/proofwork/tree/main/evals/fixtures/rust-reservation) keeps the proposal and executable rejection/replay checks together.

Counts are not money. The input is a validated authoritative snapshot; the function proposes state/effect without modifying it. Authentication, atomic commit and notification belong to the adapter.

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

fn remaining_stock(current: &Inventory, units: u32) -> Result<u32, ReserveError> {
    if units == 0 {
        return Err(ReserveError::ZeroUnits);
    }
    current
        .available
        .checked_sub(units)
        .ok_or(ReserveError::InsufficientStock)
}

fn reserved_inventory(current: &Inventory, units: u32) -> Result<Inventory, ReserveError> {
    let mut next = *current;
    next.available = remaining_stock(current, units)?;
    next.revision = next
        .revision
        .checked_add(1)
        .ok_or(ReserveError::RevisionOverflow)?;
    Ok(next)
}

pub fn reserve(current: &Inventory, units: u32) -> Result<Reservation, ReserveError> {
    Ok(Reservation {
        expected_revision: current.revision,
        next: reserved_inventory(current, units)?,
        effect: Effect::NotifyReserved { units },
    })
}
```

Exposed fields are pedagogical, not tamper-proof authority. Production accepts internally computed proposals and enforces current permissions/invariants. Error precedence is zero units, stock, then revision overflow. Concurrent valid proposals need a conditional atomic commit against expected revision; separate read/write checks race. Rejecting a proposal forbids its effects; recompute from fresh authorized state.

State commit followed by notification has a crash window. Use stable operation identity and the actual durable mechanism when guarantees require it. Timeout, cancellation and retry do not undo committed state or prove delivered-once effects. See [async contracts](async-cancellation-and-backpressure.md).

```rust
#[cfg(test)]
fn stock(revision: u64, available: u32) -> Inventory {
    Inventory {
        revision,
        available,
    }
}

#[test]
fn reservation_proposes_state_and_effect() {
    let current = stock(7, 10);
    let proposal = reserve(&current, 3).unwrap();
    assert_eq!(proposal.expected_revision, 7);
    assert_eq!(proposal.next, stock(8, 7));
    assert_eq!(proposal.effect, Effect::NotifyReserved { units: 3 });
}

#[test]
fn exact_stock_is_allowed() {
    assert_eq!(reserve(&stock(0, 3), 3).unwrap().next, stock(1, 0));
}

#[test]
fn zero_reservation_is_rejected() {
    assert_eq!(reserve(&stock(0, 10), 0), Err(ReserveError::ZeroUnits));
}

#[test]
fn insufficient_reservation_is_rejected() {
    let expected = Err(ReserveError::InsufficientStock);
    assert_eq!(reserve(&stock(0, 2), 3), expected);
}

#[test]
fn reservation_revision_overflow_is_rejected() {
    let expected = Err(ReserveError::RevisionOverflow);
    assert_eq!(reserve(&stock(u64::MAX, 2), 1), expected);
}

#[test]
fn reservation_error_precedence_is_preserved() {
    let current = stock(u64::MAX, 0);
    assert_eq!(reserve(&current, 0), Err(ReserveError::ZeroUnits));
    assert_eq!(reserve(&current, 1), Err(ReserveError::InsufficientStock));
}

#[test]
fn reservation_preserves_input_and_replays() {
    let current = stock(5, 8);
    let before = current;
    assert_eq!(reserve(&current, 2), reserve(&current, 2));
    assert_eq!(current, before);
}
```

These tests prove pure calculation under their inputs, not storage atomicity or delivery. Separately challenge two proposals over one revision and verify the losing adapter cannot execute effects. An in-memory version gate does not prove database behavior. Compile a real consumer and exercise affected decoding for public contract changes.

Primary sources: [Rust API guidelines](https://rust-lang.github.io/api-guidelines/) and [Error](https://doc.rust-lang.org/std/error/trait.Error.html).
