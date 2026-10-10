# Numeric ranges, overflow and floating-point contracts

Read when a change calculates amounts, narrows types, accepts floating-point input or orders measurements. Define accepted values and failure behavior before optimizing arithmetic.

## Choose representation from the quantity

A count, an offset, a duration and an amount have different domains even if all currently fit in a u64. Keep units and conversion points visible. Use an existing domain wrapper where it prevents an actual mix-up.

`usize` fits indexing the current process's addressable collections. Its width is target dependent; avoid making it an accidental persistent or cross-platform wire format. An external size needs checked conversion and a resource limit before allocation.

Signed versus unsigned is a domain choice, not a validation mechanism. Reject forbidden negative input explicitly; casting it to an unsigned type can turn a small invalid value into a large valid-looking one.

Choose fixed-width wire integers when the protocol requires them, with explicit endianness for bytes. Do not serialize native layout or assume the deployment architecture matches the development machine.

Use [numeric types](https://doc.rust-lang.org/reference/types/numeric.html) for representation and the [integer primitive APIs](https://doc.rust-lang.org/std/primitive.u64.html) for explicit operations.

## Give overflow one deliberate meaning

Checked arithmetic makes failure visible. Saturating arithmetic clamps. Wrapping arithmetic applies modular behavior. Select one because the domain accepts its outcome, not because it prevents a panic.

Inventory depletion generally needs a rejected operation, rather than silent saturation that appears to reserve more than exists. A ring counter may intentionally wrap. A bounded display may accept clamping while its underlying authoritative value must remain exact.

Ordinary integer arithmetic can depend on overflow-check configuration for its failure behavior. Do not use a passing debug test as the production arithmetic policy. Exercise the selected operation in release configuration too.

Consider intermediate values, not just the final result. Multiplying before dividing can overflow even when the mathematical quotient fits. Reorder only when integer truncation, rounding and error-selection behavior remain correct.

Division needs an explicit zero policy. Signed minimum divided by negative one is another boundary to examine; it is not addressed merely by testing a nonzero divisor.

The [operator reference](https://doc.rust-lang.org/reference/expressions/operator-expr.html#overflow) and [checked integer operations](https://doc.rust-lang.org/std/primitive.i64.html#method.checked_add) specify mechanics. Keep the intended domain response in the function's result.

## A cast is not validation

Use a fallible conversion when a numeric change can reject values. Before using `as`, identify whether it can truncate, reinterpret sign or lose precision; document any intentional loss.

`TryFrom` is useful for range-checked integer narrowing. It is not a general business-rule validator: a successful conversion to u16 still permits a port or quantity the domain disallows.

Floating-point to integer casts have specified conversion behavior, but they do not express the application's finite-input, integral-value, range or rounding policy. Validate those separately before using a cast where the contract needs rejection.

An integer to float can lose exactness for sufficiently large values. A float to a narrower float can change precision or range. A visually reasonable number is not proof the identifier or amount survived intact.

Do not use approximate floating-point bounds casually for wide integer domains. The integer maximum itself may round to a different float. Prove conversion behavior at exact thresholds or use an established checked representation path.

Read [numeric cast rules](https://doc.rust-lang.org/reference/expressions/operator-expr.html#numeric-cast) and [TryFrom](https://doc.rust-lang.org/std/convert/trait.TryFrom.html). Test the actual accepted interval and just-outside values.

## Accept floats only under a documented domain

f32 and f64 supply different precision and range. Choose the smallest adequate representation from the real data, accuracy budget and storage or throughput needs. Do not downgrade precision simply because the data initially fits.

NaN means a value is unordered under ordinary comparisons; it is not ordinary zero or a dependable missing-value marker. Infinity may be mathematically meaningful but invalid for a domain amount or threshold.

At external input boundaries, decide whether only finite values are accepted. Finite input does not guarantee finite output: arithmetic can overflow or produce a non-finite result, so validate the output where that matters.

Positive and negative zero compare equal under ordinary equality but retain different bit patterns and can affect operations. Preserve or normalize them according to the domain's contract, not accidentally during formatting.

Do not compare a NaN value to itself to identify it. Use the relevant classification operation. If a non-finite value is rejected, make the error clear enough for callers to correct input without echoing sensitive content.

The [f64 API](https://doc.rust-lang.org/std/primitive.f64.html) covers classification, equality and total ordering. Review corresponding f32 behavior when changing representation.

## Ordering needs a policy for every accepted value

Partial comparisons can return no ordering. Code that unwraps such a comparison requires proof that its accepted domain excludes unordered values; otherwise sorting can panic on valid-looking external input.

`total_cmp` supplies an ordering across floating-point values, including NaNs and signed zero. That ordering differs from ordinary float equality for some values. Select it because the application's sort policy accepts it.

Rejecting non-finite input and using a total-order wrapper are different designs. A wrapper must keep comparison, equality and hashing consistent with its chosen normalization, including zeros and NaN payloads where accepted.

A sorted float list is not proof the values are valid domain measurements. Validation and ordering answer separate questions. Keep both visible in public contracts and serialization.

Tolerance-based numerical agreement is useful in tests with a justified error budget. It generally cannot replace a lawful equivalence relation for keys, deduplication or Eq because ordinary tolerance comparisons are not necessarily transitive.

Use [PartialOrd](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html), [total_cmp](https://doc.rust-lang.org/std/primitive.f64.html#method.total_cmp) and [equality and hashing](derives-equality-and-hashing.md) when those contracts interact.

## Exact values and financial calculations

Money, settlement quantities and identifiers usually require exact representation under a defined scale. Retain the project's fixed-unit integer or established decimal representation unless the actual requirements justify a change.

An integer amount still needs rounding, overflow, currency and unit rules at conversion boundaries. A decimal dependency does not choose those rules automatically. State when rounding occurs and which direction is accepted.

Avoid converting an exact amount to a float for intermediate calculation and then back. Once precision is lost, formatting cannot recover it. Keep display formatting separate from authoritative computation.

If a scientific model legitimately uses approximate arithmetic, define its error budget and compare against suitable reference calculations. Do not present a single exact equality assertion as evidence of numerical stability.

Report any changed rounding or overflow policy as changed behavior. A faster implementation that shifts accepted values or settlement results has not preserved the original contract.

## Proof checks

Test zero, minimum, maximum and just-outside inputs for the actual domain. Include every checked intermediate operation that could fail before the final result.

Run arithmetic boundary checks in debug and release profiles. Confirm rejected overflow never produces a committed update or an accepted identifier.

For float input, challenge NaN, both infinities, signed zero, subnormal and near-boundary finite values where relevant. Include finite inputs whose computation produces a non-finite output.

Verify the chosen sorting policy over all accepted classes. If hashing a custom numeric wrapper, test the equality/hash relationship over normalized representations rather than expecting arbitrary hash values.

Check exact rounding thresholds for money or unit conversion. Use independent expected values; a second call to the same arithmetic helper is not a useful oracle.

Check target-width assumptions where wire or index conversions are affected. A run on one 64-bit target does not verify a 32-bit deployment.

Document the compiler/profile and operations exercised. Numeric examples tested on one toolchain do not certify minimum-version support or real application throughput.
