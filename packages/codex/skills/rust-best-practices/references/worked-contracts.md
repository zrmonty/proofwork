# Worked ownership and transformation contracts

These original Rust blocks concatenate into one dependency-free fixture. Public visibility serves demonstration, not an application API recommendation.

## Borrowed selection

Enumeration before filtering preserves source positions. `filter` receives a reference to the item; `map` receives the item. `copied()` removes `&&str` reference depth; only `to_owned` creates independent text.

```rust
pub fn positive_positions(values: &[i32]) -> Vec<(usize, i32)> {
    values
        .iter()
        .enumerate()
        .filter(|(_, value)| **value > 0)
        .map(|(index, &value)| (index, value))
        .collect()
}

pub fn own_selected_names(names: &[&str]) -> Vec<String> {
    names.iter().copied().map(str::to_owned).collect()
}

#[test]
fn selection_preserves_input_and_source_positions() {
    let values = [-2, 7, 0, 4];
    assert_eq!(positive_positions(&values), vec![(1, 7), (3, 4)]);
    assert_eq!(values, [-2, 7, 0, 4]);
    assert!(positive_positions(&[]).is_empty());
}

#[test]
fn copied_reference_then_owned_text() {
    let names = ["Fern", "Oak"];
    assert_eq!(own_selected_names(&names), vec!["Fern", "Oak"]);
    assert_eq!(names, ["Fern", "Oak"]);
}
```

## Private mutation

Owned output preserves the input. Saturation suits capped counters, not a ledger requiring rejected overflow. Admission limits still precede untrusted allocation; loops do not imply faster execution.

```rust
pub fn increment_capped(values: &[u8]) -> Vec<u8> {
    let mut next = values.to_vec();
    for value in &mut next {
        *value = value.saturating_add(1);
    }
    next
}

#[test]
fn private_mutation_is_bounded_by_owned_output() {
    let values = [0, 254, 255];
    assert_eq!(increment_capped(&values), vec![1, 255, 255]);
    assert_eq!(values, [0, 254, 255]);
}
```

## Fallible narrowing

The first invalid count rejects the entire collection without effects or partial output. Casts and discarded errors change this contract. Allocation-failure recovery is not promised.

```rust
pub fn narrow_counts(values: &[u16]) -> Result<Vec<u8>, std::num::TryFromIntError> {
    values.iter().copied().map(u8::try_from).collect()
}

#[test]
fn narrowing_checks_the_boundary() {
    assert_eq!(narrow_counts(&[0, 255]), Ok(vec![0, 255]));
    assert!(narrow_counts(&[256]).is_err());
    assert!(narrow_counts(&[1, 256, 2]).is_err());
    assert_eq!(narrow_counts(&[]), Ok(vec![]));
}
```

## Borrowed keys

Case-sensitive keys retain input lifetimes; durable results need owned keys. Entry centralizes duplicate handling. Hash iteration has no presentation order. This tiny fixture does not exercise the u32 overflow branch.

```rust
use std::collections::HashMap;

pub fn name_counts<'a>(names: &[&'a str]) -> Option<HashMap<&'a str, u32>> {
    let mut counts = HashMap::new();
    for &name in names {
        let count = counts.entry(name).or_insert(0_u32);
        *count = count.checked_add(1)?;
    }
    Some(counts)
}

#[test]
fn duplicate_names_are_counted_without_changing_case() {
    let names = ["Oak", "Oak", "oak"];
    let counts = name_counts(&names).unwrap();
    assert_eq!(counts.get("Oak"), Some(&2));
    assert_eq!(counts.get("oak"), Some(&1));
    assert_eq!(counts.len(), 2);
}
```

## Text and floats

Checked byte offsets reject invalid UTF-8 boundaries, not visible-character limits. Finite floats still round; signed-zero equality does not establish identical hashing, serialization or total ordering.

```rust
pub fn byte_prefix(text: &str, end: usize) -> Option<&str> {
    text.get(..end)
}

pub fn admitted_measurement(value: f64) -> Option<f64> {
    value.is_finite().then_some(value)
}

#[test]
fn utf8_boundaries_are_checked() {
    assert_eq!(byte_prefix("éx", 2), Some("é"));
    assert_eq!(byte_prefix("éx", 1), None);
    assert_eq!(byte_prefix("éx", 4), None);
    assert_eq!(byte_prefix("", 0), Some(""));
}

#[test]
fn nonfinite_measurements_are_rejected() {
    assert_eq!(admitted_measurement(-0.0), Some(-0.0));
    assert_eq!(admitted_measurement(2.5), Some(2.5));
    assert_eq!(admitted_measurement(f64::NAN), None);
    assert_eq!(admitted_measurement(f64::INFINITY), None);
    assert_eq!(admitted_measurement(f64::NEG_INFINITY), None);
}
```

## Exclusive access

Temporary reborrowing preserves later exclusive use; safe slice splitting establishes disjointness. Fixed-size input guarantees positions exist. `assert_eq!` borrows operands, so observing a non-Copy String does not move it.

```rust
pub fn swap_counts(values: &mut [u32; 2]) {
    let (left, right) = values.split_at_mut(1);
    std::mem::swap(&mut left[0], &mut right[0]);
}

#[test]
fn exclusive_reference_is_temporarily_reborrowed() {
    let mut values = [2, 3];
    let borrowed = &mut values;
    swap_counts(&mut *borrowed);
    assert_eq!(*borrowed, [3, 2]);
}

#[test]
fn noncopy_referent_can_be_observed_without_moving() {
    let text = String::from("Oak");
    let borrowed = &text;
    assert_eq!(borrowed.len(), 3);
    assert_eq!(*borrowed, String::from("Oak"));
    assert_eq!(text, "Oak");
}
```

## Evidence limits

Execute exact blocks on the supported toolchain with configured formatting/Clippy. Pair compile-fail E0502/E0499/non-Copy-move probes with accepted solutions. These examples do not certify application coverage, MSRV, throughput, allocation failures, unsafe code or concurrency.

Primary sources: [checked text](https://doc.rust-lang.org/std/primitive.str.html#method.get), [TryFrom](https://doc.rust-lang.org/std/convert/trait.TryFrom.html) and [disjoint mutable slices](https://doc.rust-lang.org/std/primitive.slice.html#method.split_at_mut). Detailed policies: [numeric contracts](numeric-and-float-contracts.md), [reference depth](copy-clone-and-reference-depth.md) and [versioned proposals](api-errors-and-transitions.md).
