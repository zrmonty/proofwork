# Domain contracts

## Decode once, then calculate

A scheduling endpoint accepting `{ retries: number }` needs more than `JSON.parse(text) as { retries: number }`. Parsing establishes JSON syntax, while the cast suppresses the shape and range questions. Keep syntax, shape, and business validation distinct so errors remain useful. This original example uses no schema dependency:

```ts
type RetryPolicy = Readonly<{ retries: number }>;
type DecodeResult =
  | { ok: true; value: RetryPolicy }
  | { ok: false; message: string };

function decodeRetryPolicy(input: unknown): DecodeResult {
  if (typeof input !== "object" || input === null || !("retries" in input)) {
    return { ok: false, message: "Expected an object with retries" };
  }
  const retries = input.retries;
  if (typeof retries !== "number" || !Number.isSafeInteger(retries)
      || retries < 0 || retries > 8) {
    return { ok: false, message: "retries must be an integer from 0 through 8" };
  }
  return { ok: true, value: { retries } };
}

function parseRetryPolicy(text: string): DecodeResult {
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return { ok: false, message: "Invalid JSON" };
  }
  return decodeRetryPolicy(input);
}
```

The decoder accepts extra fields by policy. Reject them only when the real contract requires it. It constructs a fresh value rather than aliasing the source. The range `0..8` is this example's product rule, not a universal retry limit. A transport adapter can translate the result into the existing HTTP/error convention.

Review zero, eight, nine, negative and fractional values, null, missing fields, and malformed JSON. `typeof value === "number"` alone does not establish the numeric policy. [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) explains how runtime checks refine static types; the checks must also enforce domain meaning.

## Required data belongs to its state

A record such as `{ status: string; url?: string; error?: string }` permits a successful export without a URL and a pending export with an error left over from a previous attempt. Model each valid combination instead:

```ts
type ExportState =
  | { kind: "pending" }
  | { kind: "ready"; url: string }
  | { kind: "failed"; message: string };

function unreachable(value: never): never {
  throw new Error("Unhandled export state");
}

function exportLabel(state: ExportState): string {
  switch (state.kind) {
    case "pending": return "Preparing export";
    case "ready": return `Download ${state.url}`;
    case "failed": return state.message;
    default: return unreachable(state);
  }
}
```

Adding `cancelled` identifies consumers needing a decision through the `never` check. This is internal exhaustiveness, not a decoder: a network object still needs validation. If a forward-compatible wire protocol permits unknown states, model that policy at the wire boundary rather than asserting them into a closed union.

## Public signatures serve callers

Accept `readonly Item[]` when only observing items. Return the actual result shape rather than erasing variants behind `object` or `any`. Separate transport and domain shapes when dates, missing fields, decimal amounts, or versioning differ.

Be deliberate about null, omitted properties, and undefined: serializers and compiler settings can distinguish them. Preserve the established protocol when changing an optional field. Do not substitute truthiness for a missing-value test if zero or an empty string is valid.

For each wrapper, overload, or generic, ask which invalid call it prevents or which consumer it enables. Remove machinery with no concrete answer. If a checked value can later be mutated, a type label alone cannot preserve its invariant; control ownership or revalidate when trust changes.
