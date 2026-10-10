# Worked ownership and transformation contracts

Read when a concrete example will clarify reference depth, failure policy or a pure transformation. These original examples form one dependency-free fixture when the Rust blocks below are concatenated. Public visibility makes the fixture easy to compile; it is not a recommended application API.

## Borrowed selection, reference depth and tuples

Filtering borrows an iterator item to decide whether to retain it; mapping receives the item itself. Explicit patterns expose the extra reference level. Copying a numeric value removes a reference; it does not consume the caller's collection. Enumeration before filtering keeps original positions.

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

`copied()` here changes `&&str` into `&str`. Only `to_owned` creates independent string storage. Do not generalize this into a claim that copied or cloned references duplicate the referent. See [reference depth](copy-clone-and-reference-depth.md) and [iterator item shapes](iterator-adaptors-and-item-shapes.md).

## Private mutation inside a pure interface

The caller retains its original slice. The calculation owns its output, applies a defined saturation policy and exposes no intermediate writes. Saturation is an example policy for capped counters; it would be wrong for a ledger that must reject overflow.

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

Mutation is justified by clear ownership, not by claiming loops always outperform iterators. The input and output sizes are bounded by the caller's contract; an untrusted count still needs admission limits before allocation.

## Fallible conversion without disappearing records

Every accepted count fits u8. The first invalid count rejects the entire result; no partial collection is returned. Conversion failure is different from capacity exhaustion, and this fixture does not promise graceful handling of allocation failure.

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

An `as u8` cast or `filter_map(Result::ok)` changes this contract. For reporting every rejected index, design a typed partial-result policy instead of reusing this fail-fast signature.

## Entry updates, duplicate policy and borrowed keys

The example counts exact, case-sensitive identifiers. `Entry` owns the absent/present decision while each borrowed key remains tied to the input. Returning this map is appropriate only while those names remain alive. A durable result would need owned keys. Checked arithmetic preserves the same overflow policy in every profile.

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

Hash iteration order is not a presentation contract. Assertions use lookup, not whichever element happens to appear first. The tiny fixture cannot reach the u32 count limit in ordinary execution; it does not claim that overflow branch was tested or a coverage gate passed.

## Checked UTF-8 offsets and explicit float admission

External offsets can be out of range or inside a multibyte scalar. This prefix operation counts bytes and rejects either invalid boundary. It does not implement visible-character truncation.

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

Finite floats still carry rounding error. Equality of signed zeros does not establish interchangeable representations for hashing, total ordering or serialization. Choose the actual domain policy in [numeric contracts](numeric-and-float-contracts.md).

## Reborrow, disjoint slices and non-Copy observation

An immutable binding can hold an exclusive reference and mutate its referent. Passing a temporary reborrow lets the exclusive reference be used again after the call. Splitting a slice makes disjointness explicit without unsafe code or copies.

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

The fixed-size input guarantees both positions exist, and the slice split establishes independent mutable places. Swapping preserves the values without arithmetic overflow. A transfer between counters would need its own checked arithmetic and failure policy, as in [the reservation proposal](api-errors-and-transitions.md). `assert_eq!` borrows its arguments; this test does not move the String out of its shared reference.

## Evidence boundaries

Execute these exact blocks with the supported toolchain, then run rustfmt and configured Clippy checks. A separate compile-fail fixture should challenge E0502, E0499 and moving a non-Copy value out of a borrowed place, paired with accepted solutions that preserve the ownership contract. Expected rejection is evidence of that compiler rule, not proof that every borrow failure is fixed by the same recipe.

These examples exercise mechanisms under declared synthetic inputs. They do not certify an application, minimum compiler, unsafe code, concurrency, throughput, allocation-failure behavior or numerical line/branch coverage. Primary contracts are [checked string access](https://doc.rust-lang.org/std/primitive.str.html#method.get), [fallible integer conversion](https://doc.rust-lang.org/std/convert/trait.TryFrom.html) and [split mutable access](https://doc.rust-lang.org/std/primitive.slice.html#method.split_at_mut).
