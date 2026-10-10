# Absence, failure and branch ownership

Option expresses legitimate absence; Result preserves meaningful failure. Define lookup miss versus denial, expiry or inconsistent storage. Result<Option<T>,E> can separate successful misses and failures. Optional parsing must retain absent/present-valid/present-invalid outcomes. Use a domain enum for distinct pending/unknown states, not redundant booleans; do not add one for a clear temporary binary choice.

## Adapters preserve policy

[Option](https://doc.rust-lang.org/std/option/enum.Option.html) methods can consume owners. as_ref/as_mut lend views, as_deref lends a target such as str; map transforms, and_then composes optional results. flatten removes one layer only when its distinction is dispensable. transpose preserves optional failure. take/replace mutate state and require interruption/resource policy. Inspect actual types and supported stabilization versions instead of cloning unnecessarily.

[Result](https://doc.rust-lang.org/std/result/enum.Result.html) propagation through ? does not retry, roll back or log. Preserve classifications/causes through deliberate map_err translation without disclosing sensitive payloads. ok/filter_map(Result::ok)/flatten discard errors and require an accepted rejection/accounting policy. Fallible collection is fail-fast, not partial-result preservation. Eager fallback runs even unused; lazy fallback still must not turn failure into empty success. See [iterator execution](iterator-ownership-and-consumption.md) and [API errors](api-errors-and-transitions.md).

## Patterns and decisions

Owned destructuring can move non-Copy fields; borrowed matching can retain owners. Match ergonomics may infer references; an explicit reference pattern matches shape while ref changes a binding's borrowing mode. Partial moves and Drop types have restrictions. Compile the actual edition's [patterns](https://doc.rust-lang.org/reference/patterns.html); annotate a confusing intermediate rather than adding stars. Domain roles deserve named fields when tuple positions impose memory burden.

match suits exhaustive domain/recovery decisions. Explicit variants reveal added cases; wildcards can silently hide them. if let is suitable only when ignoring other shapes is intentional. let else requires a diverging rejected path without erasing malformed-versus-absent distinctions. Guards do not establish exhaustiveness; avoid effectful predicates. matches! classifies booleans rather than extracting payload. Public non-exhaustive compatibility may require fallback even when internal closed states benefit from exhaustiveness.

unwrap/expect need a demonstrated invariant or intentional test failure, not an earlier successful input version. User/I/O/resource/concurrent failures remain recoverable when callers can respond. Panic messages must name safe invariants; unsafe unchecked replacements can turn visible failure into undefined behavior. Document public panic conditions and effects/destruction assumptions.

Probe optional parsing's three outcomes, every recovery class, retained failed-stream evidence and harmless eager-fallback counters. Compile borrowed matches followed by non-Copy owner reuse and relevant compile-fail moves/borrows. Temporary added variants can challenge intended exhaustiveness. Decision checks do not certify canceled effects, rollback or retry safety; consumer compatibility follows [downstream guidance](downstream-compatibility.md).
