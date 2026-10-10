# Transformations and aliasing

Use this reference when a transformation changes collections, nested values, or performance-sensitive logic.

## Preserve the intended value

Suppose an API returns updated invoice lines while leaving the supplied invoice unchanged:

```ts
type Line = Readonly<{ id: string; quantity: number; unitPrice: number }>;
type Invoice = Readonly<{ id: string; lines: readonly Line[] }>;

function changeQuantity(invoice: Invoice, id: string, quantity: number): Invoice {
  return {
    ...invoice,
    lines: invoice.lines.map(line =>
      line.id === id ? { ...line, quantity } : line
    ),
  };
}
```

The boundary is responsible for valid IDs and quantities according to the API contract. This example shares unchanged line objects deliberately; it does not promise a deep copy or define missing-ID behavior. A caller that needs independently mutable nested values needs a different contract. Readonly types describe permitted operations to the type checker; they do not by themselves stop other runtime code from mutating shared objects.

Choose copying at the level that will change. Copying only the outer array before assigning a nested field still changes the original object's field. Conversely, deep-copying a large immutable domain value can waste work and erase identity that an incumbent UI uses.

## A loop is not an effect

```ts
function sumQuantities(lines: readonly Line[]): number {
  let total = 0;
  for (const line of lines) total += line.quantity;
  return total;
}
```

This is a pure calculation: the accumulator is private and does not escape. A reducer is also reasonable. Select the form that makes the rule and error behavior easier to read; purity does not require a particular iterator method.

Avoid multi-stage pipelines when they obscure early exit, error context, or costly copies. If an optimization changes allocation or mutation strategy, verify both the caller contract and representative performance. Do not claim that functional code is necessarily faster or slower.

## Supply unstable dependencies

A due-date calculation should receive the effective date and the relevant domain rules. The boundary chooses the clock/timezone policy. A random allocation decision should receive a generated sample or deterministic dependency when that is the actual contract. Passing dependencies does not settle the correctness of timezone rules, distributions, or numeric precision; those remain domain questions.

Do not inject every ordinary library function. Expose dependencies when doing so makes variability, effects, or domain policy visible. More parameters are useful only when they make the function's behavior easier to explain and verify.

## Refactoring must preserve observable semantics

Purity permits reasoning from values; it does not make every rearrangement equivalent. Before fusing, sorting, parallelizing or memoizing a calculation, preserve input order, duplicates, short-circuiting, selected error, numeric rounding and overflow policy. Floating-point addition is not associative: `(1e16 + -1e16) + 1` and `1e16 + (-1e16 + 1)` can produce different results. A parallel reduction needs an acceptable precision contract, not just a pure callback.

An eager map followed by validation can perform work on later records that a fail-fast loop would never visit. For a total pure operation that may be acceptable; for expensive computations or fallible callbacks it can change latency and the error reported. A lazy iterator also moves execution and failure into the consumer's lifetime. Test the promised behavior rather than treating pipeline syntax as evidence of equivalence.

Memoization needs a complete key and a bounded owner. Hidden configuration, time, mutable objects or user identity can make equal-looking calls differ. Caching a mutable result can let one caller change another's answer. Introduce caching only for a demonstrated need and preserve isolation, invalidation and memory limits; the application's existing cache is preferable to a new generic memoizer.
