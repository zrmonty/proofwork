# Conversion contracts

Choose input domain, output meaning, ownership and rejection policy before resolving inference. A representable primitive can still violate ID, amount, timestamp or allocation policy.

[From](https://doc.rust-lang.org/std/convert/trait.From.html) expresses a meaningful infallible value conversion and supplies Into. Ordinary rejected input needs [TryFrom/TryInto](https://doc.rust-lang.org/std/convert/trait.TryFrom.html), not panic inside From or a silent default. Several plausible rounding/format policies deserve a named operation. Generic Into bounds must serve actual callers. Preserve recovery information internally even when presentation redacts it; do not log sensitive rejected values.

## Loss and validation

[as casts](https://doc.rust-lang.org/reference/expressions/operator-expr.html#type-cast-expressions) can truncate integer bits, alter signed meaning, lose floating precision or narrow floats. Float-to-integer truncates toward zero, saturates destination bounds and maps NaN to zero. These are language semantics, not domain validation.

Validate application bounds as well as representability. Check intermediate arithmetic before conversion/allocation; saturation/wrapping must be intended policy. Floating input needs finite-value and rounding rules. Not every imagined numeric pair has TryFrom: inspect supported implementations, then use a small checked operation where needed. Pointer reinterpretation belongs to [unsafe obligations](unsafe-ffi-and-invariants.md), not parsing.

## Views and inference

[AsRef](https://doc.rust-lang.org/std/convert/trait.AsRef.html) exposes a borrowed view; ordinary internal &T often suffices. [Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html) additionally promises compatible equality/order/hash identity: case-insensitive keys cannot claim ordinary case-sensitive str merely to avoid allocation. [Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html) offers pointer-like implicit coercion/method access and can expose invariants or future conflicts. A named accessor is a smaller promise for domain wrappers.

&&T reveals a reference after one dereference, not another owned value. Coercion cannot grant ownership, extend lifetime or invent a trait implementation. Use [reference-depth reasoning](copy-clone-and-reference-depth.md) rather than unsafe casts/helper chains.

[FromStr](https://doc.rust-lang.org/std/str/trait.FromStr.html) parses into a value without an input lifetime for borrowed output. A separate borrowed parser may be needed. Specify grammar, whitespace, signs, separators, locale, units, trailing/empty input and domain range. Significant identifiers must not be silently trimmed. Display is not automatically stable interchange; promised round trips need explicit tests.

Target annotations and turbofish reveal the selected output type, not validation. Vec preserves sequence/duplicates; sets discard duplicates; maps choose duplicate-key behavior. Decide representation before selecting whichever annotation compiles.

Probe accepted endpoints and just-outside values, negatives into unsigned domains, precision boundaries, intermediate overflow, invalid/trailing/domain-invalid text, all public wrapper construction routes and borrowed/owned lookup agreement. Compile actual MSRV/edition/targets. Record loss/rejection policy; lint suppression or successful parsing is not domain evidence.
