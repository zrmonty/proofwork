# Ownership and domain contracts

## Borrow a ledger; reject an invalid total

A summary function accepting `Vec<i64>` and consuming it is awkward if its caller must later export the same entries. Replacing it with a borrowed slice preserves that use. Summing with ordinary addition also leaves overflow policy dependent on the chosen operation/build behavior. This original example makes both promises explicit:

```rust
#[derive(Debug, PartialEq, Eq)]
pub enum TotalError {
    NegativeAmount { index: usize },
    Overflow { index: usize },
}

fn add_entry(total: i64, (index, &amount): (usize, &i64)) -> Result<i64, TotalError> {
    if amount < 0 {
        return Err(TotalError::NegativeAmount { index });
    }
    total
        .checked_add(amount)
        .ok_or(TotalError::Overflow { index })
}

pub fn total_cents(entries: &[i64]) -> Result<i64, TotalError> {
    entries.iter().enumerate().try_fold(0_i64, add_entry)
}
```

Empty input has a total of zero by this contract. Negative amounts are invalid for this particular ledger; a refund ledger would need a different policy. `checked_add` exposes overflow as a value the caller can handle. An equally clear loop with a private mutable total is acceptable. Do not require chains of adapters simply to make code look functional. [Checked integer arithmetic](https://doc.rust-lang.org/std/primitive.i64.html#method.checked_add) specifies this operation's behavior.

Targeted checks should establish:

```rust
#[test]
fn ledger_preserves_input() {
    let entries = vec![125, 250];
    assert_eq!(total_cents(&entries), Ok(375));
    assert_eq!(entries, vec![125, 250]);
    assert_eq!(total_cents(&[]), Ok(0));
}

#[test]
fn ledger_rejects_negative_amount() {
    let expected = Err(TotalError::NegativeAmount { index: 0 });
    assert_eq!(total_cents(&[-1]), expected);
}

#[test]
fn ledger_rejects_overflow() {
    let expected = Err(TotalError::Overflow { index: 1 });
    assert_eq!(total_cents(&[i64::MAX, 1]), expected);
}
```

These tests check domain guarantees, not whether an iterator was used. At the effect boundary, translate the error to the existing response/reporting convention, preserving the index when useful without exposing sensitive record content.

## Keep validated construction together

`type AccountId = String` supplies a name but permits mixing it with any other String. A wrapper with private storage and checked construction can help when that distinction prevents a demonstrated error. Decide how deserialization establishes the same invariant: deriving a convenient decoder must not accidentally bypass a validated constructor.

Use enums when variants carry different required data. A status field plus optional payloads forces every consumer to rediscover which combinations are legal. Keep separate domain and persistence models when the wire format permits legacy/unknown variants that the internal state machine should not.

For numbers, prefer a fallible conversion such as `try_from` when narrowing can lose information. For money, use the project's representation and rounding contract; do not introduce floating point or a decimal crate incidentally. For counts, settle whether overflow is an error, saturation, or another explicit domain outcome before selecting an operation.

## Error precision without framework churn

Preserve errors where a caller must choose between recovery actions. An enum can express those actions without encoding transport status codes. At an application boundary, context can explain which operation/path failed; keep original causes according to the project's error library or standard error implementation.

Do not return an empty collection on failure unless “no data” is genuinely the defined outcome. Do not use `expect` for user input, ordinary I/O, or a runtime condition that can legitimately change. If an internal invariant warrants a panic, its message should identify the broken invariant, and its guarantee must survive future callers.

Avoid exposing implementation details through public types unnecessarily. A private helper can be concrete; a library interface should preserve compatibility across its consumers. Prefer borrowing only while the relationship remains useful: a return value borrowing a short-lived decoder buffer may make the interface harder to use than returning owned data.

[Rust ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) and [recoverable errors](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html) ground the language mechanisms; the domain determines the ownership and recovery policy.

## Text and collection semantics are contracts

Rust strings are UTF-8. A byte count is not a character count, and a Unicode scalar count is not necessarily a visible-character count. A byte slice boundary inside a multibyte character is invalid. Decide whether the operation limits transport bytes, scalar values or displayed text before choosing slicing/iteration; use checked access when offsets come from outside. A lossy conversion is appropriate only when replacement characters are an accepted outcome, not when identifiers must remain exact. See the [string slice contract](https://doc.rust-lang.org/std/primitive.str.html).

For fallible iterators, `filter_map(Result::ok)` silently discards errors. Use it only if dropping rejected entries is the documented policy and rejection remains observable where required. Collecting `Result` can express fail-fast behavior; an explicit loop can express partial success with indexed errors. Keep order, duplicate handling and failure semantics unchanged when switching representations. A hash collection is not a substitute for an ordered sequence merely because lookup is faster.
