# Numeric policies before representation

## Must

- Must specify overflow and rounding before choosing operations.
- Must check narrowing, signedness and allocation arithmetic.
- Must define admission of NaN, infinity and signed zero.
- Must distinguish approximate comparison from key equality.
- Must preserve units and the existing money representation.
- Must test relevant boundary behavior across build profiles.

Name quantity and units: counts, offsets, durations, amounts and identifiers differ. usize is target-width indexing, not automatically stable wire/storage. External sizes need checked conversion and resource limits. Signedness does not validate forbidden negatives. Wire widths/endianness must be explicit. See [numeric types](https://doc.rust-lang.org/reference/types/numeric.html).

## Arithmetic and conversion

Checked rejects, saturating clamps, wrapping is modular; select intended domain behavior. Inventory must not silently saturate into apparent success. Ordinary [overflow behavior](https://doc.rust-lang.org/reference/expressions/operator-expr.html#overflow) depends on configuration; test explicit policy in debug/release. Check intermediates: multiply-before-divide may overflow even when the quotient fits; reordering can change truncation, rounding and error precedence. Division needs zero and signed-minimum/-1 policy.

Use [conversion contracts](conversions-and-casts.md) for casts and TryFrom. Representability does not imply domain validity. Wide integer thresholds can themselves round when represented as floats; do not validate exact boundaries using an unproved approximate maximum.

## Floats and identity

Choose f32/f64 from accuracy, range and actual workload. NaN is unordered, not zero or an automatic missing marker; infinity may be invalid domain data. Reject non-finite values where required and check outputs too: finite operands can produce non-finite results. Classify NaN through its API, not equality. Signed zeros compare equal but have different bits/behavior; define preservation/normalization. [f64](https://doc.rust-lang.org/std/primitive.f64.html) documents these operations.

partial_cmp can be absent. Unwrapping it needs proof accepted data excludes unordered values. [total_cmp](https://doc.rust-lang.org/std/primitive.f64.html#method.total_cmp) orders NaN/signed zero and differs from ordinary equality. Use only the intended sort policy; a numeric wrapper must align order/equality/hash normalization, including zeros/NaN payloads. Sorted data is not validated data. Tolerance-based agreement can serve an error-budget test but generally is not transitive Eq/key identity; see [trait laws](derives-equality-and-hashing.md).

## Exact quantities and evidence

Preserve fixed-unit integers or established decimal representations for exact money/settlement/IDs. Define currency, scale, overflow and rounding timing/direction; a decimal crate does not choose them. Float intermediates cannot regain lost precision through formatting. Scientific approximations need an error budget and independent reference calculations. Changed rounding/accepted intervals are behavior changes, not equivalent optimization.

Probe domain endpoints/just-outside values, intermediate overflow, division boundaries and rejected updates never committed. Challenge NaN, infinities, signed zero, subnormals, precision thresholds and finite-to-nonfinite outputs where relevant. Test accepted sorting classes, lawful normalized keys and exact rounding thresholds with independent expectations. Record profile/compiler/target; one 64-bit run cannot establish 32-bit wire/index behavior or application throughput.
